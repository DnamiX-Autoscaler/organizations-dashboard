const serviceMeshLevelData = [
    {
        inbound_request_rate_rps: 800,
        outbound_request_rate_rps: 750,
        mesh_latency_p95_ms: 110,
        mesh_retry_rate_rps: 12,
        mesh_tcp_open_connections: 150,
        mesh_tls_error_rate_percent: 0.3,
    },
    {
        inbound_request_rate_rps: 950,
        outbound_request_rate_rps: 900,
        mesh_latency_p95_ms: 95,
        mesh_retry_rate_rps: 8,
        mesh_tcp_open_connections: 170,
        mesh_tls_error_rate_percent: 0.1,
    },
    {
        inbound_request_rate_rps: 700,
        outbound_request_rate_rps: 680,
        mesh_latency_p95_ms: 130,
        mesh_retry_rate_rps: 15,
        mesh_tcp_open_connections: 140,
        mesh_tls_error_rate_percent: 0.5,
    },
];

export default serviceMeshLevelData;
