import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import serviceMeshLevelData from "../../../../data/serviceMeshLevel";
import ServiceMeshLevelTable from "./ServiceMeshLevelTable";
import ServiceMeshLevelGraph from "./ServiceMeshLevelGraph";

const ServiceMeshLevel = () => {
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'graph'
  const [data, setData] = useState(serviceMeshLevelData);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) =>
        prevData.map((mesh) => ({
          ...mesh,
          inbound_request_rate_rps: Math.max(
            0,
            Math.round(
              mesh.inbound_request_rate_rps + (Math.random() * 150 - 75)
            )
          ),
          outbound_request_rate_rps: Math.max(
            0,
            Math.round(
              mesh.outbound_request_rate_rps + (Math.random() * 150 - 75)
            )
          ),
          mesh_latency_p95_ms: Math.max(
            50,
            mesh.mesh_latency_p95_ms + (Math.random() * 30 - 15)
          ),
          mesh_retry_rate_rps: Math.max(
            0,
            Math.round(mesh.mesh_retry_rate_rps + (Math.random() * 6 - 3))
          ),
          mesh_tcp_open_connections: Math.max(
            0,
            Math.round(
              mesh.mesh_tcp_open_connections + (Math.random() * 20 - 10)
            )
          ),
          mesh_tls_error_rate_percent: Math.min(
            2,
            Math.max(
              0,
              mesh.mesh_tls_error_rate_percent + (Math.random() * 0.4 - 0.2)
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
            Service Mesh Level Metrics
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Real-time monitoring of service mesh performance metrics
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
          <ServiceMeshLevelTable data={data} />
        ) : (
          <ServiceMeshLevelGraph data={data} />
        )}
      </div>
    </div>
  );
};

export default ServiceMeshLevel;
