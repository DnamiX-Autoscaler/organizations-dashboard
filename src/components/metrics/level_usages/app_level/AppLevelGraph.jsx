import React from "react";
import Graph from "../../../common/Graph";

const AppLevelGraph = ({ data }) => {
  // Transform data for Request/Success Rate graph
  const requestData = data.map((app, index) => ({
    time: `App ${index + 1}`,
    requests: app.request_rate_rps,
    success: app.success_rate_percent,
    errors: app.error_rate_percent,
    timeStamp: new Date().getTime() - (data.length - index) * 60000,
  }));

  // Transform data for HTTP Error Rates graph
  const errorData = data.map((app, index) => ({
    time: `App ${index + 1}`,
    http4xx: app.http_4xx_rate_percent,
    http5xx: app.http_5xx_rate_percent,
    timeStamp: new Date().getTime() - (data.length - index) * 60000,
  }));

  // Transform data for Latency graph
  const latencyData = data.map((app, index) => ({
    time: `App ${index + 1}`,
    p50: app.latency_p50_ms,
    p95: app.latency_p95_ms,
    p99: app.latency_p99_ms,
    timeStamp: new Date().getTime() - (data.length - index) * 60000,
  }));

  // Transform data for Queue & Saturation graph
  const queueData = data.map((app, index) => ({
    time: `App ${index + 1}`,
    queue: app.queue_length,
    saturation: app.application_saturation_percent,
    timeStamp: new Date().getTime() - (data.length - index) * 60000,
  }));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Request & Success Rate Graph */}
      <Graph
        data={requestData}
        xKey="time"
        yKey="requests"
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
          { key: "requests", label: "Request Rate", suffix: " RPS" },
          { key: "success", label: "Success Rate", suffix: "%" },
          { key: "errors", label: "Error Rate", suffix: "%" },
        ]}
      />

      {/* HTTP Error Rates Graph */}
      <Graph
        data={errorData}
        xKey="time"
        yKey="http4xx"
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
          { key: "http4xx", label: "HTTP 4xx", suffix: "%" },
          { key: "http5xx", label: "HTTP 5xx", suffix: "%" },
        ]}
      />

      {/* Latency Graph */}
      <Graph
        data={latencyData}
        xKey="time"
        yKey="p50"
        chartType="area"
        color="#10B981"
        height={300}
        showControls={true}
        showStats={true}
        enableAxisSwap={false}
        enableTypeToggle={true}
        enableTimeRange={false}
        enableLiveToggle={true}
        tooltipFields={[
          { key: "p50", label: "P50 Latency", suffix: " ms" },
          { key: "p95", label: "P95 Latency", suffix: " ms" },
          { key: "p99", label: "P99 Latency", suffix: " ms" },
        ]}
      />

      {/* Queue Length & Saturation Graph */}
      <Graph
        data={queueData}
        xKey="time"
        yKey="queue"
        chartType="line"
        color="#8B5CF6"
        height={300}
        showControls={true}
        showStats={true}
        enableAxisSwap={false}
        enableTypeToggle={true}
        enableTimeRange={false}
        enableLiveToggle={true}
        tooltipFields={[
          { key: "queue", label: "Queue Length", suffix: "" },
          { key: "saturation", label: "Saturation", suffix: "%" },
        ]}
      />
    </div>
  );
};

export default AppLevelGraph;
