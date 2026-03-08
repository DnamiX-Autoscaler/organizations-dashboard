import React from "react";
import { Icon } from "@iconify/react";

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

const StatBox = ({ icon, iconColor, label, value, unit }) => (
    <div className="flex flex-col items-center justify-center py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
        <Icon icon={icon} className={`w-4 h-4 mb-0.5 ${iconColor}`} />
        <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
            {value ?? "-"}{unit ? <span className="font-normal text-gray-400 text-[10px]"> {unit}</span> : null}
        </span>
        <span className="text-[10px] text-gray-400 text-center leading-tight">{label}</span>
    </div>
);

const PodLevelCard = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-40 text-sm text-gray-400 dark:text-gray-500">
                <Icon icon="mdi:cube-off-outline" className="w-6 h-6 mr-2" />
                No pod-level data available
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.map((item, idx) => {
                const timestamp = item.timestamp
                    ? new Date(item.timestamp).toLocaleString()
                    : "-";
                const cpuAvg = parseFloat(item.pod_cpu_usage_percent_avg) || 0;
                const memAvg = parseFloat(item.pod_memory_usage_mb_avg) || 0;
                const cpuLimit = parseFloat(item.pod_cpu_limit_percent) || 0;
                const memLimit = parseFloat(item.pod_memory_limit_percent) || 0;

                const restartWarning = item.pod_restart_count > 50;

                return (
                    <div
                        key={idx}
                        className="flex flex-col overflow-hidden bg-white border border-gray-200 rounded-xl dark:bg-darkBackground dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                        {/* Card Header */}
                        <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-center w-9 h-9 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg shrink-0">
                                <Icon icon="mdi:cube-outline" className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                    {item.service_name ?? "-"}
                                </p>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {item.namespace ?? "-"}
                                    </p>
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 shrink-0">
                                        <Icon icon="mdi:layers-triple" className="w-3 h-3" />
                                        {item.current_pod_count ?? 0} pods
                                    </span>
                                </div>
                            </div>
                            {restartWarning && (
                                <span title="High restart count" className="shrink-0">
                                    <Icon icon="mdi:alert-circle" className="w-5 h-5 text-red-500" />
                                </span>
                            )}
                        </div>

                        {/* Card Body */}
                        <div className="flex flex-col gap-3 p-4">

                            {/* CPU */}
                            <div>
                                <div className="flex items-center justify-between mb-0.5">
                                    <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                        <Icon icon="mdi:cpu-64-bit" className="w-3.5 h-3.5 text-blue-500" />
                                        CPU Usage
                                    </span>
                                    <span className={`text-xs font-bold ${cpuAvg >= 85 ? "text-red-500" : cpuAvg >= 65 ? "text-yellow-500" : "text-blue-600 dark:text-blue-400"}`}>
                                        avg {cpuAvg.toFixed(2)}%
                                        <span className="font-normal text-gray-400 ml-1">
                                            p95 {parseFloat(item.pod_cpu_usage_percent_p95 || 0).toFixed(2)}%
                                        </span>
                                    </span>
                                </div>
                                <UsageBar value={cpuAvg} color="bg-blue-500" />
                            </div>

                            {/* Memory */}
                            <div>
                                <div className="flex items-center justify-between mb-0.5">
                                    <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                        <Icon icon="mdi:memory" className="w-3.5 h-3.5 text-violet-500" />
                                        Memory Usage
                                    </span>
                                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
                                        avg {memAvg.toFixed(1)} MB
                                        <span className="font-normal text-gray-400 ml-1">
                                            p95 {parseFloat(item.pod_memory_usage_mb_p95 || 0).toFixed(1)} MB
                                        </span>
                                    </span>
                                </div>
                                <UsageBar value={(memAvg / (memLimit || 1024)) * 100} color="bg-violet-500" />
                            </div>

                            {/* Limits & Restarts */}
                            <div className="grid grid-cols-3 gap-2 pt-1">
                                <StatBox
                                    icon="mdi:cpu-64-bit"
                                    iconColor="text-blue-400"
                                    label="CPU Limit"
                                    value={cpuLimit.toFixed(1)}
                                    unit="%"
                                />
                                <StatBox
                                    icon="mdi:memory"
                                    iconColor="text-violet-400"
                                    label="Mem Limit"
                                    value={memLimit.toFixed(1)}
                                    unit="MB"
                                />
                                <StatBox
                                    icon="mdi:restart"
                                    iconColor={restartWarning ? "text-red-500" : "text-amber-400"}
                                    label="Restarts"
                                    value={item.pod_restart_count ?? 0}
                                />
                            </div>

                            {/* Footer */}
                            <div className="pt-1 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-2">
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

export default PodLevelCard;
