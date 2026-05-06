import React from "react";
import Table from "../../../common/Table";

const ServiceMeshLevelTable = ({ data }) => {
  const columns = [
    {
      key: "service_name",
      label: "Service Name",
      bold: true,
      icon: "mdi:vector-link",
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
      key: "inbound_request_rate_rps",
      label: "Inbound RPS",
      icon: "mdi:arrow-down-circle-outline",
    },
    {
      key: "outbound_request_rate_rps",
      label: "Outbound RPS",
      icon: "mdi:arrow-up-circle-outline",
    },
    {
      key: "mesh_latency_p95_ms",
      label: "Latency P95 (ms)",
      icon: "mdi:timer-outline",
    },
    {
      key: "mesh_retry_rate_rps",
      label: "Retry Rate (RPS)",
      icon: "mdi:refresh",
    },
    {
      key: "mesh_tcp_open_connections",
      label: "TCP Connections",
      icon: "mdi:lan-connect",
    },
    {
      key: "mesh_tls_error_rate_percent",
      label: "TLS Error (%)",
      icon: "mdi:shield-alert-outline",
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
      empty="No service mesh data available"
    />
  );
};

export default ServiceMeshLevelTable;
