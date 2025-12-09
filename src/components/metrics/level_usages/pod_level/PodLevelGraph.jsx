import React from "react";
import Graph from "../../../common/Graph";

const PodLevelGraph = ({ data }) => {
  // Transform data for Pod Count graph
  const podCountData = data.map((pod, index) => ({
    time: `Pod ${index + 1}`,
    value: pod.current_pod_count,
    timeStamp: new Date().getTime() - (data.length - index) * 60000,
  }));

  // Transform data for CPU Usage graph
  const cpuData = data.map((pod, index) => ({
    time: `Pod ${index + 1}`,
    avg: pod.pod_cpu_usage_percent_avg,
    p95: pod.pod_cpu_usage_percent_p95,
    timeStamp: new Date().getTime() - (data.length - index) * 60000,
  }));

  // Transform data for Memory Usage graph
  const memoryData = data.map((pod, index) => ({
    time: `Pod ${index + 1}`,
    avg: pod.pod_memory_usage_mb_avg,
    p95: pod.pod_memory_usage_mb_p95,
    timeStamp: new Date().getTime() - (data.length - index) * 60000,
  }));

  // Transform data for Resource Limits graph
  const limitsData = data.map((pod, index) => ({
    time: `Pod ${index + 1}`,
    cpu: pod.pod_cpu_limit_percent,
    memory: pod.pod_memory_limit_percent,
    restarts: pod.pod_restart_count,
    timeStamp: new Date().getTime() - (data.length - index) * 60000,
  }));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Pod Count Graph */}
      <Graph
        data={podCountData}
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
        tooltipFields={[{ key: "value", label: "Pod Count", suffix: "" }]}
      />

      {/* CPU Usage Graph */}
      <Graph
        data={cpuData}
        xKey="time"
        yKey="avg"
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
          { key: "avg", label: "CPU Avg", suffix: "%" },
          { key: "p95", label: "CPU P95", suffix: "%" },
        ]}
      />

      {/* Memory Usage Graph */}
      <Graph
        data={memoryData}
        xKey="time"
        yKey="avg"
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
          { key: "avg", label: "Memory Avg", suffix: " MB" },
          { key: "p95", label: "Memory P95", suffix: " MB" },
        ]}
      />

      {/* Resource Limits Graph */}
      <Graph
        data={limitsData}
        xKey="time"
        yKey="cpu"
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
          { key: "cpu", label: "CPU Limit", suffix: "%" },
          { key: "memory", label: "Memory Limit", suffix: "%" },
          { key: "restarts", label: "Restarts", suffix: "" },
        ]}
      />
    </div>
  );
};

export default PodLevelGraph;
