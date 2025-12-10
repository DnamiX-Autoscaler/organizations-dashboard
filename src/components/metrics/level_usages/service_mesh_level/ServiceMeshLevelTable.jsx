import React from "react";
import Table from "../../../common/Table";

const ServiceMeshLevelTable = ({ data }) => {
  const columns = [
    {
      key: "inbound_request_rate_rps",
      label: "Inbound RPS",
      bold: true,
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "outbound_request_rate_rps",
      label: "Outbound RPS",
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "mesh_latency_p95_ms",
      label: "Latency P95 (ms)",
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "mesh_retry_rate_rps",
      label: "Retry Rate (RPS)",
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "mesh_tcp_open_connections",
      label: "TCP Connections",
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "mesh_tls_error_rate_percent",
      label: "TLS Error (%)",
      icon: "fluent:leaf-two-24-regular",
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      empty="No service mesh data available"
    />
  );
};

export default ServiceMeshLevelTable;
