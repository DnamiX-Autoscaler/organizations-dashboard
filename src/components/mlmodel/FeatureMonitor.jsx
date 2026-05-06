import React, { useMemo, useState } from "react";
import { Icon } from "@iconify/react";

const FEATURE_META = [
    { key: "request_rate_rps",          label: "Request Rate",     unit: "rps",  icon: "mdi:speedometer",               color: "text-blue-500",    group: "traffic" },
    { key: "latency_p95_ms",            label: "Latency P95",      unit: "ms",   icon: "mdi:timer-outline",              color: "text-violet-500",  group: "traffic" },
    { key: "latency_p99_ms",            label: "Latency P99",      unit: "ms",   icon: "mdi:timer-alert-outline",        color: "text-purple-500",  group: "traffic" },
    { key: "error_rate_percent",        label: "Error Rate",       unit: "%",    icon: "mdi:alert-circle-outline",       color: "text-red-500",     group: "traffic" },
    { key: "queue_length",              label: "Queue Length",     unit: "",     icon: "mdi:queue-first-in-last-out",    color: "text-orange-500",  group: "traffic" },
    { key: "pod_cpu_usage_percent_avg", label: "CPU Avg",          unit: "%",    icon: "mdi:cpu-64-bit",                 color: "text-teal-500",    group: "resources" },
    { key: "pod_cpu_usage_percent_p95", label: "CPU P95",          unit: "%",    icon: "mdi:cpu-64-bit",                 color: "text-cyan-500",    group: "resources" },
    { key: "pod_memory_usage_mb_avg",   label: "Memory Avg",       unit: "MB",   icon: "mdi:memory",                    color: "text-amber-500",   group: "resources" },
    { key: "pod_memory_usage_mb_p95",   label: "Memory P95",       unit: "MB",   icon: "mdi:memory",                    color: "text-yellow-500",  group: "resources" },
    { key: "mesh_inbound_rps",          label: "Mesh Inbound",     unit: "rps",  icon: "mdi:lan-connect",                color: "text-indigo-500",  group: "mesh" },
    { key: "mesh_inbound_latency_p95",  label: "Mesh Latency",     unit: "ms",   icon: "mdi:network-outline",            color: "text-blue-400",    group: "mesh" },
    { key: "mesh_inbound_error_rate",   label: "Mesh Errors",      unit: "%",    icon: "mdi:network-off-outline",        color: "text-rose-500",    group: "mesh" },
    { key: "degree_centrality",         label: "Degree",           unit: "",     icon: "mdi:graph-outline",              color: "text-emerald-500", group: "centrality" },
    { key: "eigenvector_centrality",    label: "Eigenvector",      unit: "",     icon: "mdi:vector-point",               color: "text-green-500",   group: "centrality" },
    { key: "betweenness_centrality",    label: "Betweenness",      unit: "",     icon: "mdi:math-integral",              color: "text-lime-500",    group: "centrality" },
    { key: "closeness_centrality",      label: "Closeness",        unit: "",     icon: "mdi:circle-outline",             color: "text-teal-400",    group: "centrality" },
];

const GROUP_LABELS = {
    traffic:    { label: "Traffic",        icon: "mdi:web", color: "text-blue-500" },
    resources:  { label: "Pod Resources",  icon: "mdi:cube-outline", color: "text-amber-500" },
    mesh:       { label: "Service Mesh",   icon: "mdi:lan", color: "text-indigo-500" },
    centrality: { label: "Graph Centrality", icon: "mdi:graph", color: "text-emerald-500" },
};

