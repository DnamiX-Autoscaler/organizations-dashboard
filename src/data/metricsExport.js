// Mock real-time metrics collection data
export const mockMetricsExportStatus = {
    isRunning: false,
    startTime: null,
    totalRecords: 1247,
    lastRecord: null,
    exportPath: {
        csv: "output/dataset/metrics_dataset.csv",
        json: "output/dataset/metrics_dataset.jsonl",
    },
    stats: {
        recordsPerSecond: 12,
        totalSize: { csv: 245.5, json: 312.8 },
        duration: 3847,
    },
};

// Metric field definitions
export const metricsFields = [
    { key: "timestamp", label: "Timestamp", category: "system" },
    { key: "window_size_seconds", label: "Window Size (s)", category: "system" },
    { key: "cluster_id", label: "Cluster ID", category: "system" },
    { key: "namespace", label: "Namespace", category: "system" },
    { key: "service_name", label: "Service Name", category: "system" },
    { key: "node_name", label: "Node Name", category: "system" },

    // Node metrics
    { key: "node_cpu_usage_percent", label: "Node CPU Usage (%)", category: "node" },
    { key: "node_memory_usage_percent", label: "Node Memory Usage (%)", category: "node" },
    { key: "node_memory_usage_mb", label: "Node Memory (MB)", category: "node" },
    { key: "node_network_rx_kbps", label: "Node RX (Kbps)", category: "node" },
    { key: "node_network_tx_kbps", label: "Node TX (Kbps)", category: "node" },
    { key: "node_disk_read_iops", label: "Disk Read IOPS", category: "node" },
    { key: "node_disk_write_iops", label: "Disk Write IOPS", category: "node" },

    // Pod metrics
    { key: "current_pod_count", label: "Current Pod Count", category: "pod" },
    { key: "pod_cpu_usage_percent_avg", label: "Pod CPU Avg (%)", category: "pod" },
    { key: "pod_cpu_usage_percent_p95", label: "Pod CPU P95 (%)", category: "pod" },
    { key: "pod_memory_usage_mb_avg", label: "Pod Memory Avg (MB)", category: "pod" },
    { key: "pod_memory_usage_mb_p95", label: "Pod Memory P95 (MB)", category: "pod" },
    { key: "pod_restart_count", label: "Pod Restart Count", category: "pod" },
    { key: "pod_cpu_limit_percent", label: "Pod CPU Limit (%)", category: "pod" },
    { key: "pod_memory_limit_percent", label: "Pod Memory Limit (%)", category: "pod" },

    // Application metrics
    { key: "request_rate_rps", label: "Request Rate (RPS)", category: "application" },
    { key: "success_rate_percent", label: "Success Rate (%)", category: "application" },
    { key: "error_rate_percent", label: "Error Rate (%)", category: "application" },
    { key: "http_4xx_rate_percent", label: "HTTP 4xx Rate (%)", category: "application" },
    { key: "http_5xx_rate_percent", label: "HTTP 5xx Rate (%)", category: "application" },
    { key: "latency_p50_ms", label: "Latency P50 (ms)", category: "application" },
    { key: "latency_p95_ms", label: "Latency P95 (ms)", category: "application" },
    { key: "latency_p99_ms", label: "Latency P99 (ms)", category: "application" },
    { key: "queue_length", label: "Queue Length", category: "application" },
    { key: "application_saturation_percent", label: "App Saturation (%)", category: "application" },

    // Service mesh metrics
    { key: "inbound_request_rate_rps", label: "Inbound RPS", category: "mesh" },
    { key: "outbound_request_rate_rps", label: "Outbound RPS", category: "mesh" },
    { key: "mesh_latency_p95_ms", label: "Mesh Latency P95 (ms)", category: "mesh" },
    { key: "mesh_retry_rate_rps", label: "Mesh Retry Rate (RPS)", category: "mesh" },
    { key: "mesh_tcp_open_connections", label: "TCP Connections", category: "mesh" },
    { key: "mesh_tls_error_rate_percent", label: "TLS Error Rate (%)", category: "mesh" },

    // Network topology metrics
    { key: "degree_centrality", label: "Degree Centrality", category: "topology" },
    { key: "betweenness_centrality", label: "Betweenness Centrality", category: "topology" },
    { key: "closeness_centrality", label: "Closeness Centrality", category: "topology" },
    { key: "eigenvector_centrality", label: "Eigenvector Centrality", category: "topology" },

    // Pressure indexes
    { key: "cpu_pressure_index", label: "CPU Pressure Index", category: "pressure" },
    { key: "memory_pressure_index", label: "Memory Pressure Index", category: "pressure" },
    { key: "io_pressure_index", label: "I/O Pressure Index", category: "pressure" },
    { key: "stress_index", label: "Stress Index", category: "pressure" },

    // Autoscaling
    { key: "current_replicas", label: "Current Replicas", category: "autoscaling" },
    { key: "recommended_replicas", label: "Recommended Replicas", category: "autoscaling" },
    { key: "scale_direction", label: "Scale Direction", category: "autoscaling" },
];

