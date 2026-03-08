import React from "react";
import { Icon } from "@iconify/react";

const MetricItem = ({
  icon,
  label,
  value,
  color = "text-gray-700 dark:text-gray-200",
}) => (
  <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
      <Icon icon={icon} className="w-3.5 h-3.5 shrink-0" />
      <span>{label}</span>
    </div>
    <span
      className={`text-xs font-semibold ${color} text-right max-w-[55%] truncate`}
    >
      {value ?? "-"}
    </span>
  </div>
);

const UsageBar = ({ value, color }) => {
  const pct = Math.min(100, Math.max(0, parseFloat(value) || 0));
  const barColor =
    pct >= 85 ? "bg-red-500" : pct >= 65 ? "bg-yellow-400" : color;
  return (
    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
      <div
        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

const NodeLevelCard = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-gray-400 dark:text-gray-500">
        <Icon icon="mdi:server-off" className="w-6 h-6 mr-2" />
        No node-level data available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {data.map((item, idx) => {
        const services = Array.isArray(item.services)
          ? item.services.join(", ")
          : (item.services ?? "-");
        const timestamp = item.timestamp
          ? new Date(item.timestamp).toLocaleString()
          : "-";

        const cpu = parseFloat(item.node_cpu_usage_percent) || 0;
        const mem = parseFloat(item.node_memory_usage_percent) || 0;

        return (
          <div
            key={idx}
            className="flex flex-col overflow-hidden transition-shadow duration-200 bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-darkBackground dark:border-gray-700 hover:shadow-md"
          >
            {/* Card Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-gray-700">
              <div className="flex items-center justify-center bg-blue-100 rounded-lg w-9 h-9 dark:bg-blue-900/40 shrink-0">
                <Icon
                  icon="mdi:server"
                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate dark:text-white">
                  {item.node_name ?? "-"}
                </p>
                <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                  {item.namespace ?? "-"}
                </p>
              </div>
            </div>

            {/* Card Body */}
            <div className="flex flex-col gap-3 p-4">
              {/* CPU */}
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <Icon
                      icon="mdi:cpu-64-bit"
                      className="w-3.5 h-3.5 text-blue-500"
                    />
                    CPU Usage
                  </span>
                  <span
                    className={`text-xs font-bold ${cpu >= 85 ? "text-red-500" : cpu >= 65 ? "text-yellow-500" : "text-blue-600 dark:text-blue-400"}`}
                  >
                    {cpu.toFixed(1)}%
                  </span>
                </div>
                <UsageBar value={cpu} color="bg-blue-500" />
              </div>

              {/* Memory */}
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <Icon
                      icon="mdi:memory"
                      className="w-3.5 h-3.5 text-emerald-500"
                    />
                    Memory Usage
                  </span>
                  <span
                    className={`text-xs font-bold ${mem >= 85 ? "text-red-500" : mem >= 65 ? "text-yellow-500" : "text-emerald-600 dark:text-emerald-400"}`}
                  >
                    {mem.toFixed(1)}% &nbsp;
                    <span className="font-normal text-gray-400">
                      ({item.node_memory_usage_mb ?? "-"} MB)
                    </span>
                  </span>
                </div>
                <UsageBar value={mem} color="bg-emerald-500" />
              </div>

              {/* Network */}
              <div className="pt-1">
                <p className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  <Icon
                    icon="mdi:lan"
                    className="w-3.5 h-3.5 text-violet-500"
                  />
                  Network
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col items-center justify-center py-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/20">
                    <Icon
                      icon="mdi:arrow-down-circle-outline"
                      className="w-4 h-4 text-violet-500 mb-0.5"
                    />
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {item.node_network_rx_kbps ?? "-"}
                    </span>
                    <span className="text-[10px] text-gray-400">RX Kbps</span>
                  </div>
                  <div className="flex flex-col items-center justify-center py-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/20">
                    <Icon
                      icon="mdi:arrow-up-circle-outline"
                      className="w-4 h-4 text-violet-500 mb-0.5"
                    />
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {item.node_network_tx_kbps ?? "-"}
                    </span>
                    <span className="text-[10px] text-gray-400">TX Kbps</span>
                  </div>
                </div>
              </div>

              {/* Disk */}
              <div>
                <p className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  <Icon
                    icon="mdi:harddisk"
                    className="w-3.5 h-3.5 text-amber-500"
                  />
                  Disk IOPS
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col items-center justify-center py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                    <Icon
                      icon="mdi:database-import"
                      className="w-4 h-4 text-amber-500 mb-0.5"
                    />
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {item.node_disk_read_iops ?? "-"}
                    </span>
                    <span className="text-[10px] text-gray-400">Read</span>
                  </div>
                  <div className="flex flex-col items-center justify-center py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                    <Icon
                      icon="mdi:database-export"
                      className="w-4 h-4 text-amber-500 mb-0.5"
                    />
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {item.node_disk_write_iops ?? "-"}
                    </span>
                    <span className="text-[10px] text-gray-400">Write</span>
                  </div>
                </div>
              </div>

              {/* Info row */}
              <div className="pt-1 border-t border-gray-100 dark:border-gray-700 space-y-0.5">
                <MetricItem
                  icon="mdi:cube-outline"
                  label="Services"
                  value={services}
                />
                <MetricItem
                  icon="mdi:clock-outline"
                  label="Timestamp"
                  value={timestamp}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NodeLevelCard;
