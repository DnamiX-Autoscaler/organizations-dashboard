import React from "react";
import Table from "../../../common/Table";

const PodLevelTable = ({ data }) => {
  const columns = [
    {
      key: "service_name",
      label: "Service Name",
      bold: true,
      icon: "mdi:cube-outline",
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
      key: "current_pod_count",
      label: "Pod Count",
      icon: "mdi:layers-triple",
    },
    {
      key: "pod_cpu_usage_percent_avg",
      label: "CPU Avg (%)",
      icon: "mdi:cpu-64-bit",
    },
    {
      key: "pod_cpu_usage_percent_p95",
      label: "CPU P95 (%)",
      icon: "mdi:cpu-64-bit",
    },
    {
      key: "pod_memory_usage_mb_avg",
      label: "Memory Avg (MB)",
      icon: "mdi:memory",
    },
    {
      key: "pod_memory_usage_mb_p95",
      label: "Memory P95 (MB)",
      icon: "mdi:memory",
    },
    {
      key: "pod_restart_count",
      label: "Restart Count",
      icon: "mdi:restart",
    },
    {
      key: "pod_cpu_limit_percent",
      label: "CPU Limit (%)",
      icon: "mdi:gauge",
    },
    {
      key: "pod_memory_limit_percent",
      label: "Memory Limit (MB)",
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
    <Table columns={columns} data={tableData} empty="No pod-level data available" />
  );
};

export default PodLevelTable;
