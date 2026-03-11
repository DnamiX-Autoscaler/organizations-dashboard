import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Metric groups for chart display
const METRIC_COLORS = {
  current_pod_count: "#6366f1",
  request_rate_rps: "#f59e0b",
  success_rate_percent: "#10b981",
  error_rate_percent: "#ef4444",
  latency_p50_ms: "#8b5cf6",
  latency_p95_ms: "#ec4899",
  pod_cpu_usage_percent_avg: "#3b82f6",
  pod_cpu_usage_percent_p95: "#06b6d4",
  pod_memory_usage_mb_avg: "#14b8a6",
  pod_memory_usage_mb_p95: "#0ea5e9",
  pod_restart_count: "#f43f5e",
  mesh_inbound_rps: "#a855f7",
  mesh_inbound_latency_p95_ms: "#d946ef",
  mesh_inbound_error_rate: "#e11d48",
  degree_centrality: "#f97316",
  betweenness_centrality: "#84cc16",
  closeness_centrality: "#22d3ee",
  eigenvector_centrality: "#c084fc",
};

const formatTimestamp = (ts) => {
  if (!ts) return "";
  const d = new Date(ts);
  return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })} ${d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;
};

const formatShortDate = (ts) => {
  if (!ts) return "";
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="px-4 py-3 border border-gray-200 rounded-lg shadow-xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md dark:border-gray-600 max-w-xs">
      <p className="mb-2 text-xs font-semibold text-gray-900 dark:text-white">
        {formatTimestamp(label)}
      </p>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div
            key={entry.dataKey}
            className="flex items-center justify-between gap-4 text-xs"
          >
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 dark:text-gray-300 truncate">
                {entry.dataKey.replace(/_/g, " ")}
              </span>
            </div>
            <span className="font-mono font-medium text-gray-900 dark:text-white">
              {typeof entry.value === "number"
                ? entry.value % 1 !== 0
                  ? entry.value.toFixed(3)
                  : entry.value.toLocaleString()
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TimeSeriesChart = ({
  data,
  selectedMetrics,
  chartType = "line",
  height = 400,
}) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((d) => ({
      ...d,
      _ts: d.timestamp,
    }));
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700"
        style={{ height }}
      >
        <p className="text-sm text-gray-400 dark:text-gray-500">
          No data points available for this service
        </p>
      </div>
    );
  }

  const ChartComponent = chartType === "area" ? AreaChart : LineChart;
  const DataComponent = chartType === "area" ? Area : Line;

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="_ts"
            tickFormatter={formatShortDate}
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            interval="preserveStartEnd"
            minTickGap={60}
          />
          <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} width={60} />
          <Tooltip
            content={<CustomTooltip selectedMetrics={selectedMetrics} />}
          />
          <Legend
            wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
            formatter={(value) => (
              <span className="text-gray-600 dark:text-gray-300">
                {value.replace(/_/g, " ")}
              </span>
            )}
          />
          {selectedMetrics.map((metric) =>
            chartType === "area" ? (
              <Area
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={METRIC_COLORS[metric] || "#6366f1"}
                fill={METRIC_COLORS[metric] || "#6366f1"}
                fillOpacity={0.1}
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3 }}
              />
            ) : (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={METRIC_COLORS[metric] || "#6366f1"}
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3 }}
              />
            ),
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeSeriesChart;
