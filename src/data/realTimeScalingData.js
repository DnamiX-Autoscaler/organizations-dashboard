// Mock data for real-time scaling dashboard
const realTimeScalingData = {
    deployments: [
        {
            name: "product-service",
            currentReplicas: 5,
            desiredReplicas: 5,
            trend: "stable", // stable, scaling-up, scaling-down
            status: "healthy", // healthy, scaling, error
            lastScalingTime: "2025-12-10T19:45:32.000000+00:00",
            lastAction: "Scale up",
            cpuUsage: 68,
            memoryUsage: 72,
        },
        {
            name: "order-service",
            currentReplicas: 8,
            desiredReplicas: 10,
            trend: "scaling-up",
            status: "scaling",
            lastScalingTime: "2025-12-10T20:05:15.000000+00:00",
            lastAction: "Scale up",
            cpuUsage: 82,
            memoryUsage: 78,
        },
        {
            name: "payment-service",
            currentReplicas: 3,
            desiredReplicas: 3,
            trend: "stable",
            status: "healthy",
            lastScalingTime: "2025-12-10T18:30:22.000000+00:00",
            lastAction: "Scale down",
            cpuUsage: 45,
            memoryUsage: 52,
        },
        {
            name: "notification-service",
            currentReplicas: 4,
            desiredReplicas: 2,
            trend: "scaling-down",
            status: "scaling",
            lastScalingTime: "2025-12-10T20:08:45.000000+00:00",
            lastAction: "Scale down",
            cpuUsage: 28,
            memoryUsage: 35,
        },
       
    ],

    recentActivity: [
        {
            timestamp: "2025-12-10T20:08:45.000000+00:00",
            deployment: "notification-service",
            action: "Scale down",
            from: 4,
            to: 2,
            decision: "SUCCESS",
            reason: "Low traffic detected, CPU below 30%",
        },
        {
            timestamp: "2025-12-10T20:05:15.000000+00:00",
            deployment: "order-service",
            action: "Scale up",
            from: 8,
            to: 10,
            decision: "SUCCESS",
            reason: "High request rate (150 req/s)",
        },
        {
            timestamp: "2025-12-10T19:58:32.000000+00:00",
            deployment: "product-service",
            action: "Scale up",
            from: 3,
            to: 5,
            decision: "SUCCESS",
            reason: "CPU utilization exceeded 75%",
        },
        {
            timestamp: "2025-12-10T19:45:22.000000+00:00",
            deployment: "payment-service",
            action: "Scale up",
            from: 2,
            to: 4,
            decision: "FAILED",
            reason: "Insufficient cluster resources",
        },
        {
            timestamp: "2025-12-10T19:30:10.000000+00:00",
            deployment: "analytics-service",
            action: "Scale up",
            from: 4,
            to: 6,
            decision: "SUCCESS",
            reason: "Memory utilization at 80%",
        },
        {
            timestamp: "2025-12-10T19:15:05.000000+00:00",
            deployment: "order-service",
            action: "Scale down",
            from: 10,
            to: 8,
            decision: "ROLLED_BACK",
            reason: "Health check failures detected",
        },
    ],
};

export default realTimeScalingData;
