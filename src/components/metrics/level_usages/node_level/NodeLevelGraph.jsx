import React from "react";
import Graph from "../../../common/Graph";

const NodeLevelGraph = ({ data }) => {
  // Transform data for CPU usage graph
  const cpuData = data.map((node, index) => ({
    time: node.node_name,
    value: node.node_cpu_usage_percent,
    timeStamp: new Date().getTime() - (data.length - index) * 60000,
  }));

  // Transform data for Memory usage graph
  const memoryData = data.map((node, index) => ({
    time: node.node_name,
    value: node.node_memory_usage_percent,
    mb: node.node_memory_usage_mb,
    timeStamp: new Date().getTime() - (data.length - index) * 60000,
  }));

  // Transform data for Network usage graph
  const networkData = data.map((node, index) => ({
    time: node.node_name,
    rx: node.node_network_rx_kbps,
    tx: node.node_network_tx_kbps,
    timeStamp: new Date().getTime() - (data.length - index) * 60000,
  }));

  // Transform data for Disk IOPS graph
  const diskData = data.map((node, index) => ({
    time: node.node_name,
    read: node.node_disk_read_iops,
    write: node.node_disk_write_iops,
    timeStamp: new Date().getTime() - (data.length - index) * 60000,
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
        tooltipFields={[{ key: "value", label: "CPU Usage", suffix: "%" }]}
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
          { key: "read", label: "Read IOPS", suffix: "" },
          { key: "write", label: "Write IOPS", suffix: "" },
        ]}
      />
    </div>
  );
};

export default NodeLevelGraph;
