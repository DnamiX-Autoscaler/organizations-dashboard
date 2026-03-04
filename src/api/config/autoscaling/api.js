import AUTOSCALING_ENDPOINTS from "./endpoind";

const envBaseUrl = import.meta.env.VITE_Auto_Scaling_Base_Url;
const BASE_URL = import.meta.env.DEV
    ? "/api/v1"
    : (envBaseUrl || "/api/v1");

const createStream = (endpoint, onMessage, onError) => {
    const url = `${BASE_URL}${endpoint}`;
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

export const getScalingEventsStream = (onMessage, onError) => {
    return createStream(AUTOSCALING_ENDPOINTS.SCALING_EVENTS.STREAM, onMessage, onError);
};

export const getResilienceMetricsStream = (onMessage, onError) => {
    return createStream(AUTOSCALING_ENDPOINTS.RESILIENCE_METRICS.STREAM, onMessage, onError);
};

export const getDeploymentStatusStream = (onMessage, onError) => {
    return createStream(AUTOSCALING_ENDPOINTS.DEPLOYMENT_STATUS.STREAM, onMessage, onError);
};

export const getAlertsStream = (onMessage, onError) => {
    return createStream(AUTOSCALING_ENDPOINTS.ALERTS.STREAM, onMessage, onError);
};

export const getChaosStream = (onMessage, onError) => {
    return createStream(AUTOSCALING_ENDPOINTS.CHAOS.STREAM, onMessage, onError);
};

export const getDeploymentHealthStream = (onMessage, onError) => {
    return createStream(AUTOSCALING_ENDPOINTS.DEPLOYMENT_HEALTH.STREAM, onMessage, onError);
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
