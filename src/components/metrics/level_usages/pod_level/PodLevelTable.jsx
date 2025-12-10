import React from "react";
import Table from "../../../common/Table";

const PodLevelTable = ({ data }) => {
  const columns = [
    {
      key: "current_pod_count",
      label: "Pod Count",
      bold: true,
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "pod_cpu_usage_percent_avg",
      label: "CPU Avg (%)",
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "pod_cpu_usage_percent_p95",
      label: "CPU P95 (%)",
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "pod_memory_usage_mb_avg",
      label: "Memory Avg (MB)",
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "pod_memory_usage_mb_p95",
      label: "Memory P95 (MB)",
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "pod_restart_count",
      label: "Restart Count",
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "pod_cpu_limit_percent",
      label: "CPU Limit (%)",
      icon: "fluent:leaf-two-24-regular",
    },
    {
      key: "pod_memory_limit_percent",
      label: "Memory Limit (%)",
      icon: "fluent:leaf-two-24-regular",
    },
  ];

  return (
    <Table columns={columns} data={data} empty="No pod-level data available" />
  );
};

export default PodLevelTable;
