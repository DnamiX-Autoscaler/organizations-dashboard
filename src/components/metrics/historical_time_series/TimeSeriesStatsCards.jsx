import React from "react";
import { Icon } from "@iconify/react";

const TimeSeriesStatsCards = ({ data, selectedMetrics }) => {
  if (!data || data.length === 0 || selectedMetrics.length === 0) {
    return null;
  }

  // Calculate stats for each selected metric
  const metricStats = selectedMetrics.slice(0, 4).map((metric) => {
    const values = data
      .map((d) => d[metric])
      .filter((v) => typeof v === "number" && !isNaN(v));

    if (values.length === 0) {
      return { metric, min: 0, max: 0, avg: 0, latest: 0, trend: "stable" };
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((s, v) => s + v, 0) / values.length;
    const latest = values[values.length - 1];
    const prev = values.length > 1 ? values[values.length - 2] : latest;
    const trend = latest > prev ? "up" : latest < prev ? "down" : "stable";

    return { metric, min, max, avg, latest, trend };
  });

  const formatValue = (v) => {
    if (v === 0) return "0";
    if (Math.abs(v) >= 1000)
      return v.toLocaleString(undefined, { maximumFractionDigits: 1 });
    if (Math.abs(v) < 0.01) return v.toExponential(2);
    return v.toFixed(2);
  };

  const trendConfig = {
    up: { icon: "mdi:trending-up", color: "text-green-500" },
    down: { icon: "mdi:trending-down", color: "text-red-500" },
    stable: { icon: "mdi:minus", color: "text-gray-400" },
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metricStats.map((s) => (
        <div
          key={s.metric}
          className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-gray-500 uppercase truncate dark:text-gray-400">
              {s.metric.replace(/_/g, " ")}
            </p>
            <Icon
              icon={trendConfig[s.trend].icon}
              className={`w-4 h-4 ${trendConfig[s.trend].color}`}
            />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatValue(s.latest)}
          </p>
          <div className="grid grid-cols-3 gap-2 pt-3 mt-3 border-t border-gray-100 dark:border-gray-700">
            <div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase">
                Min
              </p>
              <p className="font-mono text-xs font-medium text-gray-700 dark:text-gray-300">
                {formatValue(s.min)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase">
                Avg
              </p>
              <p className="font-mono text-xs font-medium text-gray-700 dark:text-gray-300">
                {formatValue(s.avg)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase">
                Max
              </p>
              <p className="font-mono text-xs font-medium text-gray-700 dark:text-gray-300">
                {formatValue(s.max)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimeSeriesStatsCards;
