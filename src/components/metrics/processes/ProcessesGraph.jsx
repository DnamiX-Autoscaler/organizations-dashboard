import React, { useState } from "react";
import { Icon } from "@iconify/react";
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

const ProcessesGraph = ({ data }) => {
  const [chartType, setChartType] = useState("line");
  const [timeRange, setTimeRange] = useState("1h");
  const [isLive, setIsLive] = useState(true);
  const [swapAxis, setSwapAxis] = useState(false); // false: time on X, windowSize on Y

  // Transform data for chart - fix time formatting
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

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="px-4 py-3 border border-gray-200 rounded-lg shadow-xl bg-white/90 dark:bg-darkBackground/90 backdrop-blur-md dark:border-gray-600">
          <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
            {d.time}
          </p>
          <div className="space-y-1">
            <p className="text-xs text-gray-600 dark:text-gray-300">
              <span className="font-medium">Window Size:</span> {d.windowSize}s
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              <span className="font-medium">Service:</span> {d.serviceName}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              <span className="font-medium">Cluster:</span> {d.clusterId}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              <span className="font-medium">Namespace:</span> {d.namespace}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              <span className="font-medium">Node:</span> {d.nodeName}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
      {/* Graph Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
        {/* Left Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Chart Type Toggle */}
          <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg dark:bg-darkBackgroundVery">
            <button
              onClick={() => setChartType("line")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                chartType === "line"
                  ? "bg-white dark:bg-darkBackground text-primary shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <Icon icon="mdi:chart-line" className="inline w-4 h-4 mr-1" />
              Line
            </button>
            <button
              onClick={() => setChartType("area")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                chartType === "area"
                  ? "bg-white dark:bg-darkBackground text-primary shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <Icon
                icon="mdi:chart-areaspline"
                className="inline w-4 h-4 mr-1"
              />
              Area
            </button>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg dark:bg-darkBackgroundVery">
            {["15m", "1h", "6h", "24h"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? "bg-white dark:bg-darkBackground text-primary shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Axis Swap Toggle */}
          <button
            onClick={() => setSwapAxis(!swapAxis)}
            className="flex items-center gap-2 px-3 py-2.5 text-xs text-gray-700 transition-all border border-gray-200 rounded-lg dark:text-gray-300 bg-white/60 dark:bg-darkBackground/60 backdrop-blur-md dark:border-gray-600/50 hover:bg-white/80 dark:hover:bg-darkBackground/80"
            title="Swap X and Y axis"
          >
            <Icon icon="mdi:swap-horizontal" className="w-4 h-4" />
            Swap Axis
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Live Update Toggle */}
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all ${
              isLive
                ? " text-green-600 dark:text-green-400"
                : " text-gray-600 dark:text-gray-400"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"
              }`}
            />
            {isLive ? "Live" : "Paused"}
          </button>
        </div>
      </div>

      {/* Graph Area */}
      <div className="p-6">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            {chartType === "line" ? (
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.1}
                />
                {!swapAxis ? (
                  <>
                    <XAxis
                      dataKey="time"
                      stroke="#9CA3AF"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
                  </>
                ) : (
                  <>
                    <XAxis
                      dataKey="windowSize"
                      stroke="#9CA3AF"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      style={{ fontSize: "12px" }}
                      type="category"
                      dataKey="time"
                    />
                  </>
                )}
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
                />
                <Line
                  type="monotone"
                  dataKey={swapAxis ? "time" : "windowSize"}
                  stroke="#84006A"
                  strokeWidth={2}
                  dot={{ fill: "#84006A", r: 4 }}
                  activeDot={{ r: 6 }}
                  name={swapAxis ? "Time" : "Window Size (s)"}
                />
              </LineChart>
            ) : (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="colorWindowSize"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#84006A" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#84006A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.1}
                />
                {!swapAxis ? (
                  <>
                    <XAxis
                      dataKey="time"
                      stroke="#9CA3AF"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
                  </>
                ) : (
                  <>
                    <XAxis
                      dataKey="windowSize"
                      stroke="#9CA3AF"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      style={{ fontSize: "12px" }}
                      type="category"
                      dataKey="time"
                    />
                  </>
                )}
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
                />
                <Area
                  type="monotone"
                  dataKey={swapAxis ? "time" : "windowSize"}
                  stroke="#84006A"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorWindowSize)"
                  name={swapAxis ? "Time" : "Window Size (s)"}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-96">
            <Icon
              icon="mdi:chart-line-variant"
              className="w-16 h-16 text-gray-300 dark:text-gray-600"
            />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              No data available for visualization
            </p>
          </div>
        )}
      </div>

      {/* Graph Stats */}
      <div className="grid grid-cols-4 gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="p-3 rounded-lg bg-gray-50 dark:bg-darkBackgroundVery">
          <div className="flex items-center gap-2 mb-1">
            <Icon icon="mdi:counter" className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Total Points
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {chartData.length}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-gray-50 dark:bg-darkBackgroundVery">
          <div className="flex items-center gap-2 mb-1">
            <Icon icon="mdi:clock-outline" className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Time Range
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {timeRange}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-gray-50 dark:bg-darkBackgroundVery">
          <div className="flex items-center gap-2 mb-1">
            <Icon icon="mdi:trending-up" className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Avg Window
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {chartData.length > 0
              ? Math.round(
                  chartData.reduce((sum, d) => sum + d.windowSize, 0) /
                    chartData.length
                )
              : 0}
            s
          </p>
        </div>

        <div className="p-3 rounded-lg bg-gray-50 dark:bg-darkBackgroundVery">
          <div className="flex items-center gap-2 mb-1">
            <Icon icon="mdi:update" className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Last Update
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {chartData.length > 0
              ? new Date(
                  chartData[chartData.length - 1].timeStamp
                ).toLocaleTimeString()
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcessesGraph;
