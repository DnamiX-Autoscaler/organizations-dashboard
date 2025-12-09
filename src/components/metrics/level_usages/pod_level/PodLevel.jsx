import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import podLevelData from "../../../../data/podLevel";
import PodLevelTable from "./PodLevelTable";
import PodLevelGraph from "./PodLevelGraph";

const PodLevel = () => {
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'graph'
  const [data, setData] = useState(podLevelData);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) =>
        prevData.map((pod) => ({
          ...pod,
          current_pod_count: Math.max(
            0,
            Math.round(pod.current_pod_count + (Math.random() * 4 - 2))
          ),
          pod_cpu_usage_percent_avg: Math.min(
            100,
            Math.max(
              0,
              pod.pod_cpu_usage_percent_avg + (Math.random() * 10 - 5)
            )
          ),
          pod_cpu_usage_percent_p95: Math.min(
            100,
            Math.max(0, pod.pod_cpu_usage_percent_p95 + (Math.random() * 8 - 4))
          ),
          pod_memory_usage_mb_avg: Math.max(
            0,
            pod.pod_memory_usage_mb_avg + (Math.random() * 100 - 50)
          ),
          pod_memory_usage_mb_p95: Math.max(
            0,
            pod.pod_memory_usage_mb_p95 + (Math.random() * 150 - 75)
          ),
          pod_restart_count: Math.max(
            0,
            pod.pod_restart_count + (Math.random() > 0.95 ? 1 : 0)
          ),
          pod_cpu_limit_percent: Math.min(
            100,
            Math.max(0, pod.pod_cpu_limit_percent + (Math.random() * 4 - 2))
          ),
          pod_memory_limit_percent: Math.min(
            100,
            Math.max(0, pod.pod_memory_limit_percent + (Math.random() * 4 - 2))
          ),
        }))
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col flex-1 gap-4 p-6">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Pod Level Metrics
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Real-time monitoring of pod-level performance metrics
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg dark:bg-darkBackgroundVery">
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              viewMode === "table"
                ? "bg-white dark:bg-darkBackground text-primary shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <Icon icon="mdi:table" className="w-4 h-4" />
            Table
          </button>
          <button
            onClick={() => setViewMode("graph")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              viewMode === "graph"
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
      <div className="flex items-center gap-2 px-4 py-2 border border-green-200 rounded-lg bg-green-50 dark:bg-green-900/20 dark:border-green-800">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium text-green-700 dark:text-green-400">
          Live updates enabled - Data refreshes every 3 seconds
        </span>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {viewMode === "table" ? (
          <PodLevelTable data={data} />
        ) : (
          <PodLevelGraph data={data} />
        )}
      </div>
    </div>
  );
};

export default PodLevel;
