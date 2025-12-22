// Mock configuration data for different levels
export const mockConfigurations = {
    node: [
        {
            id: "node-1",
            name: "docker-desktop",
            enabled: true,
            metrics: ["cpu", "memory", "disk", "network"],
            scrapeInterval: "15s",
            lastUpdated: "2024-01-15T10:30:00Z",
            status: "active",
        },
    ],
    pod: [
        {
            id: "pod-1",
            name: "prometheus-kube-prometheus-prometheus",
            namespace: "monitoring",
            enabled: true,
            metrics: ["cpu", "memory", "restart_count"],
            scrapeInterval: "30s",
            lastUpdated: "2024-01-15T10:25:00Z",
            status: "active",
        },
        {
            id: "pod-2",
            name: "store-front",
            namespace: "default",
            enabled: true,
            metrics: ["cpu", "memory", "network"],
            scrapeInterval: "30s",
            lastUpdated: "2024-01-15T10:20:00Z",
            status: "active",
        },
        {
            id: "pod-3",
            name: "mongodb-0",
            namespace: "default",
            enabled: false,
            metrics: ["cpu", "memory"],
            scrapeInterval: "30s",
            lastUpdated: "2024-01-14T15:00:00Z",
            status: "inactive",
        },
    ],
    app: [
        {
            id: "app-1",
            name: "Store Frontend",
            type: "web",
            enabled: true,
            metrics: ["http_requests", "response_time", "error_rate"],
            scrapeInterval: "10s",
            endpoint: "/metrics",
            port: 8080,
            lastUpdated: "2024-01-15T10:35:00Z",
            status: "active",
        },
        {
            id: "app-2",
            name: "Order Service",
            type: "api",
            enabled: true,
            metrics: ["http_requests", "response_time", "database_queries"],
            scrapeInterval: "15s",
            endpoint: "/actuator/prometheus",
            port: 3000,
            lastUpdated: "2024-01-15T10:30:00Z",
            status: "active",
        },
    ],
    service: [
        {
            id: "svc-1",
            name: "prometheus-kube-prometheus-prometheus",
            namespace: "monitoring",
            type: "ClusterIP",
            enabled: true,
            metrics: ["request_duration", "active_connections"],
            scrapeInterval: "15s",
            port: 9090,
            lastUpdated: "2024-01-15T10:40:00Z",
            status: "active",
        },
        {
            id: "svc-2",
            name: "store-front",
            namespace: "default",
            type: "LoadBalancer",
            enabled: true,
            metrics: ["request_count", "response_time"],
            scrapeInterval: "30s",
            port: 80,
            lastUpdated: "2024-01-15T10:35:00Z",
            status: "active",
        },
    ],
};

// Available metrics for each level
export const availableMetrics = {
    node: [
        { value: "cpu", label: "CPU Usage" },
        { value: "memory", label: "Memory Usage" },
        { value: "disk", label: "Disk I/O" },
        { value: "network", label: "Network Traffic" },
        { value: "load", label: "System Load" },
    ],
    pod: [
        { value: "cpu", label: "CPU Usage" },
        { value: "memory", label: "Memory Usage" },
        { value: "restart_count", label: "Restart Count" },
        { value: "network", label: "Network I/O" },
        { value: "storage", label: "Storage Usage" },
    ],
    app: [
        { value: "http_requests", label: "HTTP Requests" },
        { value: "response_time", label: "Response Time" },
        { value: "error_rate", label: "Error Rate" },
        { value: "database_queries", label: "Database Queries" },
        { value: "cache_hits", label: "Cache Hit Rate" },
    ],
    service: [
        { value: "request_duration", label: "Request Duration" },
        { value: "active_connections", label: "Active Connections" },
        { value: "request_count", label: "Request Count" },
        { value: "response_time", label: "Response Time" },
        { value: "error_count", label: "Error Count" },
    ],
};

// Scrape interval options
export const scrapeIntervals = [
    { value: "10s", label: "10 seconds" },
    { value: "15s", label: "15 seconds" },
    { value: "30s", label: "30 seconds" },
    { value: "1m", label: "1 minute" },
    { value: "5m", label: "5 minutes" },
];

// Fetch configurations for a specific level
export const fetchConfigurations = async (level) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockConfigurations[level] || []);
        }, 500);
    });
};

// Get configuration statistics
export const getConfigurationStatistics = (configs) => {
    const active = configs.filter((c) => c.status === "active").length;
    const inactive = configs.filter((c) => c.status === "inactive").length;
    const enabled = configs.filter((c) => c.enabled).length;
    const total = configs.length;

    return {
        total,
        active,
        inactive,
        enabled,
        disabled: total - enabled,
    };
};
