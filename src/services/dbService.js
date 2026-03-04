import axios from "axios";

const DB_API = "/api"; // proxied to http://localhost:5000 via vite

// ─── Predictions ─────────────────────────────────────────────────────────────

export const loadPredictions = async () => {
  try {
    const res = await axios.get(`${DB_API}/predictions`);
    return res.data;
  } catch {
    return [];
  }
};

export const savePrediction = async (entry) => {
  try {
    await axios.post(`${DB_API}/predictions`, entry);
  } catch (err) {
    console.warn("Failed to persist prediction:", err.message);
  }
};

export const clearPredictions = async () => {
  try {
    await axios.delete(`${DB_API}/predictions`);
  } catch (err) {
    console.warn("Failed to clear predictions:", err.message);
  }
};

// ─── Logs ─────────────────────────────────────────────────────────────────────

export const loadLogs = async () => {
  try {
    const res = await axios.get(`${DB_API}/logs`);
    return res.data;
  } catch {
    return [];
  }
};

export const saveLog = async (entry) => {
  try {
    await axios.post(`${DB_API}/logs`, entry);
  } catch (err) {
    console.warn("Failed to persist log:", err.message);
  }
};

export const saveLogs = async (entries) => {
  if (!entries || entries.length === 0) return;
  try {
    await axios.post(`${DB_API}/logs/batch`, entries);
  } catch (err) {
    console.warn("Failed to persist logs batch:", err.message);
  }
};

export const clearLogs = async () => {
  try {
    await axios.delete(`${DB_API}/logs`);
  } catch (err) {
    console.warn("Failed to clear logs:", err.message);
  }
};

// ─── Model Metrics ────────────────────────────────────────────────────────────

export const loadModelMetrics = async () => {
  try {
    const res = await axios.get(`${DB_API}/model-metrics`);
    return res.data;
  } catch {
    return null;
  }
};

export const saveModelMetrics = async (metrics) => {
  try {
    await axios.put(`${DB_API}/model-metrics`, metrics);
  } catch (err) {
    console.warn("Failed to persist model metrics:", err.message);
  }
};