// Get fields by category
export const getFieldsByCategory = (category) => {
    return metricsFields.filter((field) => field.category === category);
};

// Metric categories
export const metricsCategories = [
    { key: "system", label: "System", icon: "mdi:server", color: "blue" },
    { key: "node", label: "Node", icon: "mdi:server", color: "green" },
    { key: "pod", label: "Pod", icon: "mdi:cube-outline", color: "purple" },
    { key: "application", label: "Application", icon: "mdi:application", color: "orange" },
    { key: "mesh", label: "Service Mesh", icon: "mdi:web", color: "indigo" },
    { key: "topology", label: "Topology", icon: "mdi:graph", color: "pink" },
    { key: "pressure", label: "Pressure", icon: "mdi:gauge", color: "red" },
    { key: "autoscaling", label: "Autoscaling", icon: "mdi:arrow-expand-horizontal", color: "teal" },
];

// Mock actual metrics data records
export const mockMetricsData = [
    {
        timestamp: "2024-01-15T10:30:00Z",
        window_size_seconds: 60,
        cluster_id: "sr-research-aks",
        namespace: "default",
        service_name: "store-front",
        node_name: "docker-desktop",
        node_cpu_usage_percent: 45.2,
        node_memory_usage_percent: 68.5,
        node_memory_usage_mb: 2048,
        node_network_rx_kbps: 1250.5,
        node_network_tx_kbps: 850.3,
        node_disk_read_iops: 125,
        node_disk_write_iops: 85,
        current_pod_count: 3,
        pod_cpu_usage_percent_avg: 35.8,
        pod_cpu_usage_percent_p95: 58.2,
        pod_memory_usage_mb_avg: 512,
        pod_memory_usage_mb_p95: 768,
        pod_restart_count: 0,
        pod_cpu_limit_percent: 71.6,
        pod_memory_limit_percent: 51.2,
        request_rate_rps: 145.5,
        success_rate_percent: 99.2,
        error_rate_percent: 0.8,
        http_4xx_rate_percent: 0.5,
        http_5xx_rate_percent: 0.3,
        latency_p50_ms: 45,
        latency_p95_ms: 125,
        latency_p99_ms: 280,
        queue_length: 12,
        application_saturation_percent: 42.5,
        inbound_request_rate_rps: 145.5,
        outbound_request_rate_rps: 98.3,
        mesh_latency_p95_ms: 15,
        mesh_retry_rate_rps: 2.1,
        mesh_tcp_open_connections: 45,
        mesh_tls_error_rate_percent: 0.1,
        degree_centrality: 0.45,
        betweenness_centrality: 0.32,
        closeness_centrality: 0.58,
        eigenvector_centrality: 0.41,
        cpu_pressure_index: 0.42,
        memory_pressure_index: 0.35,
        io_pressure_index: 0.28,
        stress_index: 0.38,
        current_replicas: 3,
        recommended_replicas: 4,
        scale_direction: "up",
    },
    {
        timestamp: "2024-01-15T10:31:00Z",
        window_size_seconds: 60,
        cluster_id: "sr-research-aks",
        namespace: "default",
        service_name: "order-service",
        node_name: "docker-desktop",
        node_cpu_usage_percent: 52.8,
        node_memory_usage_percent: 72.1,
        node_memory_usage_mb: 2156,
        node_network_rx_kbps: 1580.2,
        node_network_tx_kbps: 1120.5,
        node_disk_read_iops: 145,
        node_disk_write_iops: 102,
        current_pod_count: 2,
        pod_cpu_usage_percent_avg: 42.5,
        pod_cpu_usage_percent_p95: 68.9,
        pod_memory_usage_mb_avg: 612,
        pod_memory_usage_mb_p95: 892,
        pod_restart_count: 1,
        pod_cpu_limit_percent: 85.0,
        pod_memory_limit_percent: 61.2,
        request_rate_rps: 89.2,
        success_rate_percent: 98.5,
        error_rate_percent: 1.5,
        http_4xx_rate_percent: 1.0,
        http_5xx_rate_percent: 0.5,
        latency_p50_ms: 62,
        latency_p95_ms: 185,
        latency_p99_ms: 420,
        queue_length: 18,
        application_saturation_percent: 58.3,
        inbound_request_rate_rps: 89.2,
        outbound_request_rate_rps: 52.1,
        mesh_latency_p95_ms: 22,
        mesh_retry_rate_rps: 3.5,
        mesh_tcp_open_connections: 38,
        mesh_tls_error_rate_percent: 0.2,
        degree_centrality: 0.38,
        betweenness_centrality: 0.28,
        closeness_centrality: 0.52,
        eigenvector_centrality: 0.35,
        cpu_pressure_index: 0.58,
        memory_pressure_index: 0.42,
        io_pressure_index: 0.35,
        stress_index: 0.48,
        current_replicas: 2,
        recommended_replicas: 3,
        scale_direction: "up",
    },
    // Add more records...
];

