import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import appLevelData from "../../../../data/appLevel";
import AppLevelTable from "./AppLevelTable";
import AppLevelGraph from "./AppLevelGraph";

const AppLevel = () => {
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'graph'
  const [data, setData] = useState(appLevelData);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) =>
        prevData.map((app) => ({
          ...app,
          request_rate_rps: Math.max(
            0,
            Math.round(app.request_rate_rps + (Math.random() * 200 - 100))
          ),
          success_rate_percent: Math.min(
            100,
            Math.max(95, app.success_rate_percent + (Math.random() * 2 - 1))
          ),
          error_rate_percent: Math.min(
            5,
            Math.max(0, app.error_rate_percent + (Math.random() * 1 - 0.5))
          ),
          http_4xx_rate_percent: Math.min(
            3,
            Math.max(
              0,
              app.http_4xx_rate_percent + (Math.random() * 0.5 - 0.25)
            )
          ),
          http_5xx_rate_percent: Math.min(
            3,
            Math.max(
              0,
              app.http_5xx_rate_percent + (Math.random() * 0.5 - 0.25)
            )
          ),
          latency_p50_ms: Math.max(
            20,
            app.latency_p50_ms + (Math.random() * 20 - 10)
          ),
          latency_p95_ms: Math.max(
            50,
            app.latency_p95_ms + (Math.random() * 30 - 15)
          ),
          latency_p99_ms: Math.max(
            100,
            app.latency_p99_ms + (Math.random() * 50 - 25)
          ),
          queue_length: Math.max(
            0,
            Math.round(app.queue_length + (Math.random() * 4 - 2))
          ),
          application_saturation_percent: Math.min(
            100,
            Math.max(
              0,
              app.application_saturation_percent + (Math.random() * 10 - 5)
            )
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
            Application Level Metrics
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Real-time monitoring of application-level performance metrics
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
          <AppLevelTable data={data} />
        ) : (
          <AppLevelGraph data={data} />
        )}
      </div>
    </div>
  );
};

export default AppLevel;
