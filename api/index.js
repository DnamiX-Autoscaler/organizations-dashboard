import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CSV_PATH = join(__dirname, "..", "server", "data.csv");

let _simCache = null;
let _fullCache = null;

const _parseSortedRows = () => {
  const raw = readFileSync(CSV_PATH, "utf8");
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const vals = line.split(",");
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = vals[i]?.trim() ?? "";
    });
    return obj;
  });
  rows.sort((a, b) => +new Date(a.timestamp) - +new Date(b.timestamp));
  return rows;
};

const parseSimulationCSV = () => {
  if (_simCache) return _simCache;
  const rows = _fullCache ?? _parseSortedRows();
  const split = Math.floor(rows.length * 0.7);
  _simCache = { total: rows.length, data: rows.slice(split) };
  return _simCache;
};

const parseFullCSV = () => {
  if (_fullCache) return _fullCache;
  _fullCache = _parseSortedRows();
  return _fullCache;
};

export default function handler(req, res) {
  const { url, method } = req;

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (method === "OPTIONS") return res.status(200).end();

  try {
    if (url.startsWith("/api/simulation-data")) {
      const { total, data } = parseSimulationCSV();
      return res.status(200).json({
        total_rows: total,
        simulation_rows: data.length,
        data,
      });
    }

    if (url.startsWith("/api/scenario-candidates")) {
      // Return full dataset for scenario selection
      const allRows = parseFullCSV();
      return res.status(200).json({ rows: allRows.length });
    }

    return res.status(404).json({ error: "Not found" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
