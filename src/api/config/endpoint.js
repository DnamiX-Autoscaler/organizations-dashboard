const ENDPOINTS = {
    PROCESS: {
        STREAM: "/process/live-stream",
    },
    PERFORMANCE: {
        STREAM: "/performance/live-stream",
    },
    NODE: {
        STREAM: "/nodes/live-stream",
    },
    POD: {
        STREAM: "/pods/live-stream",
    },
    APP: {
        STREAM: "/apps/live-stream",
    },
    MESH: {
        STREAM: "/mesh/live-stream",
    },
    STRESS_INDEX: {
        STREAM: "/stress-index/live-stream",
    },
    GRAPH_CENTRALITY: {
        STREAM: "/graph/centrality/live-stream",
    },
    CONFIG: {
        GET: "/config/runtime",
    },
    RUNNING_PODS: {
        GET: "/runtime/pods",
    },
    RUNNING_SERVICES: {
        GET: "/runtime/services",
    },
    MONITORING_SERVICES: {
        GET: "/runtime/monitoring/services",
    },
    METRICS_EXPORT: {
        STREAM: "/metrics/live-stream",
    },
};

export default ENDPOINTS;
