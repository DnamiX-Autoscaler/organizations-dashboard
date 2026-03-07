/// <reference types="node" />
import process from "node:process";
import { readFileSync } from "node:fs";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ml_dashboard";

// ─── Mongoose Models ─────────────────────────────────────────────────────────

const predictionSchema = new mongoose.Schema({
  time:        { type: String, required: true },
  currentPods: { type: Number, required: true },
  predicted:   { type: Number, required: true },
  actualAtT5:  { type: Number, required: true },
  error:       { type: Number, required: true },
  createdAt:   { type: Date, default: Date.now },
});

const logSchema = new mongoose.Schema({
  timestamp: { type: String, required: true },
  level:     { type: String, required: true },
  message:   { type: String, required: true },
  details:   { type: mongoose.Schema.Types.Mixed, default: null },
  createdAt: { type: Date, default: Date.now },
});

const modelMetricsSchema = new mongoose.Schema({
  sessionId:        { type: String, default: "default" },
  mae:              Number,
  rmse:             Number,
  accuracy:         Number,
  accuracyWithin1:  Number,
  totalPredictions: Number,
  underCount:       Number,
  exactCount:       Number,
  overCount:        Number,
  updatedAt:        { type: Date, default: Date.now },
});

const Prediction   = mongoose.model("Prediction", predictionSchema);
const Log          = mongoose.model("Log", logSchema);
const ModelMetrics = mongoose.model("ModelMetrics", modelMetricsSchema);

// ─── Routes: Simulation Data (local CSV) ────────────────────────────────────

// Reads data.csv once, returns the last 30% as JSON.
// This endpoint starts in <50 ms and has no dependency on the remote ML API,
// so the frontend simulation queue populates instantly on every page load.
const CSV_PATH = join(__dirname, "..", "backend", "data", "data.csv");
let _simCache = null;  // cache after first parse (last 30%)
let _fullCache = null; // cache for full sorted dataset (all rows)

// ─── Parse helpers ───────────────────────────────────────────────────────────

const _parseSortedRows = () => {
  const raw = readFileSync(CSV_PATH, "utf8");
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const vals = line.split(",");
    const obj = {};
    headers.forEach((h, i) => { obj[h] = vals[i]?.trim() ?? ""; });
    return obj;
  });
  rows.sort((a, b) => +new Date(a.timestamp) - +new Date(b.timestamp));
  return rows;
};

const parseSimulationCSV = () => {
  if (_simCache) return _simCache;
  const rows = _fullCache ?? _parseSortedRows();
  // Sort by timestamp, take last 30%
  const split = Math.floor(rows.length * 0.7);
  _simCache = { total: rows.length, data: rows.slice(split) };
  return _simCache;
};

// Full sorted dataset — used by the scenario-candidates endpoint so it can
// search the richly-varied first 70% (pods 2-30, RPS 18-2188) for the best
// matching segments, then return them with their 48-row BiLSTM warmup context.
const parseFullCSV = () => {
  if (_fullCache) return _fullCache;
  _fullCache = _parseSortedRows();
  return _fullCache;
};

// ─── Scenario scoring (mirrors client-side findRealScenarioRows) ─────────────

// Returns a scalar score for how well an RPS window matches a traffic pattern.
// Higher is better; used to select the best segment from the full dataset.
const scoreWindow = (type, rpsWin) => {
  const n = rpsWin.length;
  if (n === 0) return -Infinity;
  const rpsMax = Math.max(...rpsWin) || 1;
  const norm = rpsWin.map((v) => v / rpsMax);
  if (type === "load_test") {
    const avg = norm.reduce((s, v) => s + v, 0) / n;
    const std = Math.sqrt(norm.reduce((s, v) => s + (v - avg) ** 2, 0) / n) || 1;
    return avg - std * 0.5;
  }
  if (type === "flash_sale") {
    const peakIdx = norm.indexOf(Math.max(...norm));
    const mid = (n - 1) / 2;
    const centreScore = 1 - Math.abs(peakIdx - mid) / n;
    return norm[peakIdx] * centreScore;
  }
  if (type === "gradual_ramp") {
    const xMean = (n - 1) / 2;
    const yMean = norm.reduce((s, v) => s + v, 0) / n;
    const num   = norm.reduce((s, v, j) => s + (j - xMean) * (v - yMean), 0);
    const denX  = Math.sqrt(norm.reduce((s, _, j) => s + (j - xMean) ** 2, 0));
    const denY  = Math.sqrt(norm.reduce((s, v) => s + (v - yMean) ** 2, 0));
    const r = denX * denY === 0 ? 0 : num / (denX * denY);
    const gain  = norm[n - 1] - norm[0];
    return r * 0.7 + gain * 0.3;
  }
  return 0;
};

