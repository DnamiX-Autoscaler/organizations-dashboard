const AUTOSCALING_ENDPOINTS = {
    SCALING_EVENTS: {
        STREAM: "/scaling-events/stream",
    },
    RESILIENCE_METRICS: {
        STREAM: "/resilience-metrics/stream",
    },
    DEPLOYMENT_STATUS: {
        STREAM: "/deployment-status/stream",
    },
    ALERTS: {
        PUBLISH: "/alerts/publish",
    },
};

export default AUTOSCALING_ENDPOINTS;
