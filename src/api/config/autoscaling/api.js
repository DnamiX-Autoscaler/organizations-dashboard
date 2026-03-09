import AUTOSCALING_ENDPOINTS from "./endpoint";

const envBaseUrl = import.meta.env.VITE_Auto_Scaling_Base_Url;
const sseFlag = import.meta.env.VITE_ENABLE_AUTOSCALING_SSE;
const sseEnabled =
    sseFlag === "true" ||
    sseFlag === "1" ||
    (!import.meta.env.DEV && sseFlag !== "false" && sseFlag !== "0");

const NOOP_STREAM = { close: () => {} };
let sseDisabledNoticeShown = false;

const BASE_URL = import.meta.env.DEV
    ? "/api/v1"
    : (envBaseUrl || "/api/v1");

const createStream = (endpoint, onMessage, onError, queryParams = {}) => {
    if (!sseEnabled) {
        if (!sseDisabledNoticeShown) {
            console.info("Autoscaling SSE streams are disabled. Set VITE_ENABLE_AUTOSCALING_SSE=true to enable realtime streams.");
            sseDisabledNoticeShown = true;
        }
        return NOOP_STREAM;
    }

    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            params.append(key, value.toString());
        }
    });

    const queryString = params.toString();
    const url = `${BASE_URL}${endpoint}${queryString ? `?${queryString}` : ""}`;

    console.log(`SSE stream initialized at ${url}`);
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            onMessage(data);
        } catch (err) {
            console.error(`Error parsing stream data from ${endpoint}:`, err);
        }
    };

    eventSource.onerror = (err) => {
        console.error(`SSE Connection Error (${endpoint}):`, err);
        if (onError) onError(err);
        eventSource.close();
    };

    return eventSource;
};

export const getScalingEventsStream = (onMessage, onError, options = {}) => {
    return createStream(AUTOSCALING_ENDPOINTS.SCALING_EVENTS.STREAM, onMessage, onError, options);
};

export const getResilienceMetricsStream = (onMessage, onError, options = {}) => {
    return createStream(AUTOSCALING_ENDPOINTS.RESILIENCE_METRICS.STREAM, onMessage, onError, options);
};

export const getDeploymentStatusStream = (onMessage, onError, options = {}) => {
    return createStream(AUTOSCALING_ENDPOINTS.DEPLOYMENT_STATUS.STREAM, onMessage, onError, options);
};

export const getAlertsStream = (onMessage, onError, options = {}) => {
    return createStream(AUTOSCALING_ENDPOINTS.ALERTS.STREAM, onMessage, onError, options);
};

export const getChaosStream = (onMessage, onError, options = {}) => {
    return createStream(AUTOSCALING_ENDPOINTS.CHAOS.STREAM, onMessage, onError, options);
};

export const getDeploymentHealthStream = (onMessage, onError, options = {}) => {
    return createStream(AUTOSCALING_ENDPOINTS.DEPLOYMENT_HEALTH.STREAM, onMessage, onError, options);
};

export const publishAlert = async (alertData) => {
    try {
        const response = await fetch(`${BASE_URL}${AUTOSCALING_ENDPOINTS.ALERTS.PUBLISH}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(alertData),
        });
        return await response.json();
    } catch (err) {
        console.error("Error publishing alert:", err);
        throw err;
    }
};

export const getScaleWithMetrics = async (options = {}) => {
    const { page = 1, limit = 10 } = options;

    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        const url = `${BASE_URL}${AUTOSCALING_ENDPOINTS.SCALE_WITH_METRICS.GET}?${params}`;
        console.log(`Fetching scale with metrics: ${url}`);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Error fetching scale with metrics:", err);
        throw err;
    }
};
