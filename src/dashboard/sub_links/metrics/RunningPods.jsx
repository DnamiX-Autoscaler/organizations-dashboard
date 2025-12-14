import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import TitleHeader from "../../../components/common/TitleHeader";
import {
  fetchRunningPods,
  getStatusColor,
  getReadyColor,
  getPodStatistics,
} from "../../../data/runningPods";

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
      const data = await fetchRunningPods();
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

  // Status badge component
  const StatusBadge = ({ status }) => {
    const color = getStatusColor(status);
    const colorClasses = {
      green:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      orange:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      yellow:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      gray: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-md ${colorClasses[color]}`}
      >
        {status}
      </span>
    );
  };

  // Ready badge component
  const ReadyBadge = ({ ready }) => {
    const color = getReadyColor(ready);
    const colorClasses = {
      green: "text-green-600 dark:text-green-400",
      red: "text-red-600 dark:text-red-400",
      yellow: "text-yellow-600 dark:text-yellow-400",
    };

    return (
      <span className={`font-mono text-sm font-medium ${colorClasses[color]}`}>
        {ready}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <TitleHeader
        title="Running Pods"
        subtitle="Monitor and manage Kubernetes pods running in your cluster"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Pods
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg dark:bg-blue-900/30">
              <Icon
                icon="mdi:cube-outline"
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Running
              </p>
              <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.running}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg dark:bg-green-900/30">
              <Icon
                icon="mdi:check-circle"
                className="w-6 h-6 text-green-600 dark:text-green-400"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Error
              </p>
              <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.error}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg dark:bg-red-900/30">
              <Icon
                icon="mdi:alert-circle"
                className="w-6 h-6 text-red-600 dark:text-red-400"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending
              </p>
              <p className="mt-1 text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.pending}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg dark:bg-yellow-900/30">
              <Icon
                icon="mdi:clock-outline"
                className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Icon
              icon="mdi:magnify"
              className="absolute w-5 h-5 text-gray-400 left-3 top-2.5"
            />
            <input
              type="text"
              placeholder="Search pods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2 pl-10 pr-4 text-sm border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-darkBackgroundVery focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white"
            />
          </div>

          {/* Filter by status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-darkBackgroundVery focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="running">Running</option>
            <option value="error">Error</option>
            <option value="crashloopbackoff">CrashLoopBackOff</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          {/* Auto-refresh toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all ${
              autoRefresh
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
      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-darkBackgroundVery">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Name
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Ready
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Restarts
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Age
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  IP
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Node
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-darkBackground dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <Icon
                      icon="mdi:loading"
                      className="inline w-8 h-8 text-primary animate-spin"
                    />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Loading pods...
                    </p>
                  </td>
                </tr>
              ) : filteredPods.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <Icon
                      icon="mdi:cube-off-outline"
                      className="inline w-12 h-12 text-gray-300 dark:text-gray-600"
                    />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      No pods found
                    </p>
                  </td>
                </tr>
              ) : (
                filteredPods.map((pod) => (
                  <tr
                    key={pod.name}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-darkBackgroundVery"
                  >
                    <td className="px-6 py-4 font-mono text-sm text-gray-900 whitespace-nowrap dark:text-white">
                      {pod.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ReadyBadge ready={pod.ready} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={pod.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                      {pod.restarts}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                      {pod.age}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-gray-900 whitespace-nowrap dark:text-white">
                      {pod.ip}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                      {pod.node}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
