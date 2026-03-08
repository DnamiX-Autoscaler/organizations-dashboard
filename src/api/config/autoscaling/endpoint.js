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
        STREAM: "/alerts/stream"
    },
    CHAOS: {
        STREAM: "/events/chaos"
    },
    DEPLOYMENT_HEALTH: {
        REPORT: "/deployment-health/report",
        STREAM: "/events/deployment-health"
    },
    SCALE_WITH_METRICS: {
        GET: "/scale-with-metrics"
    }
};

export default AUTOSCALING_ENDPOINTS;
