import React from "react";
import Table from "../../../common/Table";

const AppLevelTable = ({ data }) => {
  const columns = [
    {
      key: "request_rate_rps",
      label: "Request Rate (RPS)",
      bold: true,
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "success_rate_percent",
      label: "Success Rate (%)",
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "error_rate_percent",
      label: "Error Rate (%)",
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "http_4xx_rate_percent",
      label: "HTTP 4xx (%)",
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "http_5xx_rate_percent",
      label: "HTTP 5xx (%)",
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "latency_p50_ms",
      label: "Latency P50 (ms)",
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "latency_p95_ms",
      label: "Latency P95 (ms)",
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "latency_p99_ms",
      label: "Latency P99 (ms)",
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "queue_length",
      label: "Queue Length",
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "application_saturation_percent",
      label: "Saturation (%)",
      icon: "fluent:leaf-two-24-regular",
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      empty="No application-level data available"
    />
  );
};

export default AppLevelTable;
