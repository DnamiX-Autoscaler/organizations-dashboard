import React from "react";
import Graph from "../../../common/Graph";

const ServiceMeshLevelGraph = ({ data }) => {
  // Transform data for Request Rate graph
  const requestData = data.map((mesh, index) => ({
    time: `Mesh ${index + 1}`,
    inbound: mesh.inbound_request_rate_rps,
    outbound: mesh.outbound_request_rate_rps,
    timeStamp: new Date().getTime() - (data.length - index) * 60000,
  }));

  // Transform data for Latency graph
  const latencyData = data.map((mesh, index) => ({
    time: `Mesh ${index + 1}`,
    value: mesh.mesh_latency_p95_ms,
    timeStamp: new Date().getTime() - (data.length - index) * 60000,
  }));

  // Transform data for Retry & Error Rate graph
  const retryData = data.map((mesh, index) => ({
    time: `Mesh ${index + 1}`,
    retry: mesh.mesh_retry_rate_rps,
    tlsError: mesh.mesh_tls_error_rate_percent,
    timeStamp: new Date().getTime() - (data.length - index) * 60000,
  }));

  // Transform data for TCP Connections graph
  const connectionData = data.map((mesh, index) => ({
    time: `Mesh ${index + 1}`,
    value: mesh.mesh_tcp_open_connections,
    timeStamp: new Date().getTime() - (data.length - index) * 60000,
  }));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Request Rate Graph */}
      <Graph
        data={requestData}
        xKey="time"
        yKey="inbound"
        chartType="area"
        color="#3B82F6"
        height={300}
        showControls={true}
        showStats={true}
        enableAxisSwap={false}
        enableTypeToggle={true}
        enableTimeRange={false}
        enableLiveToggle={true}
        tooltipFields={[
          { key: "inbound", label: "Inbound", suffix: " RPS" },
          { key: "outbound", label: "Outbound", suffix: " RPS" },
        ]}
      />

      {/* Mesh Latency Graph */}
      <Graph
        data={latencyData}
        xKey="time"
        yKey="value"
        chartType="area"
        color="#10B981"
        height={300}
        showControls={true}
        showStats={true}
        enableAxisSwap={false}
        enableTypeToggle={true}
        enableTimeRange={false}
        enableLiveToggle={true}
        tooltipFields={[{ key: "value", label: "Latency P95", suffix: " ms" }]}
      />

      {/* Retry & TLS Error Rate Graph */}
      <Graph
        data={retryData}
        xKey="time"
        yKey="retry"
        chartType="line"
        color="#EF4444"
        height={300}
        showControls={true}
        showStats={true}
        enableAxisSwap={false}
        enableTypeToggle={true}
        enableTimeRange={false}
        enableLiveToggle={true}
        tooltipFields={[
          { key: "retry", label: "Retry Rate", suffix: " RPS" },
          { key: "tlsError", label: "TLS Error", suffix: "%" },
        ]}
      />

      {/* TCP Connections Graph */}
      <Graph
        data={connectionData}
        xKey="time"
        yKey="value"
        chartType="area"
        color="#8B5CF6"
        height={300}
        showControls={true}
        showStats={true}
        enableAxisSwap={false}
        enableTypeToggle={true}
        enableTimeRange={false}
        enableLiveToggle={true}
        tooltipFields={[{ key: "value", label: "TCP Connections", suffix: "" }]}
      />
    </div>
  );
};

export default ServiceMeshLevelGraph;
