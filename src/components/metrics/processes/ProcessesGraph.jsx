import React from "react";
import Graph from "../../common/Graph";

const ProcessesGraph = ({ data }) => {
  // Transform data for chart
  const chartData = data.map((item, index) => ({
    time: new Date(item.timeStamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    timeStamp: item.timeStamp,
    windowSize: item.windowSize,
    clusterId: item.clusterId,
    namespace: item.namespace,
    serviceName: item.serviceName,
    nodeName: item.nodeName,
    index: index,
  }));

  const tooltipFields = [
    { key: "windowSize", label: "Window Size", suffix: "s" },
    { key: "serviceName", label: "Service" },
    { key: "clusterId", label: "Cluster" },
    { key: "namespace", label: "Namespace" },
    { key: "nodeName", label: "Node" },
  ];

  return (
    <Graph
      data={chartData}
      xKey="time"
      yKey="windowSize"
      chartType="line"
      color="#84006A"
      height={400}
      showControls={true}
      showStats={true}
      tooltipFields={tooltipFields}
      enableAxisSwap={true}
      enableTypeToggle={true}
      enableTimeRange={true}
      enableLiveToggle={true}
    />
  );
};

export default ProcessesGraph;
