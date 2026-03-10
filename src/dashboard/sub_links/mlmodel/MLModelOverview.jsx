import React from "react";
import { Icon } from "@iconify/react";
import PodCountChart from "../../../components/mlmodel/PodCountChart";
import ProvisioningEfficiency from "../../../components/mlmodel/ProvisioningEfficiency";
import ModelInfoPanel from "../../../components/mlmodel/ModelInfoPanel";
import useMLModel from "../../../services/useMLModel";

const MLModelOverview = () => {
    const {
        isApiHealthy, isSimulating, apiLatency, modelHealth,
        currentPods, predictedPods, scalingStatus,
        podData, efficiencyData, modelMetrics, spikeActive,
    } = useMLModel();

    return (
        <div className="space-y-5">
            {/* Compact page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                        Predictive Autoscaling
                    </h1>
                    <p className="text-xs text-gray-400 mt-0.5">Real-time pod demand forecasting</p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Status pill */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border ${isApiHealthy
                            ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/20"
                            : "bg-amber-500/5 text-amber-600 border-amber-500/15 dark:text-amber-400 dark:border-amber-500/20"
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isApiHealthy ? "bg-emerald-500" : "bg-amber-500"} ${isSimulating ? "animate-pulse" : ""}`} />
                        {isApiHealthy ? "Online" : "Offline"}
                        {isApiHealthy && apiLatency > 0 && (
                            <span className="text-gray-400 font-normal">{apiLatency}ms</span>
                        )}
                    </div>
                    {isSimulating && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border" style={{ backgroundColor: 'rgba(132,0,106,0.04)', borderColor: 'rgba(132,0,106,0.12)', color: '#84006A' }}>
                            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#84006A' }} />
                            Live
                        </div>
                    )}
                </div>
            </div>

            {/* Traffic event bar — minimal */}
            {spikeActive && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs border border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span className="font-medium">Traffic event active</span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-500 dark:text-gray-400">
                        {spikeActive.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                </div>
            )}

            {/* Metric strip */}
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                    {
                        label: "Accuracy",
                        value: `${modelMetrics.accuracy.toFixed(1)}%`,
                        icon: "mdi:bullseye-arrow",
                        color: "text-emerald-500",
                        bg: "bg-emerald-50 dark:bg-emerald-900/20",
                        iconBg: "bg-emerald-100 dark:bg-emerald-800/40",
                        border: "border-emerald-100 dark:border-emerald-700/30",
                    },
                    {
                        label: "MAE",
                        value: modelMetrics.mae.toFixed(2),
                        icon: "mdi:chart-bell-curve",
                        color: "text-blue-500",
                        bg: "bg-blue-50 dark:bg-blue-900/20",
                        iconBg: "bg-blue-100 dark:bg-blue-800/40",
                        border: "border-blue-100 dark:border-blue-700/30",
                    },
                    {
                        label: "Current (T)",
                        value: currentPods,
                        icon: "mdi:kubernetes",
                        color: "text-violet-500",
                        bg: "bg-violet-50 dark:bg-violet-900/20",
                        iconBg: "bg-violet-100 dark:bg-violet-800/40",
                        border: "border-violet-100 dark:border-violet-700/30",
                    },
                    {
                        label: "Predicted (T+5)",
                        value: predictedPods,
                        icon: "mdi:crystal-ball",
                        color: "text-indigo-500",
                        bg: "bg-indigo-50 dark:bg-indigo-900/20",
                        iconBg: "bg-indigo-100 dark:bg-indigo-800/40",
                        border: "border-indigo-100 dark:border-indigo-700/30",
                    },
                    {
                        label: "Scaling",
                        value: scalingStatus,
                        icon: scalingStatus === "Scale Up"
                            ? "mdi:arrow-up-bold"
                            : scalingStatus === "Scale Down"
                            ? "mdi:arrow-down-bold"
                            : "mdi:check-circle-outline",
                        color: scalingStatus === "Scale Up"
                            ? "text-amber-500"
                            : scalingStatus === "Scale Down"
                            ? "text-sky-500"
                            : "text-teal-500",
                        bg: scalingStatus === "Scale Up"
                            ? "bg-amber-50 dark:bg-amber-900/20"
                            : scalingStatus === "Scale Down"
                            ? "bg-sky-50 dark:bg-sky-900/20"
                            : "bg-teal-50 dark:bg-teal-900/20",
                        iconBg: scalingStatus === "Scale Up"
                            ? "bg-amber-100 dark:bg-amber-800/40"
                            : scalingStatus === "Scale Down"
                            ? "bg-sky-100 dark:bg-sky-800/40"
                            : "bg-teal-100 dark:bg-teal-800/40",
                        border: scalingStatus === "Scale Up"
                            ? "border-amber-100 dark:border-amber-700/30"
                            : scalingStatus === "Scale Down"
                            ? "border-sky-100 dark:border-sky-700/30"
                            : "border-teal-100 dark:border-teal-700/30",
                    },
                    {
                        label: "Within ±1",
                        value: `${modelMetrics.accuracyWithin1.toFixed(1)}%`,
                        icon: "mdi:gauge-full",
                        color: "text-rose-500",
                        bg: "bg-rose-50 dark:bg-rose-900/20",
                        iconBg: "bg-rose-100 dark:bg-rose-800/40",
                        border: "border-rose-100 dark:border-rose-700/30",
                    },
                ].map((stat, i) => (
                    <div
                        key={i}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border ${stat.bg} ${stat.border}`}
                    >
                        <div className={`p-2 rounded-lg flex-shrink-0 ${stat.iconBg}`}>
                            <Icon icon={stat.icon} className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-medium leading-none mb-1">
                                {stat.label}
                            </p>
                            <p className={`text-base font-bold tabular-nums leading-none ${stat.color}`}>
                                {stat.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pod chart + efficiency */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                    <PodCountChart data={podData} />
                </div>
                <div className="lg:col-span-1">
                    <ProvisioningEfficiency data={efficiencyData} />
                </div>
            </div>

            {/* Model info */}
            <ModelInfoPanel
                modelHealth={modelHealth}
                apiLatency={apiLatency}
                isApiHealthy={isApiHealthy}
            />
        </div>
    );
};

export default MLModelOverview;
