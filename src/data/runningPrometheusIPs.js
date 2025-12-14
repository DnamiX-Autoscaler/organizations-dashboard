// Mock data for Prometheus services (simulating kubectl get svc -n monitoring output)
export const mockPrometheusServices = [
    {
        name: "alertmanager-operated",
        type: "ClusterIP",
        clusterIP: "None",
        externalIP: "<none>",
        ports: "9093/TCP,9094/TCP,9094/UDP",
        age: "58d",
    },
    {
        name: "cadvisor",
        type: "ClusterIP",
        clusterIP: "10.102.205.57",
        externalIP: "<none>",
        ports: "8080/TCP",
        age: "15d",
    },
    {
        name: "prometheus-grafana",
        type: "ClusterIP",
        clusterIP: "10.110.252.64",
        externalIP: "<none>",
        ports: "80/TCP",
        age: "58d",
    },
    {
        name: "prometheus-kube-prometheus-alertmanager",
        type: "ClusterIP",
        clusterIP: "10.99.233.76",
        externalIP: "<none>",
        ports: "9093/TCP,8080/TCP",
        age: "58d",
    },
    {
        name: "prometheus-kube-prometheus-operator",
        type: "ClusterIP",
        clusterIP: "10.110.217.237",
        externalIP: "<none>",
        ports: "443/TCP",
        age: "58d",
    },
    {
        name: "prometheus-kube-prometheus-prometheus",
        type: "ClusterIP",
        clusterIP: "10.111.15.123",
        externalIP: "<none>",
        ports: "9090/TCP,8080/TCP",
        age: "58d",
    },
    {
        name: "prometheus-kube-state-metrics",
        type: "ClusterIP",
        clusterIP: "10.101.13.172",
        externalIP: "<none>",
        ports: "8080/TCP",
        age: "58d",
    },
    {
        name: "prometheus-operated",
        type: "ClusterIP",
        clusterIP: "None",
        externalIP: "<none>",
        ports: "9090/TCP",
        age: "58d",
    },
    {
        name: "prometheus-prometheus-node-exporter",
        type: "ClusterIP",
        clusterIP: "10.96.179.170",
        externalIP: "<none>",
        ports: "9100/TCP",
        age: "58d",
    },
];

// Get service category based on name
export const getServiceCategory = (name) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes("prometheus") && !nameLower.includes("grafana")) return "prometheus";
    if (nameLower.includes("grafana")) return "grafana";
    if (nameLower.includes("alertmanager")) return "alertmanager";
    if (nameLower.includes("cadvisor")) return "cadvisor";
    if (nameLower.includes("node-exporter")) return "node-exporter";
    return "other";
};

// Get category color
export const getCategoryColor = (category) => {
    const colors = {
        prometheus: "orange",
        grafana: "blue",
        alertmanager: "red",
        cadvisor: "green",
        "node-exporter": "purple",
        other: "gray",
    };
    return colors[category] || "gray";
};

// Function to simulate fetching Prometheus services
export const fetchPrometheusServices = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockPrometheusServices);
        }, 500);
    });
};

// Get Prometheus service statistics
export const getPrometheusStatistics = (services) => {
    const prometheus = services.filter((s) =>
        getServiceCategory(s.name) === "prometheus"
    ).length;
    const grafana = services.filter((s) =>
        getServiceCategory(s.name) === "grafana"
    ).length;
    const alertmanager = services.filter((s) =>
        getServiceCategory(s.name) === "alertmanager"
    ).length;
    const exporters = services.filter((s) =>
        ["cadvisor", "node-exporter"].includes(getServiceCategory(s.name))
    ).length;
    const total = services.length;

    return {
        total,
        prometheus,
        grafana,
        alertmanager,
        exporters,
    };
};
