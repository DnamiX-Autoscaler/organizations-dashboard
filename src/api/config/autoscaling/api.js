import AUTOSCALING_ENDPOINTS from "./endpoint";

const envBaseUrl = import.meta.env.VITE_Auto_Scaling_Base_Url;
const BASE_URL = import.meta.env.DEV
    ? "/api/v1"
    : (envBaseUrl || "/api/v1");

const createStream = (endpoint, onMessage, onError, queryParams = {}) => {
    // Build query string from parameters
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            params.append(key, value.toString());
        }
    });
    
    const queryString = params.toString();
    const url = `${BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;
    
    console.log(`🔌 Frontend Socket.io initialized at ${url}`);
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

/**
 * Get scaling events stream with optional pagination
 * @param {Function} onMessage - Callback for receiving messages
 * @param {Function} onError - Callback for errors
 * @param {Object} options - Pagination options
 * @param {boolean} options.all - Get all records (default: false)
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Records per page (default: 50)
 * 
 * @example
 * // Get all records
 * getScalingEventsStream(onMessage, onError, { all: true })
 * 
 * // Get paginated records
 * getScalingEventsStream(onMessage, onError, { page: 1, limit: 10 })
 * 
 * // Use default behavior (50 most recent records)
 * getScalingEventsStream(onMessage, onError)
 */
export const getScalingEventsStream = (onMessage, onError, options = {}) => {
    return createStream(AUTOSCALING_ENDPOINTS.SCALING_EVENTS.STREAM, onMessage, onError, options);
};

/**
 * Get resilience metrics stream with optional pagination
 * @param {Function} onMessage - Callback for receiving messages
 * @param {Function} onError - Callback for errors
 * @param {Object} options - Pagination options
 * @param {boolean} options.all - Get all records (default: false)
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Records per page (default: 50)
 * 
 * @example
 * // Get all records
 * getResilienceMetricsStream(onMessage, onError, { all: true })
 * 
 * // Get paginated records
 * getResilienceMetricsStream(onMessage, onError, { page: 1, limit: 10 })
 * 
 * // Use default behavior (50 most recent records)
 * getResilienceMetricsStream(onMessage, onError)
 */
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

/**
 * Get scale with metrics data with pagination
 * @param {Object} options - Pagination options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Records per page (default: 10)
 * 
 * @example
 * // Get paginated records
 * getScaleWithMetrics({ page: 1, limit: 10 })
 */
export const getScaleWithMetrics = async (options = {}) => {
    const { page = 1, limit = 10 } = options;
    
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        });
        
        const url = `${BASE_URL}${AUTOSCALING_ENDPOINTS.SCALE_WITH_METRICS.GET}?${params}`;
        console.log(`📊 Fetching scale with metrics: ${url}`);
        
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
