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
    ],
    projects: [
        {
            name: "Hotel Management System",
            services: [
                {
                    serviceName: "Butiler Service",
                    metrics: {
                        successRate: 0.99,
                        errorRate: 0.01,
                        p95LatencyBefore: 120,
                        p95LatencyAfter: 130,
                        cpuPercent: 40,
                        memPercent: 55,
                        restartCount: 0,
                        trafficRecovery: 1.0
                    }
                },
                {
                    serviceName: "Room Service",
                    metrics: {
                        successRate: 0.98,
                        errorRate: 0.015,
                        p95LatencyBefore: 200,
                        p95LatencyAfter: 210,
                        cpuPercent: 60,
                        memPercent: 65,
                        restartCount: 1,
                        trafficRecovery: 0.98
                    }
                }
            ]
        },
        {
            name: "Hospital Management System",
            services: [
                {
                    serviceName: "Paitent Service",
                    metrics: {
                        successRate: 0.995,
                        errorRate: 0.005,
                        p95LatencyBefore: 100,
                        p95LatencyAfter: 105,
                        cpuPercent: 30,
                        memPercent: 45,
                        restartCount: 0,
                        trafficRecovery: 1.0
                    }
                },
                {
                    serviceName: "Apoinment Service",
                    metrics: {
                        successRate: 0.97,
                        errorRate: 0.03,
                        p95LatencyBefore: 350,
                        p95LatencyAfter: 380,
                        cpuPercent: 75,
                        memPercent: 80,
                        restartCount: 2,
                        trafficRecovery: 0.90
                    }
                }
            ]
        },
        {
            name: "Online Bookstore",
            services: [
                {
                    serviceName: "Product Service",
                    metrics: {
                        successRate: 0.96,
                        errorRate: 0.04,
                        p95LatencyBefore: 400,
                        p95LatencyAfter: 450,
                        cpuPercent: 85,
                        memPercent: 70,
                        restartCount: 3,
                        trafficRecovery: 0.85
                    }
                },
                {
                    serviceName: "Order Service",
                    metrics: {
                        successRate: 1,
                        errorRate: 0.001,
                        p95LatencyBefore: 250,
                        p95LatencyAfter: 1200,
                        cpuPercent: 95,
                        memPercent: 92,
                        restartCount: 4,
                        trafficRecovery: 0.50
                    }
                }
            ]
        }
    ]
};

export default deploymentHealthData;