// Generate more mock data
const generateMockData = (count = 100) => {
    const services = ["store-front", "order-service", "product-service", "mongodb", "rabbitmq"];
    const data = [];

    for (let i = 0; i < count; i++) {
        const timestamp = new Date(Date.now() - (count - i) * 60000).toISOString();
        const service = services[i % services.length];

        data.push({
            timestamp,
            window_size_seconds: 60,
            cluster_id: "sr-research-aks",
            namespace: "default",
            service_name: service,
            node_name: "docker-desktop",
            node_cpu_usage_percent: (Math.random() * 50 + 30).toFixed(1),
            node_memory_usage_percent: (Math.random() * 40 + 50).toFixed(1),
            node_memory_usage_mb: Math.floor(Math.random() * 1000 + 1500),
            node_network_rx_kbps: (Math.random() * 1000 + 500).toFixed(1),
            node_network_tx_kbps: (Math.random() * 800 + 400).toFixed(1),
            node_disk_read_iops: Math.floor(Math.random() * 100 + 50),
            node_disk_write_iops: Math.floor(Math.random() * 80 + 40),
            current_pod_count: Math.floor(Math.random() * 3 + 1),
            pod_cpu_usage_percent_avg: (Math.random() * 40 + 20).toFixed(1),
            pod_cpu_usage_percent_p95: (Math.random() * 50 + 40).toFixed(1),
            pod_memory_usage_mb_avg: Math.floor(Math.random() * 500 + 300),
            pod_memory_usage_mb_p95: Math.floor(Math.random() * 700 + 500),
            pod_restart_count: Math.floor(Math.random() * 3),
            pod_cpu_limit_percent: (Math.random() * 40 + 50).toFixed(1),
            pod_memory_limit_percent: (Math.random() * 30 + 40).toFixed(1),
            request_rate_rps: (Math.random() * 100 + 50).toFixed(1),
            success_rate_percent: (Math.random() * 5 + 95).toFixed(1),
            error_rate_percent: (Math.random() * 3 + 0.5).toFixed(1),
            http_4xx_rate_percent: (Math.random() * 2 + 0.2).toFixed(1),
            http_5xx_rate_percent: (Math.random() * 1 + 0.1).toFixed(1),
            latency_p50_ms: Math.floor(Math.random() * 50 + 30),
            latency_p95_ms: Math.floor(Math.random() * 150 + 100),
            latency_p99_ms: Math.floor(Math.random() * 300 + 200),
            queue_length: Math.floor(Math.random() * 20 + 5),
            application_saturation_percent: (Math.random() * 40 + 30).toFixed(1),
            inbound_request_rate_rps: (Math.random() * 100 + 50).toFixed(1),
            outbound_request_rate_rps: (Math.random() * 80 + 30).toFixed(1),
            mesh_latency_p95_ms: Math.floor(Math.random() * 30 + 10),
            mesh_retry_rate_rps: (Math.random() * 5 + 1).toFixed(1),
            mesh_tcp_open_connections: Math.floor(Math.random() * 50 + 20),
            mesh_tls_error_rate_percent: (Math.random() * 0.5).toFixed(2),
            degree_centrality: (Math.random() * 0.5 + 0.2).toFixed(2),
            betweenness_centrality: (Math.random() * 0.5 + 0.1).toFixed(2),
            closeness_centrality: (Math.random() * 0.6 + 0.3).toFixed(2),
            eigenvector_centrality: (Math.random() * 0.5 + 0.2).toFixed(2),
            cpu_pressure_index: (Math.random() * 0.6 + 0.2).toFixed(2),
            memory_pressure_index: (Math.random() * 0.5 + 0.2).toFixed(2),
            io_pressure_index: (Math.random() * 0.4 + 0.1).toFixed(2),
            stress_index: (Math.random() * 0.6 + 0.2).toFixed(2),
            current_replicas: Math.floor(Math.random() * 4 + 1),
            recommended_replicas: Math.floor(Math.random() * 5 + 1),
            scale_direction: Math.random() > 0.5 ? "up" : (Math.random() > 0.3 ? "down" : "stable"),
        });
    }

    return data;
};

