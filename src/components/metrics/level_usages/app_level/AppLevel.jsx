import React, { useState } from "react";
import { Icon } from "@iconify/react";
import AppLevelTable from "./AppLevelTable";
import AppLevelGraph from "./AppLevelGraph";
import AppLevelCard from "./AppLevelCard";

const AppLevel = ({ data = [], isConnected = false, error = null }) => {
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'card' | 'graph'

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
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === "table"
                ? "bg-white dark:bg-darkBackground text-primary shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
          >
            <Icon icon="mdi:table" className="w-4 h-4" />
            Table
          </button>
          <button
            onClick={() => setViewMode("card")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === "card"
                ? "bg-white dark:bg-darkBackground text-primary shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
          >
            <Icon icon="mdi:view-grid" className="w-4 h-4" />
            Card
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
            ? `Live — Real-time streaming (${data.length} services)`
            : error || "Connecting to live stream..."}
        </span>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {viewMode === "table" && <AppLevelTable data={data} />}
        {viewMode === "card" && <AppLevelCard data={data} />}
        {viewMode === "graph" && <AppLevelGraph data={data} />}
      </div>
    </div>
  );
};

export default AppLevel;
