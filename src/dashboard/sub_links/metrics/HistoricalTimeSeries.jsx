import React, { useState, useRef, useMemo, useCallback } from "react";
import { Icon } from "@iconify/react";
import TitleHeader from "../../../components/common/TitleHeader";
import historicalTimeSeriesService from "../../../api/services/metrics/historical_time_series_metrics";
import TimeSeriesChart from "../../../components/metrics/historical_time_series/TimeSeriesChart";
import TimeSeriesStatsCards from "../../../components/metrics/historical_time_series/TimeSeriesStatsCards";
import TimeSeriesTable from "../../../components/metrics/historical_time_series/TimeSeriesTable";
import ServiceSelector from "../../../components/metrics/historical_time_series/ServiceSelector";

// ── Metric definitions ──────────────────────────────────────────────
const METRIC_GROUPS = [
  {
    label: "Application",
    icon: "mdi:application-braces-outline",
    metrics: [
      { key: "request_rate_rps", label: "Request Rate (rps)" },
      { key: "success_rate_percent", label: "Success Rate (%)" },
      { key: "error_rate_percent", label: "Error Rate (%)" },
      { key: "latency_p50_ms", label: "Latency P50 (ms)" },
      { key: "latency_p95_ms", label: "Latency P95 (ms)" },
    ],
  },
  {
    label: "Pod Resources",
    icon: "mdi:memory",
    metrics: [
      { key: "current_pod_count", label: "Pod Count" },
      { key: "pod_cpu_usage_percent_avg", label: "CPU Avg (%)" },
      { key: "pod_cpu_usage_percent_p95", label: "CPU P95 (%)" },
      { key: "pod_memory_usage_mb_avg", label: "Memory Avg (MB)" },
      { key: "pod_memory_usage_mb_p95", label: "Memory P95 (MB)" },
      { key: "pod_restart_count", label: "Restart Count" },
    ],
  },
  {
    label: "Service Mesh",
    icon: "mdi:lan",
    metrics: [
      { key: "mesh_inbound_rps", label: "Inbound RPS" },
      { key: "mesh_inbound_latency_p95_ms", label: "Inbound Latency P95 (ms)" },
      { key: "mesh_inbound_error_rate", label: "Inbound Error Rate" },
    ],
  },
  {
    label: "Graph Topology",
    icon: "mdi:graph-outline",
    metrics: [
      { key: "degree_centrality", label: "Degree Centrality" },
      { key: "betweenness_centrality", label: "Betweenness Centrality" },
      { key: "closeness_centrality", label: "Closeness Centrality" },
      { key: "eigenvector_centrality", label: "Eigenvector Centrality" },
    ],
  },
];

const DEFAULT_METRICS = ["request_rate_rps", "error_rate_percent"];

const TABS = [
  { key: "chart", label: "Time Series Chart", icon: "mdi:chart-line" },
  { key: "table", label: "Raw Data", icon: "mdi:table-large" },
  { key: "overview", label: "Overview", icon: "mdi:format-list-bulleted" },
];

// ── Helpers ──────────────────────────────────────────────────────────
const formatRange = (range) => {
  if (!range) return "—";
  const s = new Date(range.start);
  const e = new Date(range.end);
  const fmt = (d) =>
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    " " +
    d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  return `${fmt(s)}  →  ${fmt(e)}`;
};

