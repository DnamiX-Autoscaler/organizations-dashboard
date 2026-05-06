import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import TitleHeader from "../../../components/common/TitleHeader";
import { getReadyColor, getPodStatistics } from "../../../data/runningPods";
import runningPodsService from "../../../api/services/metrics/running_pods";
import StatusBadge from "../../../components/metrics/running_pods/StatusBadge.jsx";
import ReadyBadge from "../../../components/metrics/running_pods/ReadyBadge.jsx";
import StatisticsCards from "../../../components/metrics/running_pods/StatisticsCards.jsx";
import Search from "../../../components/common/Search.jsx";
import FilterDropdown from "../../../components/common/FilterDropdown.jsx";
import RunningPodsTable from "../../../components/metrics/running_pods/RunningPodsTable.jsx";

const RunningPods = () => {
  const [pods, setPods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch pods data
  const loadPods = async () => {
    setLoading(true);
    try {
      const data = await runningPodsService.getPods();
      setPods(data);
    } catch (error) {
      console.error("Failed to fetch pods:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and auto-refresh
  useEffect(() => {
    loadPods();

    if (autoRefresh) {
      const interval = setInterval(() => {
        loadPods();
      }, 10000); // Refresh every 10 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Filter pods
  const filteredPods = pods.filter((pod) => {
    const matchesSearch = pod.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      pod.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const stats = getPodStatistics(pods);

  // Filter options for status dropdown
  const statusFilterOptions = [
    { value: "all", label: "All Status" },
    { value: "running", label: "Running" },
    { value: "failed", label: "Failed" },
    { value: "error", label: "Error" },
    { value: "crashloopbackoff", label: "CrashLoopBackOff" },
    { value: "pending", label: "Pending" },
  ];

  return (
    <div className="space-y-6">
      <TitleHeader
        title="Running Pods"
        subtitle="Monitor and manage Kubernetes pods running in your cluster"
      />

      {/* Statistics Cards */}
      <StatisticsCards stats={stats} />

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <Search
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search pods..."
          />

          {/* Filter by status */}
          <FilterDropdown
            value={filterStatus}
            onChange={setFilterStatus}
            options={statusFilterOptions}
            placeholder="Filter by status"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Auto-refresh toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all ${autoRefresh
                ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                : "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800"
              }`}
          >
            <Icon
              icon={autoRefresh ? "mdi:refresh" : "mdi:refresh-off"}
              className={`w-4 h-4 ${autoRefresh ? "animate-spin" : ""}`}
            />
            {autoRefresh ? "Auto-refresh On" : "Auto-refresh Off"}
          </button>

          {/* Refresh button */}
          <button
            onClick={loadPods}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon
              icon="mdi:refresh"
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Pods Table */}
      <RunningPodsTable
        pods={filteredPods}
        loading={loading}
        empty="No pods found"
      />

      {/* Results count */}
      {!loading && filteredPods.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700 dark:text-gray-400">
          <span>
            Showing {filteredPods.length} of {pods.length} pods
          </span>
          <span className="font-mono text-xs">kubectl get pods -o wide</span>
        </div>
      )}
    </div>
  );
};

export default RunningPods;
