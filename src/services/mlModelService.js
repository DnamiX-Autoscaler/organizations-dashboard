import axios from "axios";

const API_BASE_URL = "https://mlapi-b3h4fpduauancfcg.southeastasia-01.azurewebsites.net";

// Check API health
export const checkApiHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 2000 });
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

    const response = await axios.post(`${API_BASE_URL}/predict`, payload, { timeout: 5000 });
    return response.data;
  } catch (error) {
    console.error("ML API Prediction Failed:", error.message);
    throw error;
  }
};

/**
 * Fetch historical data for simulation (last 30%)
 */
export const fetchSimulationData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/simulation-data`, { timeout: 10000 });
    if (response.status === 200 && response.data.data) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.warn("Failed to fetch simulation data:", error.message);
    return null;
  }
};
