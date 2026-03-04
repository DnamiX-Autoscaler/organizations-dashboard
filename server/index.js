/// <reference types="node" />
import process from "node:process";
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
