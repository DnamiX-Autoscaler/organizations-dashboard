const scalingEventsData = [
    {
        timestamp: "2025-12-07T10:15:32.000000+00:00",
        deployment: "product-service",
        requestedPods: 3,
        appliedReplicas: 5,
        decision: "SUCCESS",
        reason: "CPU utilization exceeded 75% threshold"
    },
    {
        timestamp: "2025-12-07T10:18:45.000000+00:00",
        deployment: "order-service",
        requestedPods: 2,
        appliedReplicas: 4,
        decision: "SUCCESS",
        reason: "Request rate above target (120 req/s)"
    },
    {
        timestamp: "2025-12-07T10:22:10.000000+00:00",
        deployment: "product-service",
        requestedPods: 5,
        appliedReplicas: 5,
        decision: "FAILED",
        reason: "Insufficient cluster resources"
    },
    {
        timestamp: "2025-12-07T10:25:58.000000+00:00",
        deployment: "order-service",
        requestedPods: 4,
        appliedReplicas: 2,
        decision: "ROLLED_BACK",
        reason: "Score below threshold (0.45 < 0.60)"
    },
    {
        timestamp: "2025-12-07T10:30:22.000000+00:00",
        deployment: "product-service",
        requestedPods: 5,
        appliedReplicas: 8,
        decision: "SUCCESS",
        reason: "Memory utilization at 82%, scaling required"
    },
    {
        timestamp: "2025-12-07T10:35:15.000000+00:00",
        deployment: "order-service",
        requestedPods: 4,
        appliedReplicas: 6,
        decision: "SUCCESS",
        reason: "Predictive scaling: traffic spike expected"
    },
    {
        timestamp: "2025-12-07T10:40:03.000000+00:00",
        deployment: "product-service",
        requestedPods: 8,
        appliedReplicas: 6,
        decision: "ROLLED_BACK",
        reason: "Health check failures detected"
    },
    {
        timestamp: "2025-12-07T10:45:28.000000+00:00",
        deployment: "order-service",
        requestedPods: 6,
        appliedReplicas: 6,
        decision: "FAILED",
        reason: "Namespace quota exceeded"
    },
    {
        timestamp: "2025-12-07T10:50:41.000000+00:00",
        deployment: "product-service",
        requestedPods: 6,
        appliedReplicas: 4,
        decision: "SUCCESS",
        reason: "Scale down: utilization below 30%"
    },
    {
        timestamp: "2025-12-07T10:55:19.000000+00:00",
        deployment: "order-service",
        requestedPods: 6,
        appliedReplicas: 8,
        decision: "SUCCESS",
        reason: "Response time degradation (>500ms avg)"
    },
    {
        timestamp: "2025-12-07T11:00:05.000000+00:00",
        deployment: "product-service",
        requestedPods: 4,
        appliedReplicas: 4,
        decision: "FAILED",
        reason: "Pod startup timeout exceeded"
    },
    {
        timestamp: "2025-12-07T11:05:37.000000+00:00",
        deployment: "order-service",
        requestedPods: 8,
        appliedReplicas: 10,
        decision: "SUCCESS",
        reason: "Queue depth exceeds threshold (1000+ items)"
    },
    {
        timestamp: "2025-12-07T11:10:52.000000+00:00",
        deployment: "product-service",
        requestedPods: 4,
        appliedReplicas: 3,
        decision: "ROLLED_BACK",
        reason: "Score below threshold (0.52 < 0.60)"
    },
    {
        timestamp: "2025-12-07T11:15:20.000000+00:00",
        deployment: "order-service",
        requestedPods: 10,
        appliedReplicas: 12,
        decision: "SUCCESS",
        reason: "Custom metric: active connections > 500"
    },
    {
        timestamp: "2025-12-07T11:20:44.000000+00:00",
        deployment: "product-service",
        requestedPods: 3,
        appliedReplicas: 2,
        decision: "SUCCESS",
        reason: "Off-peak hours: scheduled scale down"
    }
];

export default scalingEventsData;
