import React from "react";
import { Icon } from "@iconify/react";

const RateBar = ({ value, max = 100, color }) => {
  const pct = Math.min(100, Math.max(0, (parseFloat(value) / max) * 100));
  const barColor =
    color === "success"
      ? pct < 80
        ? "bg-red-500"
        : pct < 95
          ? "bg-yellow-400"
          : "bg-emerald-500"
      : pct >= 5
        ? "bg-red-500"
        : pct >= 1
          ? "bg-yellow-400"
          : "bg-blue-400";
  return (
    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
      <div
        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

const StatBox = ({ icon, iconColor, label, value, unit }) => (
  <div className="flex flex-col items-center justify-center py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
    <Icon icon={icon} className={`w-4 h-4 mb-0.5 ${iconColor}`} />
    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
      {value ?? "-"}
      {unit ? (
        <span className="font-normal text-gray-400 text-[10px]"> {unit}</span>
      ) : null}
    </span>
    <span className="text-[10px] text-gray-400 text-center leading-tight">
      {label}
    </span>
  </div>
);

const AppLevelCard = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-gray-400 dark:text-gray-500">
        <Icon icon="mdi:application-off" className="w-6 h-6 mr-2" />
        No application-level data available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {data.map((item, idx) => {
        const timestamp = item.timestamp
          ? new Date(item.timestamp).toLocaleString()
          : "-";

        const successRate = parseFloat(item.success_rate_percent) || 0;
        const errorRate = parseFloat(item.error_rate_percent) || 0;
        const saturation = parseFloat(item.application_saturation_percent) || 0;

        const hasErrors =
          errorRate > 0 || parseFloat(item.http_5xx_rate_percent) > 0;

        return (
          <div
            key={idx}
            className="flex flex-col overflow-hidden transition-shadow duration-200 bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-darkBackground dark:border-gray-700 hover:shadow-md"
          >
            {/* Card Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 dark:border-gray-700">
              <div className="flex items-center justify-center bg-indigo-100 rounded-lg w-9 h-9 dark:bg-indigo-900/40 shrink-0">
                <Icon
                  icon="mdi:application"
                  className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate dark:text-white">
                  {item.service_name ?? "-"}
                </p>
                <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                  {item.namespace ?? "-"}
                </p>
              </div>
              {hasErrors && (
                <span title="Errors detected">
                  <Icon
                    icon="mdi:alert-circle"
                    className="w-5 h-5 text-red-500 shrink-0"
                  />
                </span>
              )}
            </div>

            {/* Card Body */}
            <div className="flex flex-col gap-3 p-4">
              {/* Request Rate */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <Icon
                    icon="mdi:transfer"
                    className="w-3.5 h-3.5 text-blue-500"
                  />
                  Request Rate
                </span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {parseFloat(item.request_rate_rps || 0).toFixed(2)} RPS
                </span>
              </div>

              {/* Success Rate */}
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <Icon
                      icon="mdi:check-circle-outline"
                      className="w-3.5 h-3.5 text-emerald-500"
                    />
                    Success Rate
                  </span>
                  <span
                    className={`text-xs font-bold ${successRate >= 95 ? "text-emerald-600 dark:text-emerald-400" : successRate >= 80 ? "text-yellow-500" : "text-red-500"}`}
                  >
                    {successRate.toFixed(1)}%
                  </span>
                </div>
                <RateBar value={successRate} max={100} color="success" />
              </div>

              {/* Error Rates */}
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <Icon
                      icon="mdi:alert-circle-outline"
                      className="w-3.5 h-3.5 text-red-400"
                    />
                    Error Rate
                  </span>
                  <span
                    className={`text-xs font-bold ${errorRate > 1 ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}
                  >
                    {errorRate.toFixed(2)}%
                    <span className="ml-2 font-normal text-gray-400">
                      4xx{" "}
                      {parseFloat(item.http_4xx_rate_percent || 0).toFixed(2)}%
                      &nbsp;5xx{" "}
                      {parseFloat(item.http_5xx_rate_percent || 0).toFixed(2)}%
                    </span>
                  </span>
                </div>
                <RateBar value={errorRate} max={10} color="error" />
              </div>

              {/* Latency */}
              <div>
                <p className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  <Icon
                    icon="mdi:timer-outline"
                    className="w-3.5 h-3.5 text-amber-500"
                  />
                  Latency
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <StatBox
                    icon="mdi:timer-sand"
                    iconColor="text-amber-400"
                    label="P50"
                    value={parseFloat(item.latency_p50_ms || 0).toFixed(1)}
                    unit="ms"
                  />
                  <StatBox
                    icon="mdi:timer-sand"
                    iconColor="text-orange-400"
                    label="P95"
                    value={parseFloat(item.latency_p95_ms || 0).toFixed(1)}
                    unit="ms"
                  />
                  <StatBox
                    icon="mdi:timer-sand"
                    iconColor="text-red-400"
                    label="P99"
                    value={parseFloat(item.latency_p99_ms || 0).toFixed(1)}
                    unit="ms"
                  />
                </div>
              </div>

              {/* Queue & Saturation */}
              <div className="grid grid-cols-2 gap-2">
                <StatBox
                  icon="mdi:playlist-play"
                  iconColor="text-violet-400"
                  label="Queue Length"
                  value={parseFloat(item.queue_length || 0).toFixed(0)}
                />
                <StatBox
                  icon="mdi:gauge"
                  iconColor={
                    saturation >= 80 ? "text-red-500" : "text-teal-400"
                  }
                  label="Saturation"
                  value={saturation.toFixed(1)}
                  unit="%"
                />
              </div>

              {/* Footer */}
              <div className="pt-1 border-t border-gray-100 dark:border-gray-700">
                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                  <Icon icon="mdi:clock-outline" className="w-3.5 h-3.5" />
                  {timestamp}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AppLevelCard;
