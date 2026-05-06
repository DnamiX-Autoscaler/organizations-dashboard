import ENDPOINTS from "../../config/endpoint";

const historicalTimeSeriesService = {
    /**
     * Fetch historical time-series data for a given date range.
     *
     * @param {{ lookbackDays: number, stepSeconds: number, signal?: AbortSignal }} params
     * @returns {Promise<{ query_range: object, services: object }>}
     */
    async fetchDateRange({ lookbackDays = 7, stepSeconds = 24000, signal } = {}) {
        const url = `${ENDPOINTS.TIMESERIES.DATE_RANGE}?lookback_days=${lookbackDays}&step_seconds=${stepSeconds}`;

        const response = await fetch(url, { signal });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
    },
};

export default historicalTimeSeriesService;