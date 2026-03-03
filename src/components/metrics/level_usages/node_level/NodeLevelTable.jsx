import React from "react";
import Table from "../../../common/Table";

const NodeLevelTable = ({ data }) => {
  const columns = [
    {
      key: "node_name",
      label: "Node Name",
      bold: true,
      icon: "mdi:server",
    },
    {
      key: "namespace",
      label: "Namespace",
      icon: "mdi:folder-network-outline",
    },
    {
      key: "services",
      label: "Services",
      icon: "mdi:cube-outline",
    },
    {
      key: "timestamp",
      label: "Timestamp",
      icon: "mdi:clock-outline",
    },
    {
      key: "node_cpu_usage_percent",
      label: "CPU Usage (%)",
      icon: "mdi:cpu-64-bit",
    },
    {
      key: "node_memory_usage_percent",
      label: "Memory (%)",
      icon: "mdi:memory",
    },
    {
      key: "node_memory_usage_mb",
      label: "Memory (MB)",
      icon: "mdi:memory",
    },
    {
      key: "node_network_rx_kbps",
      label: "Network RX (Kbps)",
      icon: "mdi:arrow-down-circle-outline",
    },
    {
      key: "node_network_tx_kbps",
      label: "Network TX (Kbps)",
      icon: "mdi:arrow-up-circle-outline",
    },
    {
      key: "node_disk_read_iops",
      label: "Disk Read IOPS",
      icon: "mdi:harddisk",
    },
    {
      key: "node_disk_write_iops",
      label: "Disk Write IOPS",
      icon: "mdi:harddisk",
    },
  ];

  // Pre-process data: flatten services array → comma-separated string, format timestamp
  const tableData = data.map((item) => ({
    ...item,
    services: Array.isArray(item.services)
      ? item.services.join(", ")
      : item.services ?? "-",
    timestamp: item.timestamp
      ? new Date(item.timestamp).toLocaleString()
      : "-",
  }));

  return (
    <Table
      columns={columns}
      data={tableData}
      empty="No node-level data available"
    />
  );
};

export default NodeLevelTable;
