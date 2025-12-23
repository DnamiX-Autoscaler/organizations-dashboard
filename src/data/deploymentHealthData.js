const deploymentHealthData = {
    overallScore: 94,
    podStatus: [
        { id: "1", name: "auth-service-5f9d", ready: true, liveness: true, age: "12m", status: "Healthy" },
        { id: "2", name: "order-service-a92c", ready: false, liveness: false, age: "2m", status: "Unhealthy" },
        { id: "3", name: "payment-service-b12e", ready: true, liveness: true, age: "45m", status: "Healthy" },
        { id: "4", name: "notification-service-c34f", ready: true, liveness: true, age: "1h", status: "Healthy" },
    ],
    restarts: [
        { service: "auth-service", count: 12, trend: "up", status: "Critical" },
        { service: "order-service", count: 3, trend: "stable", status: "Warning" },
        { service: "payment-service", count: 0, trend: "none", status: "Healthy" },
    ],
    crashLoopBackOff: [
        { service: "notification-service", pod: "notification-7c9df", detectedAt: "2025-12-23T23:55:00Z" }
    ],
    nodePressure: [
        { id: "Node-1", cpu: 72, memory: 81, disk: 65, status: "Warning" },
        { id: "Node-2", cpu: 91, memory: 93, disk: 88, status: "Critical" },
    ],
    availability: [
        { time: "12:00", value: 99.9 },
        { time: "12:05", value: 99.8 },
        { time: "12:10", value: 99.95 },
        { time: "12:15", value: 97.4 },
        { time: "12:20", value: 99.2 },
        { time: "12:25", value: 99.92 },
    ],
    serviceAvailabilityBadges: [
        { service: "Auth Service", percentage: 99.92, status: "Healthy" },
        { service: "Order Service", percentage: 97.40, status: "Unhealthy" },
    ]
};

export default deploymentHealthData;
