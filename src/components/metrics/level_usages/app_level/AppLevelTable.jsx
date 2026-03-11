import React from "react";
import Table from "../../../common/Table";

const AppLevelTable = ({ data }) => {
  const columns = [
    {
      key: "service_name",
      label: "Service Name",
      bold: true,
      icon: "mdi:application",
    },
    {
      key: "namespace",
      label: "Namespace",
      icon: "mdi:folder-network-outline",
    },
    {
      key: "timestamp",
      label: "Timestamp",
      icon: "mdi:clock-outline",
    },
    {
      key: "request_rate_rps",
      label: "Request Rate (RPS)",
      icon: "mdi:transfer",
    },
    {
      key: "success_rate_percent",
      label: "Success Rate (%)",
      icon: "mdi:check-circle-outline",
    },
    {
      key: "error_rate_percent",
      label: "Error Rate (%)",
      icon: "mdi:alert-circle-outline",
    },
    {
      key: "http_4xx_rate_percent",
      label: "HTTP 4xx (%)",
      icon: "mdi:alert-outline",
    },
    {
      key: "http_5xx_rate_percent",
      label: "HTTP 5xx (%)",
      icon: "mdi:close-circle-outline",
    },
    {
      key: "latency_p50_ms",
      label: "Latency P50 (ms)",
      icon: "mdi:timer-outline",
    },
    {
      key: "latency_p95_ms",
      label: "Latency P95 (ms)",
      icon: "mdi:timer-outline",
    },
    {
      key: "latency_p99_ms",
      label: "Latency P99 (ms)",
      icon: "mdi:timer-outline",
    },
    {
      key: "queue_length",
      label: "Queue Length",
      icon: "mdi:playlist-play",
    },
    {
      key: "application_saturation_percent",
      label: "Saturation (%)",
      icon: "mdi:gauge",
    },
  ];

  const tableData = data.map((item) => ({
    ...item,
    timestamp: item.timestamp
      ? new Date(item.timestamp).toLocaleString()
      : "-",
  }));

  return (
    <Table
      columns={columns}
      data={tableData}
      empty="No application-level data available"
    />
  );
};

export default AppLevelTable;