app.get("/api/simulation-data", (_req, res) => {
  try {
    const { total, data } = parseSimulationCSV();
    res.json({ total_rows: total, simulation_rows: data.length, data });
  } catch (err) {
    console.error("simulation-data error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── Routes: Scenario candidates ─────────────────────────────────────────────

// GET /api/scenario-candidates
//
// Pre-selects the best matching segment for each of the 3 load-test scenario
// types from the FULL dataset (first 70% = ~30 240 rows, covering pods 2-30
// and RPS 18-2 188 — much richer than the last-30% simulation zone).
//
// Returns, per type:
//   context  — 48 rows immediately before the chosen segment.
//              The frontend feeds these into the BiLSTM lookback window so
//              the model always starts with in-distribution context, giving
//              accurate predictions from the very first spike tick.
//   scenario — N rows of the actual spike, tagged with _isSpike / _spikeType.
//
// Response is cached on first call (< 2 s); subsequent calls return instantly.
let _candidatesCache = null;

app.get("/api/scenario-candidates", (_req, res) => {
  try {
    if (_candidatesCache) return res.json(_candidatesCache);

    const allRows   = parseFullCSV();
    // First 70% — richer traffic: pods up to 30, RPS up to 2188
    const pool      = allRows.slice(0, Math.floor(allRows.length * 0.7));
    const CONTEXT   = 48;                           // BiLSTM lookback size
    const ROW_COUNT = { flash_sale: 20, gradual_ramp: 25, load_test: 20 };

    const result = {};
    for (const type of ["flash_sale", "gradual_ramp", "load_test"]) {
      const rowCount   = ROW_COUNT[type];
      // Ensure CONTEXT rows are always available before every candidate
      const searchPool = pool.slice(CONTEXT);
      const rpsValues  = searchPool.map((r) => parseFloat(r.request_rate_rps) || 0);

      let bestStart = 0;
      let bestScore = -Infinity;
      for (let i = 0; i <= searchPool.length - rowCount; i++) {
        const win   = rpsValues.slice(i, i + rowCount);
        const score = scoreWindow(type, win);
        if (score > bestScore) { bestScore = score; bestStart = i; }
      }

      // bestStart is relative to searchPool (which starts at CONTEXT in pool)
      const absStart    = CONTEXT + bestStart;
      const contextRows = pool.slice(absStart - CONTEXT, absStart);
      const scenarioRows = searchPool
        .slice(bestStart, bestStart + rowCount)
        .map((r) => ({ ...r, _isSpike: true, _spikeType: type }));

      result[type] = { context: contextRows, scenario: scenarioRows };
    }

    _candidatesCache = result;
    res.json(result);
  } catch (err) {
    console.error("scenario-candidates error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── Routes: Predictions ─────────────────────────────────────────────────────

// GET all predictions (newest first, capped at 500)
app.get("/api/predictions", async (req, res) => {
  try {
    const data = await Prediction.find().sort({ createdAt: 1 }).limit(500);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST save a prediction entry
app.post("/api/predictions", async (req, res) => {
  try {
    const entry = await Prediction.create(req.body);
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE clear all prediction history
app.delete("/api/predictions", async (req, res) => {
  try {
    await Prediction.deleteMany({});
    res.json({ message: "Predictions cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Routes: Logs ────────────────────────────────────────────────────────────

// GET logs (newest first, capped at 500)
app.get("/api/logs", async (req, res) => {
  try {
    const data = await Log.find().sort({ createdAt: 1 }).limit(500);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST save a single log entry
app.post("/api/logs", async (req, res) => {
  try {
    const entry = await Log.create(req.body);
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST save batch of log entries
app.post("/api/logs/batch", async (req, res) => {
  try {
    const entries = await Log.insertMany(req.body);
    res.status(201).json({ count: entries.length });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE clear all logs
app.delete("/api/logs", async (req, res) => {
  try {
    await Log.deleteMany({});
    res.json({ message: "Logs cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Routes: Model Metrics ───────────────────────────────────────────────────

// GET latest metrics snapshot
app.get("/api/model-metrics", async (req, res) => {
  try {
    const metrics = await ModelMetrics.findOne({ sessionId: "default" });
    res.json(metrics || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT upsert metrics snapshot
app.put("/api/model-metrics", async (req, res) => {
  try {
    const metrics = await ModelMetrics.findOneAndUpdate(
      { sessionId: "default" },
      { ...req.body, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Start ───────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`✅ MongoDB connected: ${MONGO_URI}`);
    app.listen(PORT, () => console.log(`🚀 DB server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
