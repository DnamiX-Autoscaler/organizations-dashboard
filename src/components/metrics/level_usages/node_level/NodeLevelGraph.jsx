import React from "react";
import Graph from "../../../common/Graph";

const NodeLevelGraph = ({ data }) => {
  // Use namespace as X-axis label (each record = one namespace on the node)
  // Timestamp and services are included in tooltips

  const cpuData = data.map((item) => ({
    time: item.timestamp
      ? new Date(item.timestamp).toLocaleTimeString()
      : item.namespace ?? item.node_name,
    value: item.node_cpu_usage_percent,
    node: item.node_name,
    namespace: item.namespace,
    timestamp: item.timestamp
      ? new Date(item.timestamp).toLocaleTimeString()
      : "-",
    services: Array.isArray(item.services)
      ? item.services.join(", ")
      : item.services ?? "-",
  }));

  const memoryData = data.map((item) => ({
    time: item.namespace ?? item.node_name,
    value: item.node_memory_usage_percent,
    mb: item.node_memory_usage_mb,
    node: item.node_name,
    namespace: item.namespace,
    timestamp: item.timestamp
      ? new Date(item.timestamp).toLocaleTimeString()
      : "-",
  }));

  const networkData = data.map((item) => ({
    time: item.namespace ?? item.node_name,
    rx: item.node_network_rx_kbps,
    tx: item.node_network_tx_kbps,
    node: item.node_name,
    namespace: item.namespace,
    timestamp: item.timestamp
      ? new Date(item.timestamp).toLocaleTimeString()
      : "-",
  }));

  const diskData = data.map((item) => ({
    time: item.namespace ?? item.node_name,
    read: item.node_disk_read_iops,
    write: item.node_disk_write_iops,
    node: item.node_name,
    namespace: item.namespace,
    timestamp: item.timestamp
      ? new Date(item.timestamp).toLocaleTimeString()
      : "-",
  }));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* CPU Usage Graph */}
      <Graph
        data={cpuData}
        xKey="time"
        yKey="value"
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
          { key: "value", label: "CPU Usage", suffix: "%" },
          { key: "node", label: "Node" },
          { key: "namespace", label: "Namespace" },
          { key: "timestamp", label: "Time" },
          { key: "services", label: "Services" },
        ]}
      />

      {/* Memory Usage Graph */}
      <Graph
        data={memoryData}
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
        tooltipFields={[
          { key: "value", label: "Memory Usage", suffix: "%" },
          { key: "mb", label: "Memory", suffix: " MB" },
          { key: "node", label: "Node" },
          { key: "namespace", label: "Namespace" },
          { key: "timestamp", label: "Time" },
        ]}
      />

      {/* Network Usage Graph */}
      <Graph
        data={networkData}
        xKey="time"
        yKey="rx"
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
          { key: "rx", label: "RX", suffix: " Kbps" },
          { key: "tx", label: "TX", suffix: " Kbps" },
          { key: "node", label: "Node" },
          { key: "namespace", label: "Namespace" },
          { key: "timestamp", label: "Time" },
        ]}
      />

      {/* Disk IOPS Graph */}
      <Graph
        data={diskData}
        xKey="time"
        yKey="read"
        chartType="line"
        color="#F59E0B"
        height={300}
        showControls={true}
        showStats={true}
        enableAxisSwap={false}
        enableTypeToggle={true}
        enableTimeRange={false}
        enableLiveToggle={true}
        tooltipFields={[
          { key: "read", label: "Read IOPS" },
          { key: "write", label: "Write IOPS" },
          { key: "node", label: "Node" },
          { key: "namespace", label: "Namespace" },
          { key: "timestamp", label: "Time" },
        ]}
      />
    </div>
  );
};

export default NodeLevelGraph;
