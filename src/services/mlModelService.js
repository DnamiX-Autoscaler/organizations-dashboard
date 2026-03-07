import axios from "axios";

// Read from .env (VITE_ML_API_URL) — change the env var instead of editing source.
const ML_API_URL  = import.meta.env.VITE_ML_API_URL ?? "https://mlapi-b3h4fpduauancfcg.southeastasia-01.azurewebsites.net";
const LOCAL_URL   = "http://localhost:5000";   // local Express server

// Check API health — generous 15 s timeout to survive cold-start
export const checkApiHealth = async () => {
  try {
    const response = await axios.get(`${ML_API_URL}/health`, { timeout: 15000 });
    return response.status === 200 ? response.data : null;
  } catch (error) {
    console.warn("ML API Health Check Failed:", error.message);
    return null;
  }
};

/**
 * Call the prediction API
 * @param {Array<Array<number>>} windowData - 48x21 matrix of feature data
 * @param {string} windowEndUtc - ISO timestamp
 */
export const predictPodScaling = async (windowData, windowEndUtc) => {
  try {
    const payload = {
      service_id: "Order",
      window_end_utc: windowEndUtc,
      input_source: "dashboard_ui",
      window_data: windowData,
    };

    const response = await axios.post(`${ML_API_URL}/predict`, payload, { timeout: 20000 });
    return response.data;
  } catch (error) {
    console.error("ML API Prediction Failed:", error.message);
    throw error;
  }
};

/**
 * Fetch scenario candidates — pre-selected segments from the FULL dataset.
 * The server searches the first 70% of data.csv (pods 2–30, RPS 18–2188) and
 * returns, per scenario type:
 *   context  — 48 real CSV rows immediately before the segment (BiLSTM warmup)
 *   scenario — N spike rows tagged with _isSpike / _spikeType
 *
 * Returns null if the local server is unavailable (graceful fallback to
 * queue-based selection inside MLModelContext).
 */
export const fetchScenarioCandidates = async () => {
  try {
    const response = await axios.get(`${LOCAL_URL}/api/scenario-candidates`, { timeout: 30000 });
    if (response.status === 200 && response.data) {
      return response.data;
    }
    return null;
  } catch (err) {
    console.warn("Failed to fetch scenario candidates:", err.message);
    return null;
  }
};
export const fetchSimulationData = async () => {
  // 1. Try local Express server (reads CSV directly — no cold-start delay)
  try {
    const response = await axios.get(`${LOCAL_URL}/api/simulation-data`, { timeout: 5000 });
    if (response.status === 200 && response.data?.data?.length > 0) {
      console.info(`Simulation data loaded from local server (${response.data.simulation_rows} rows)`);
      return response.data.data;
    }
  } catch (localErr) {
    console.warn("Local simulation-data unavailable, trying remote:", localErr.message);
  }

  // 2. Fall back to remote ML API
  try {
    const response = await axios.get(`${ML_API_URL}/simulation-data`, { timeout: 15000 });
    if (response.status === 200 && response.data?.data) {
      console.info(`Simulation data loaded from remote API (${response.data.simulation_rows} rows)`);
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.warn("Failed to fetch simulation data from remote:", error.message);
    return null;
  }
};
