// Mock data for running pods (simulating kubectl get pods -o wide output)
export const mockRunningPods = [
    {
        name: "makeline-service-65bb465b7c-ckq47",
        ready: "1/2",
        status: "Error",
        restarts: 735,
        age: "47d",
        ip: "10.1.2.160",
        node: "docker-desktop",
        nominatedNode: "<none>",
        readinessGates: "<none>",
    },
    {
        name: "makeline-service-6c8ffb5857-p4mdw",
        ready: "1/2",
        status: "Running",
        restarts: 1230,
        age: "47d",
        ip: "10.1.2.171",
        node: "docker-desktop",
        nominatedNode: "<none>",
        readinessGates: "<none>",
    },
    {
        name: "mesh-traffic-generator-6b8745d9f8-8pnsf",
        ready: "2/2",
        status: "Running",
        restarts: 2,
        age: "23h",
        ip: "10.1.2.170",
        node: "docker-desktop",
        nominatedNode: "<none>",
        readinessGates: "<none>",
    },
    {
        name: "mongodb-0",
        ready: "1/2",
        status: "CrashLoopBackOff",
        restarts: 1543,
        age: "48d",
        ip: "10.1.2.165",
        node: "docker-desktop",
        nominatedNode: "<none>",
        readinessGates: "<none>",
    },
    {
        name: "order-service-778d9645c5-9zbxk",
        ready: "2/2",
        status: "Running",
        restarts: 2,
        age: "24h",
        ip: "10.1.2.166",
        node: "docker-desktop",
        nominatedNode: "<none>",
        readinessGates: "<none>",
    },
    {
        name: "product-service-b89d6f8f9-97m74",
        ready: "2/2",
        status: "Running",
        restarts: 2,
        age: "24h",
        ip: "10.1.2.164",
        node: "docker-desktop",
        nominatedNode: "<none>",
        readinessGates: "<none>",
    },
    {
        name: "rabbitmq-0",
        ready: "2/2",
        status: "Running",
        restarts: 42,
        age: "48d",
        ip: "10.1.2.162",
        node: "docker-desktop",
        nominatedNode: "<none>",
        readinessGates: "<none>",
    },
    {
        name: "store-admin-79ff45db8c-xhxdq",
        ready: "2/2",
        status: "Running",
        restarts: 2,
        age: "24h",
        ip: "10.1.2.159",
        node: "docker-desktop",
        nominatedNode: "<none>",
        readinessGates: "<none>",
    },
    {
        name: "store-front-7b556f458f-mqbcg",
        ready: "2/2",
        status: "Running",
        restarts: 2,
        age: "24h",
        ip: "10.1.2.167",
        node: "docker-desktop",
        nominatedNode: "<none>",
        readinessGates: "<none>",
    },
    {
        name: "virtual-customer-77d7f9f5-tplzk",
        ready: "2/2",
        status: "Running",
        restarts: 2,
        age: "27h",
        ip: "10.1.2.168",
        node: "docker-desktop",
        nominatedNode: "<none>",
        readinessGates: "<none>",
    },
    {
        name: "virtual-worker-5c785fbcb7-lsr7d",
        ready: "1/2",
        status: "CrashLoopBackOff",
        restarts: 63,
        age: "27h",
        ip: "10.1.2.163",
        node: "docker-desktop",
        nominatedNode: "<none>",
        readinessGates: "<none>",
    },
];

// Function to get status badge color
export const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "running") return "green";
    if (statusLower === "error") return "red";
    if (statusLower === "crashloopbackoff") return "orange";
    if (statusLower === "pending") return "yellow";
    if (statusLower === "succeeded") return "blue";
    return "gray";
};

// Function to get ready status color
export const getReadyColor = (ready) => {
    const [current, total] = ready.split("/").map(Number);
    if (current === total) return "green";
    if (current === 0) return "red";
    return "yellow";
};

// Function to simulate fetching pods (will be replaced with actual kubectl API call)
export const fetchRunningPods = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockRunningPods);
        }, 500); // Simulate network delay
    });
};

// Get pod statistics
export const getPodStatistics = (pods) => {
    const running = pods.filter((p) => p.status === "Running").length;
    const error = pods.filter(
        (p) => p.status === "Error" || p.status === "CrashLoopBackOff"
    ).length;
    const pending = pods.filter((p) => p.status === "Pending").length;
    const total = pods.length;

    return {
        total,
        running,
        error,
        pending,
    };
};
