import React, { useState } from "react";
import { Icon } from "@iconify/react";
// import nodeLevelData from "../../../../data/nodeLevel"; // static fallback (dev only)
import NodeLevelTable from "./NodeLevelTable";
import NodeLevelGraph from "./NodeLevelGraph";

const NodeLevel = ({ data = [], isConnected = false, error = null }) => {
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'graph'

  // ── DEV: Simulate random real-time updates (commented out — using live SSE now) ──
  // const [data, setData] = useState(nodeLevelData);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setData((prevData) =>
  //       prevData.map((node) => ({
  //         ...node,
  //         node_cpu_usage_percent: Math.min(
  //           100,
  //           Math.max(0, node.node_cpu_usage_percent + (Math.random() * 10 - 5))
  //         ),
  //         node_memory_usage_percent: Math.min(
  //           100,
  //           Math.max(
  //             0,
  //             node.node_memory_usage_percent + (Math.random() * 8 - 4)
  //           )
  //         ),
  //         node_memory_usage_mb: Math.max(
  //           0,
  //           node.node_memory_usage_mb + (Math.random() * 200 - 100)
  //         ),
  //         node_network_rx_kbps: Math.max(
  //           0,
  //           node.node_network_rx_kbps + (Math.random() * 100 - 50)
  //         ),
  //         node_network_tx_kbps: Math.max(
  //           0,
  //           node.node_network_tx_kbps + (Math.random() * 100 - 50)
  //         ),
  //         node_disk_read_iops: Math.max(
  //           0,
  //           node.node_disk_read_iops + (Math.random() * 20 - 10)
  //         ),
  //         node_disk_write_iops: Math.max(
  //           0,
  //           node.node_disk_write_iops + (Math.random() * 20 - 10)
  //         ),
  //       }))
  //     );
  //   }, 3000); // Update every 3 seconds
  //   return () => clearInterval(interval);
  // }, []);
  // ────────────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col flex-1 gap-4 p-6">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Node Level Metrics
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Real-time monitoring of node-level performance metrics
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg dark:bg-darkBackgroundVery">
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === "table"
                ? "bg-white dark:bg-darkBackground text-primary shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
          >
            <Icon icon="mdi:table" className="w-4 h-4" />
            Table
          </button>
          <button
            onClick={() => setViewMode("graph")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === "graph"
                ? "bg-white dark:bg-darkBackground text-primary shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
          >
            <Icon icon="mdi:chart-line" className="w-4 h-4" />
            Graph
          </button>
        </div>
      </div>

      {/* Live Indicator */}
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${isConnected
            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
            : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          }`}
      >
        <div
          className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
            }`}
        />
        <span
          className={`text-sm font-medium ${isConnected
              ? "text-green-700 dark:text-green-400"
              : "text-red-700 dark:text-red-400"
            }`}
        >
          {isConnected
            ? `Live — Real-time streaming (${data.length} nodes)`
            : error || "Connecting to live stream..."}
        </span>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {viewMode === "table" ? (
          <NodeLevelTable data={data} />
        ) : (
          <NodeLevelGraph data={data} />
        )}
      </div>
    </div>
  );
};

export default NodeLevel;
