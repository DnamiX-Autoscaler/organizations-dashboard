import React from "react";
import Table from "../../../common/Table";

const NodeLevelTable = ({ data }) => {
  const columns = [
    {
      key: "node_name",
      label: "Node Name",
      bold: true,
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "node_cpu_usage_percent",
      label: "CPU Usage (%)",
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "node_memory_usage_percent",
      label: "Memory (%)",
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "node_memory_usage_mb",
      label: "Memory (MB)",
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "node_network_rx_kbps",
      label: "Network RX (Kbps)",
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "node_network_tx_kbps",
      label: "Network TX (Kbps)",
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "node_disk_read_iops",
      label: "Disk Read IOPS",
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "node_disk_write_iops",
      label: "Disk Write IOPS",
      icon: "fluent:leaf-two-24-regular",
    },
  ];

  return (
    <Table columns={columns} data={data} empty="No node-level data available" />
  );
};

export default NodeLevelTable;
