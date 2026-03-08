import React, { useState } from "react";
import { Icon } from "@iconify/react";

const LEVEL_CONFIG = {
    critical: {
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-900/10",
        border: "border-red-200 dark:border-red-800/40",
        icon: "mdi:alert-circle",
        badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
        dot: "bg-red-500",
    },
    warning: {
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-900/10",
        border: "border-amber-200 dark:border-amber-800/40",
        icon: "mdi:alert",
        badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
        dot: "bg-amber-500",
    },
    info: {
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-900/10",
        border: "border-blue-200 dark:border-blue-800/40",
        icon: "mdi:information-outline",
        badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
        dot: "bg-blue-500",
    },
    success: {
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-900/10",
        border: "border-emerald-200 dark:border-emerald-800/40",
        icon: "mdi:check-circle",
        badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
        dot: "bg-emerald-500",
    },
};

const AlertsPanel = ({ alerts = [] }) => {
    const [filter, setFilter] = useState("all");
    const [expanded, setExpanded] = useState(null);

    const counts = {
        critical: alerts.filter((a) => a.level === "critical").length,
        warning: alerts.filter((a) => a.level === "warning").length,
        info: alerts.filter((a) => a.level === "info").length,
        success: alerts.filter((a) => a.level === "success").length,
    };

    const filtered =
        filter === "all"
            ? [...alerts].reverse().slice(0, 12)
            : [...alerts]
                  .filter((a) => a.level === filter)
                  .reverse()
                  .slice(0, 12);

    const filterTabs = [
        { key: "all", label: "All", count: alerts.length },
        { key: "critical", label: "Critical", count: counts.critical, color: "text-red-500" },
        { key: "warning", label: "Warning", count: counts.warning, color: "text-amber-500" },
        { key: "info", label: "Info", count: counts.info, color: "text-blue-500" },
    ];

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-xl dark:bg-darkBackground dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                        <Icon
                            icon="mdi:bell-badge-outline"
                            className="w-5 h-5 text-amber-500"
                        />
                        Alerts & Anomalies
                        {alerts.length > 0 && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        )}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Real-time model & scaling anomaly detection
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {counts.critical > 0 && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-semibold">
                            {counts.critical} critical
                        </span>
                    )}
                    {counts.warning > 0 && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-semibold">
                            {counts.warning} warnings
                        </span>
                    )}
                    {alerts.length === 0 && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            All Clear
                        </span>
                    )}
                </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1.5 mb-4">
                {filterTabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                            filter === tab.key
                                ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                    >
                        {tab.label}
                        <span
                            className={`${
                                filter === tab.key
                                    ? "bg-white/20 text-white dark:bg-black/20 dark:text-gray-800"
                                    : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                            } text-xs px-1.5 rounded-full`}
                        >
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <Icon
                        icon="mdi:shield-check-outline"
                        className="w-10 h-10 mb-2 text-emerald-400 opacity-60"
                    />
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                        No alerts detected
                    </p>
                    <p className="text-xs mt-1 text-gray-400">
                        Model operating within normal parameters
                    </p>
                </div>
            ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {filtered.map((alert, idx) => {
                        const cfg =
                            LEVEL_CONFIG[alert.level] ||
                            LEVEL_CONFIG.info;
                        const isExpanded = expanded === idx;

                        return (
                            <div
                                key={idx}
                                className={`rounded-xl border cursor-pointer transition-all ${cfg.bg} ${cfg.border} ${
                                    isExpanded ? "shadow-sm" : ""
                                }`}
                                onClick={() =>
                                    setExpanded(isExpanded ? null : idx)
                                }
                            >
                                <div className="flex items-start gap-3 p-3">
                                    <div
                                        className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${cfg.dot}`}
                                    />
                                    <Icon
                                        icon={cfg.icon}
                                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.color}`}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <span
                                                className={`text-sm font-medium ${cfg.color} leading-snug`}
                                            >
                                                {alert.message}
                                            </span>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <span
                                                    className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${cfg.badge}`}
                                                >
                                                    {alert.level.toUpperCase()}
                                                </span>
                                                <Icon
                                                    icon={
                                                        isExpanded
                                                            ? "mdi:chevron-up"
                                                            : "mdi:chevron-down"
                                                    }
                                                    className="w-3.5 h-3.5 text-gray-400"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                            {alert.time}
                                        </p>
                                    </div>
                                </div>
                                {isExpanded && alert.detail && (
                                    <div className="px-3 pb-3 pt-0 pl-8">
                                        <div className="p-2.5 rounded-lg bg-white/60 dark:bg-gray-900/40 border border-white/80 dark:border-gray-700/30">
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {alert.detail}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Summary footer */}
            {alerts.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                    <span>
                        {alerts.length} total events this session
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        {counts.critical} critical &nbsp;
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {counts.warning} warnings &nbsp;
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {counts.info} info
                    </span>
                </div>
            )}
        </div>
    );
};

export default AlertsPanel;