const FeatureMonitor = ({ currentFeatures, featureHistory = [] }) => {
    const [activeGroup, setActiveGroup] = useState("all");

    const rollingStats = useMemo(() => {
        const stats = {};
        if (featureHistory.length === 0) return stats;
        FEATURE_META.forEach((f) => {
            const vals = featureHistory
                .map((row) => parseFloat(row[f.key] || 0))
                .filter((v) => !isNaN(v) && isFinite(v));
            if (vals.length > 0) {
                const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
                stats[f.key] = {
                    avg,
                    max: Math.max(...vals),
                    min: Math.min(...vals),
                };
            }
        });
        return stats;
    }, [featureHistory]);

    const groups = ["all", ...Object.keys(GROUP_LABELS)];
    const displayFeatures =
        activeGroup === "all"
            ? FEATURE_META
            : FEATURE_META.filter((f) => f.group === activeGroup);

    const anomalyCount = useMemo(() => {
        if (!currentFeatures) return 0;
        return FEATURE_META.filter((f) => {
            const cur = parseFloat(currentFeatures[f.key] || 0);
            const avg = rollingStats[f.key]?.avg || 0;
            if (avg === 0) return false;
            return Math.abs((cur - avg) / avg) > 0.3;
        }).length;
    }, [currentFeatures, rollingStats]);

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-xl dark:bg-darkBackground dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                        <Icon
                            icon="mdi:view-dashboard-variant-outline"
                            className="w-5 h-5 text-blue-500"
                        />
                        Live Feature Monitor
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Real-time model input features vs. rolling 48-step
                        average
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {anomalyCount > 0 && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800/50">
                            <Icon
                                icon="mdi:pulse"
                                className="w-3.5 h-3.5 text-orange-500"
                            />
                            <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                                {anomalyCount} anomalous
                            </span>
                        </div>
                    )}
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                        {featureHistory.length} samples
                    </span>
                </div>
            </div>

            {/* Group filter tabs */}
            <div className="flex gap-1.5 mb-4 flex-wrap">
                {groups.map((g) => (
                    <button
                        key={g}
                        onClick={() => setActiveGroup(g)}
                        className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                            activeGroup === g
                                ? "bg-blue-500 text-white shadow-sm"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                        }`}
                    >
                        {g === "all" ? (
                            "All Features"
                        ) : (
                            <span className="flex items-center gap-1">
                                <Icon
                                    icon={GROUP_LABELS[g].icon}
                                    className="w-3 h-3"
                                />
                                {GROUP_LABELS[g].label}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {!currentFeatures ? (
                <div className="flex items-center justify-center h-32 text-gray-400">
                    <div className="text-center">
                        <Icon
                            icon="mdi:radar"
                            className="w-10 h-10 mx-auto mb-2 opacity-30 animate-pulse"
                        />
                        <p className="text-sm">Waiting for live feature data...</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {displayFeatures.map((feat) => {
                        const current = parseFloat(
                            currentFeatures[feat.key] || 0
                        );
                        const st = rollingStats[feat.key];
                        const avg = st?.avg || 0;
                        const max = st?.max || current || 1;
                        const min = st?.min || 0;
                        const range = max - min || 1;
                        const normalized = Math.min(
                            100,
                            Math.max(0, ((current - min) / range) * 100)
                        );
                        const deviation =
                            avg > 0 ? ((current - avg) / avg) * 100 : 0;
                        const isHigh = deviation > 30;
                        const isLow = deviation < -30;
                        const isAnomaly = isHigh || isLow;

                        const displayVal =
                            current === 0
                                ? "0"
                                : current > 100
                                ? current.toFixed(1)
                                : current > 1
                                ? current.toFixed(2)
                                : current.toFixed(4);

                        const avgDisplay =
                            avg > 100
                                ? avg.toFixed(1)
                                : avg > 1
                                ? avg.toFixed(2)
                                : avg.toFixed(4);

                        return (
                            <div
                                key={feat.key}
                                className={`p-3 rounded-xl border transition-all ${
                                    isAnomaly
                                        ? isHigh
                                            ? "bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800/50"
                                            : "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/50"
                                        : "bg-gray-50 dark:bg-gray-800/50 border-transparent"
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <Icon
                                            icon={feat.icon}
                                            className={`w-3.5 h-3.5 flex-shrink-0 ${feat.color}`}
                                        />
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">
                                            {feat.label}
                                        </span>
                                    </div>
                                    {isAnomaly && (
                                        <Icon
                                            icon={
                                                isHigh
                                                    ? "mdi:trending-up"
                                                    : "mdi:trending-down"
                                            }
                                            className={`w-3.5 h-3.5 flex-shrink-0 ${
                                                isHigh
                                                    ? "text-orange-500"
                                                    : "text-blue-500"
                                            }`}
                                        />
                                    )}
                                </div>

                                <div className="flex items-baseline gap-1 mb-1.5">
                                    <span
                                        className={`text-base font-bold ${feat.color}`}
                                    >
                                        {displayVal}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {feat.unit}
                                    </span>
                                </div>

                                {/* Progress bar in range context */}
                                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-1.5">
                                    <div
                                        className={`h-full rounded-full transition-all duration-300 ${
                                            isHigh
                                                ? "bg-orange-400"
                                                : isLow
                                                ? "bg-blue-400"
                                                : "bg-emerald-400"
                                        }`}
                                        style={{ width: `${normalized}%` }}
                                    />
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400">
                                        avg: {avgDisplay}
                                    </span>
                                    <span
                                        className={`text-xs font-semibold ${
                                            isHigh
                                                ? "text-orange-500"
                                                : isLow
                                                ? "text-blue-500"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        {deviation > 0 ? "+" : ""}
                                        {deviation.toFixed(0)}%
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default FeatureMonitor;
