import React from "react";
import { Icon } from "@iconify/react";

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

const MiniBar = ({ value, max, color }) => {
  const pct = Math.min(
    100,
    Math.max(0, (parseFloat(value) / (max || 1)) * 100),
  );
  return (
    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

const ServiceMeshCard = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-gray-400 dark:text-gray-500">
        <Icon icon="mdi:vector-link" className="w-6 h-6 mr-2" />
        No service mesh data available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {data.map((item, idx) => {
        const timestamp = item.timestamp
          ? new Date(item.timestamp).toLocaleString()
          : "-";

        const inbound = parseFloat(item.inbound_request_rate_rps) || 0;
        const outbound = parseFloat(item.outbound_request_rate_rps) || 0;
        const latency = parseFloat(item.mesh_latency_p95_ms) || 0;
        const retryRate = parseFloat(item.mesh_retry_rate_rps) || 0;
        const tcpConns = parseInt(item.mesh_tcp_open_connections) || 0;
        const tlsError = parseFloat(item.mesh_tls_error_rate_percent) || 0;

        const hasIssues = tlsError > 0 || retryRate > 5;
        const maxRate = Math.max(inbound, outbound, 1);

        return (
          <div
            key={idx}
            className="flex flex-col overflow-hidden transition-shadow duration-200 bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-darkBackground dark:border-gray-700 hover:shadow-md"
          >
            {/* Card Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 dark:border-gray-700">
              <div className="flex items-center justify-center rounded-lg w-9 h-9 bg-violet-100 dark:bg-violet-900/40 shrink-0">
                <Icon
                  icon="mdi:vector-link"
                  className="w-5 h-5 text-violet-600 dark:text-violet-400"
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
              {hasIssues && (
                <span title="Issues detected">
                  <Icon
                    icon="mdi:alert-circle"
                    className="w-5 h-5 text-red-500 shrink-0"
                  />
                </span>
              )}
            </div>

            {/* Card Body */}
            <div className="flex flex-col gap-3 p-4">
              {/* Inbound */}
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <Icon
                      icon="mdi:arrow-down-circle-outline"
                      className="w-3.5 h-3.5 text-blue-500"
                    />
                    Inbound
                  </span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {inbound.toFixed(2)} RPS
                  </span>
                </div>
                <MiniBar value={inbound} max={maxRate} color="bg-blue-500" />
              </div>

              {/* Outbound */}
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <Icon
                      icon="mdi:arrow-up-circle-outline"
                      className="w-3.5 h-3.5 text-emerald-500"
                    />
                    Outbound
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {outbound.toFixed(2)} RPS
                  </span>
                </div>
                <MiniBar
                  value={outbound}
                  max={maxRate}
                  color="bg-emerald-500"
                />
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <StatBox
                  icon="mdi:timer-outline"
                  iconColor={latency > 100 ? "text-red-500" : "text-amber-400"}
                  label="Latency P95"
                  value={latency.toFixed(1)}
                  unit="ms"
                />
                <StatBox
                  icon="mdi:lan-connect"
                  iconColor="text-violet-400"
                  label="TCP Conns"
                  value={tcpConns}
                />
                <StatBox
                  icon="mdi:refresh"
                  iconColor={retryRate > 5 ? "text-red-500" : "text-blue-400"}
                  label="Retry Rate"
                  value={retryRate.toFixed(2)}
                  unit="RPS"
                />
                <StatBox
                  icon="mdi:shield-alert-outline"
                  iconColor={tlsError > 0 ? "text-red-500" : "text-gray-400"}
                  label="TLS Error"
                  value={tlsError.toFixed(2)}
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

export default ServiceMeshCard;