const downloadJSON = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const downloadCSV = (data, filename) => {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const rows = data.map((r) =>
    headers.map((h) => JSON.stringify(r[h] ?? "")).join(","),
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// ── Component ────────────────────────────────────────────────────────
const HistoricalTimeSeries = () => {
  // Query parameters
  const [lookbackDays, setLookbackDays] = useState(7);
  const [stepSeconds, setStepSeconds] = useState(3600);

  // Fetch state
  const [services, setServices] = useState({});
  const [queryRange, setQueryRange] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataReceived, setDataReceived] = useState(false);
  const abortControllerRef = useRef(null);

  // UI state
  const [selectedService, setSelectedService] = useState(null);
  const [selectedMetrics, setSelectedMetrics] = useState(DEFAULT_METRICS);
  const [activeTab, setActiveTab] = useState("chart");
  const [chartType, setChartType] = useState("line");
  const [activeMetricGroup, setActiveMetricGroup] = useState("Application");

  // ── Fetch data ───────────────────────────────────────────────────
  const handleStartCollect = useCallback(async () => {
    // Abort any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);
    setDataReceived(false);
    setServices({});
    setQueryRange(null);
    setSelectedService(null);

    try {
      const data = await historicalTimeSeriesService.fetchDateRange({
        lookbackDays,
        stepSeconds,
        signal: controller.signal,
      });

      if (data.query_range) {
        setQueryRange(data.query_range);
      }

      if (data.services) {
        setServices(data.services);

        // Auto-select first service with data
        const entries = Object.entries(data.services);
        const withData = entries.find(
          ([, points]) => Array.isArray(points) && points.length > 0,
        );
        if (withData) setSelectedService(withData[0]);
        else if (entries.length > 0) setSelectedService(entries[0][0]);
      }

      setDataReceived(true);
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("Time-series fetch error:", err);
      setError(err.message || "Failed to fetch time-series data.");
    } finally {
      setIsLoading(false);
    }
  }, [lookbackDays, stepSeconds]);

  // ── Derived data ─────────────────────────────────────────────────
  const currentServiceData = useMemo(() => {
    if (!selectedService || !services[selectedService]) return [];
    const data = services[selectedService];
    return Array.isArray(data) ? data : [];
  }, [services, selectedService]);

  const currentServiceName = useMemo(() => {
    if (!selectedService) return "";
    if (currentServiceData.length > 0 && currentServiceData[0].service_name) {
      return currentServiceData[0].service_name;
    }
    return selectedService.split("/").pop();
  }, [selectedService, currentServiceData]);

  const totalDataPoints = useMemo(() => {
    return Object.values(services).reduce(
      (sum, points) => sum + (Array.isArray(points) ? points.length : 0),
      0,
    );
  }, [services]);

  const totalServices = Object.keys(services).length;

  // ── Metric toggling ──────────────────────────────────────────────
  const toggleMetric = useCallback((metric) => {
    setSelectedMetrics((prev) => {
      if (prev.includes(metric)) {
        if (prev.length === 1) return prev; // keep at least one
        return prev.filter((m) => m !== metric);
      }
      return [...prev, metric];
    });
  }, []);

  const selectMetricGroup = useCallback((groupLabel) => {
    const group = METRIC_GROUPS.find((g) => g.label === groupLabel);
    if (group) {
      setSelectedMetrics(group.metrics.map((m) => m.key));
      setActiveMetricGroup(groupLabel);
    }
  }, []);

  // ── Export ────────────────────────────────────────────────────────
  const handleExport = useCallback(
    (format) => {
      if (currentServiceData.length === 0) return;
      const filename = `timeseries_${currentServiceName}_${new Date().toISOString().slice(0, 10)}`;
      if (format === "json")
        downloadJSON(currentServiceData, `${filename}.json`);
      else downloadCSV(currentServiceData, `${filename}.csv`);
    },
    [currentServiceData, currentServiceName],
  );

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header */}
      <TitleHeader
        title="Historical Time Series"
        subtitle="Fetch Prometheus metrics for a custom date range"
      />

      {/* Query Parameters Card */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
        <p className="mb-4 text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
          Query Parameters
        </p>
        <div className="flex flex-wrap items-end gap-4">
          {/* Lookback Days */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Lookback Days
            </label>
            <input
              type="number"
              min={1}
              max={90}
              value={lookbackDays}
              onChange={(e) =>
                setLookbackDays(Math.max(0, parseInt(e.target.value) || 0))
              }
              className="w-32 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none bg-gray-50 dark:bg-darkBackgroundVery dark:border-gray-600 dark:text-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
            />
          </div>

          {/* Step Seconds */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Step Seconds
            </label>
            <input
              type="number"
              min={60}
              max={86400}
              value={stepSeconds}
              onChange={(e) =>
                setStepSeconds(Math.max(0, parseInt(e.target.value) || 0))
              }
              className="w-32 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none bg-gray-50 dark:bg-darkBackgroundVery dark:border-gray-600 dark:text-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
            />
          </div>

          {/* Start Collect Button */}
          <button
            onClick={handleStartCollect}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white transition-all bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" />
                Collecting…
              </>
            ) : (
              <>
                <Icon icon="mdi:play-circle-outline" className="w-4.5 h-4.5" />
                Start Collect
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Bar — shown after data arrives */}
      {dataReceived && (
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
          {/* Collected indicator */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Collected
            </span>
          </div>

          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />

          {/* Services count */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Icon icon="mdi:cube-outline" className="w-3.5 h-3.5" />
            <span>{totalServices} services</span>
          </div>

          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />

          {/* Data points */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Icon icon="mdi:database-outline" className="w-3.5 h-3.5" />
            <span>{totalDataPoints.toLocaleString()} data points</span>
          </div>

          {queryRange && (
            <>
              <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <Icon icon="mdi:calendar-range" className="w-3.5 h-3.5" />
                <span>{formatRange(queryRange)}</span>
              </div>
              <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <Icon icon="mdi:clock-outline" className="w-3.5 h-3.5" />
                <span>Step: {queryRange.step_seconds}s</span>
              </div>
            </>
          )}

          {/* Export buttons - right aligned */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => handleExport("csv")}
              disabled={currentServiceData.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-darkBackgroundVery border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Icon icon="mdi:file-delimited-outline" className="w-3.5 h-3.5" />
              CSV
            </button>
            <button
              onClick={() => handleExport("json")}
              disabled={currentServiceData.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-darkBackgroundVery border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Icon icon="mdi:code-json" className="w-3.5 h-3.5" />
              JSON
            </button>
          </div>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-700 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          <Icon
            icon="mdi:alert-circle-outline"
            className="flex-shrink-0 w-5 h-5"
          />
          {error}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-10 h-10 mb-4 border-4 border-indigo-200 rounded-full border-t-indigo-600 animate-spin" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Collecting historical time-series data…
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Lookback: {lookbackDays} days · Step: {stepSeconds}s
          </p>
        </div>
      )}

      {/* Empty state — before first collect */}
      {!dataReceived && !isLoading && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Icon
            icon="mdi:chart-timeline-variant-shimmer"
            className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600"
          />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Configure parameters and click Start Collect
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Set lookback days &amp; step seconds, then fetch your metrics
          </p>
        </div>
      )}

      {/* Main content - shown after data arrives */}
      {dataReceived && !isLoading && (
        <>
          {/* Service Selector */}
          <ServiceSelector
            services={services}
            selectedService={selectedService}
            onSelect={setSelectedService}
          />

          {/* Metric Selector */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
            {/* Group tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <p className="mr-2 text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                Metrics
              </p>
              {METRIC_GROUPS.map((group) => (
                <button
                  key={group.label}
                  onClick={() => selectMetricGroup(group.label)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all border ${
                    activeMetricGroup === group.label
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white dark:bg-darkBackgroundVery text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-indigo-400"
                  }`}
                >
                  <Icon icon={group.icon} className="w-3.5 h-3.5" />
                  {group.label}
                </button>
              ))}

              {/* Chart type toggle */}
              <div className="flex items-center gap-1 p-1 ml-auto bg-gray-100 rounded-lg dark:bg-gray-800">
                <button
                  onClick={() => setChartType("line")}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    chartType === "line"
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  <Icon icon="mdi:chart-line" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setChartType("area")}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    chartType === "area"
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  <Icon icon="mdi:chart-areaspline" className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Individual metric toggles */}
            <div className="flex flex-wrap gap-2">
              {METRIC_GROUPS.find(
                (g) => g.label === activeMetricGroup,
              )?.metrics.map((m) => {
                const isActive = selectedMetrics.includes(m.key);
                return (
                  <button
                    key={m.key}
                    onClick={() => toggleMetric(m.key)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all border ${
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-600"
                        : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stats Cards */}
          <TimeSeriesStatsCards
            data={currentServiceData}
            selectedMetrics={selectedMetrics}
          />

          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg dark:bg-gray-800 w-fit">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.key
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Icon icon={tab.icon} className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "chart" && (
            <TimeSeriesChart
              data={currentServiceData}
              selectedMetrics={selectedMetrics}
              chartType={chartType}
              height={420}
            />
          )}

          {activeTab === "table" && (
            <TimeSeriesTable
              data={currentServiceData}
              serviceName={currentServiceName}
            />
          )}

          {activeTab === "overview" && (
            <OverviewPanel
              services={services}
              queryRange={queryRange}
              totalDataPoints={totalDataPoints}
            />
          )}
        </>
      )}
    </div>
  );
};

// ── Overview Panel ───────────────────────────────────────────────────
const OverviewPanel = ({ services, queryRange, totalDataPoints }) => {
  const serviceEntries = Object.entries(services);

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          icon="mdi:cube-outline"
          label="Total Services"
          value={serviceEntries.length}
          color="indigo"
        />
        <OverviewCard
          icon="mdi:database-outline"
          label="Total Data Points"
          value={totalDataPoints.toLocaleString()}
          color="emerald"
        />
        <OverviewCard
          icon="mdi:clock-outline"
          label="Step Interval"
          value={queryRange ? `${queryRange.step_seconds}s` : "—"}
          color="amber"
        />
        <OverviewCard
          icon="mdi:calendar-range"
          label="Lookback"
          value={queryRange ? `${queryRange.lookback_days} days` : "—"}
          color="green"
        />
      </div>

      {/* Service breakdown table */}
      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Service Breakdown
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-darkBackgroundVery">
              <tr>
                {[
                  "Service",
                  "Namespace",
                  "Data Points",
                  "First Record",
                  "Last Record",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {serviceEntries.map(([key, dataPoints]) => {
                const points = Array.isArray(dataPoints) ? dataPoints : [];
                const first = points[0]?.timestamp;
                const last = points[points.length - 1]?.timestamp;
                const serviceName =
                  points[0]?.service_name || key.split("/").pop();
                const namespace = points[0]?.namespace || key.split("/")[0];
                return (
                  <tr
                    key={key}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-darkBackgroundVery"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {serviceName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                        {namespace}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {points.length.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {first ? new Date(first).toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {last ? new Date(last).toLocaleString() : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const OverviewCard = ({ icon, label, value, color }) => {
  const colorClasses = {
    indigo:
      "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
    emerald:
      "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    amber:
      "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    green:
      "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-lg ${colorClasses[color] || colorClasses.indigo}`}
      >
        <Icon icon={icon} className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase dark:text-gray-400">
          {label}
        </p>
        <p className="text-lg font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
};

export default HistoricalTimeSeries;
