const performanceData = {
    cluster: {
        name: "prod-aks-cluster",
        totalNodes: 3,
        totalPods: 64,
        totalCpu: 24, // cores
        totalMemory: 96, // GB
    },
    cpu: {
        utilization: 18,
        speed: 2.69,
        cores: 24,
        threads: 48,
        history: [
            { time: "15:48", value: 12 },
            { time: "15:49", value: 15 },
            { time: "15:50", value: 18 },
            { time: "15:51", value: 16 },
            { time: "15:52", value: 14 },
            { time: "15:53", value: 19 },
            { time: "15:54", value: 18 },
        ],
    },
    memory: {
        used: 73.8,
        total: 96.0,
        percentage: 77,
        cached: 12.5,
        available: 22.2,
        history: [
            { time: "15:48", value: 70.5 },
            { time: "15:49", value: 71.8 },
            { time: "15:50", value: 72.5 },
            { time: "15:51", value: 73.0 },
            { time: "15:52", value: 73.5 },
            { time: "15:53", value: 73.2 },
            { time: "15:54", value: 73.8 },
        ],
    },
    disk: {
        name: "Persistent Volume Claims",
        activeTime: 1,
        readSpeed: 0.2,
        writeSpeed: 3.8,
        totalCapacity: 2048, // GB
        used: 856,
    },
    network: {
        name: "Cluster Network",
        send: 45.2, // Kbps
        receive: 128.5,
        connections: 1247,
    },
    nodes: [
        {
            name: "aks-node-1",
            status: "Ready",
            cpu: 42,
            memory: 75,
            pods: 28,
            cpuCores: 8,
            memoryTotal: 32,
        },
        {
            name: "aks-node-2",
            status: "Ready",
            cpu: 38,
            memory: 71,
            pods: 24,
            cpuCores: 8,
            memoryTotal: 32,
        },
        {
            name: "aks-node-3",
            status: "Ready",
            cpu: 15,
            memory: 68,
            pods: 12,
            cpuCores: 8,
            memoryTotal: 32,
        },
    ],
    topPods: [
        {
            name: "product-service-5c8a1-p4r7x",
            namespace: "default",
            cpu: 285, // millicores
            memory: 1024, // MB
        },
        {
            name: "order-service-7d9f8b-xk2m9",
            namespace: "default",
            cpu: 210,
            memory: 768,
        },
        {
            name: "payment-gateway-9f3b2-w8q5n",
            namespace: "default",
            cpu: 195,
            memory: 512,
        },
        {
            name: "user-service-4k2m7-t5x9p",
            namespace: "default",
            cpu: 158,
            memory: 896,
        },
        {
            name: "notification-svc-6h8n3-j2k4m",
            namespace: "default",
            cpu: 142,
            memory: 384,
        },
    ],
    systemInfo: {
        uptime: "7d 14h 23m",
        processes: 64,
        threads: 1248,
        handles: 28456,
    },
};

export default performanceData;