export const fullMockMetricsData = generateMockData(1247);

// Simulate fetching export status
export const fetchExportStatus = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockMetricsExportStatus);
        }, 300);
    });
};

// Start metrics collection
export const startMetricsCollection = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, message: "Metrics collection started" });
        }, 500);
    });
};

// Stop metrics collection
export const stopMetricsCollection = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, message: "Metrics collection stopped" });
        }, 500);
    });
};

// Download dataset with actual data
export const downloadDataset = async (format, context = {}) => {
    const { projectName, serviceName, data } = context;

    return new Promise(async (resolve) => {
        if (format === "pdf") {
            const { jsPDF } = await import("jspdf");
            const { default: autoTable } = await import("jspdf-autotable");

            const doc = jsPDF ? new jsPDF() : null;
            if (!doc) {
                resolve({ success: false });
                return;
            }

            // Report Header
            doc.setFontSize(22);
            doc.setTextColor(44, 62, 80);
            doc.text("Infrastructure Resilience Report", 14, 22);

            doc.setFontSize(12);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

            doc.setDrawColor(44, 62, 80);
            doc.line(14, 35, 196, 35);

            // Scope Information
            doc.setFontSize(14);
            doc.setTextColor(44, 62, 80);
            doc.text("Report Scope", 14, 45);

            doc.setFontSize(11);
            doc.setTextColor(0);
            doc.text(`Project: ${projectName || "All Projects"}`, 14, 52);
            doc.text(`Service: ${serviceName || "All Services"}`, 14, 58);

            // Data Table
            const tableData = (data || []).map(record => [
                new Date(record.timestamp).toLocaleDateString(),
                record.project || "N/A",
                record.deployment || record.service_name || "N/A",
                `${record.metrics?.successRate || record.success_rate_percent || 0}%`,
                `${record.metrics?.errorRate || record.error_rate_percent || 0}%`,
                `${record.metrics?.p95LatencyAfter || record.latency_p95_ms || 0}ms`,
                `${record.metrics?.cpuPercent || record.node_cpu_usage_percent || 0}%`
            ]);

            autoTable(doc, {
                startY: 65,
                head: [["Date", "Project", "Service", "Success", "Error", "Latency", "CPU"]],
                body: tableData,
                theme: 'striped',
                headStyles: { fillStyle: 'dark', fillColor: [44, 62, 80] },
                alternateRowStyles: { fillColor: [245, 247, 250] }
            });

            // Summary Footer
            const finalY = doc.lastAutoTable.finalY + 10;
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text("© 2026 DnamiX-Autoscaler Organizations Dashboard. Confidential Research Data.", 14, finalY);

            doc.save(`Resilience_Report_${projectName || 'Global'}_${Date.now()}.pdf`);
            resolve({ success: true });
            return;
        }

        setTimeout(() => {
            let content = "";
            const exportData = data || fullMockMetricsData;

            if (format === "csv") {
                const headers = Object.keys(exportData[0]).join(",");
                const rows = exportData.map(record =>
                    Object.values(record).map(val => typeof val === 'object' ? JSON.stringify(val).replace(/,/g, ';') : val).join(",")
                ).join("\n");
                content = `${headers}\n${rows}`;
            } else {
                content = exportData.map(record => JSON.stringify(record)).join("\n");
            }

            const blob = new Blob([content], {
                type: format === "csv" ? "text/csv" : "application/json",
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `metrics_export_${Date.now()}.${format === "csv" ? "csv" : "jsonl"}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            resolve({ success: true });
        }, 500);
    });
};

// Format duration
export const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
};

// Format file size
export const formatFileSize = (mb) => {
    if (mb >= 1024) {
        return `${(mb / 1024).toFixed(2)} GB`;
    }
    return `${mb} MB`;
};
