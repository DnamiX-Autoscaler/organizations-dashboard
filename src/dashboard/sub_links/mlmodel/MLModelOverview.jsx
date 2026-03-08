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

            {/* Metric strip — compact inline stats */}
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-px bg-gray-100 dark:bg-gray-700/50 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700/50">
                {[
                    { label: "Accuracy", value: `${modelMetrics.accuracy.toFixed(1)}%` },
                    { label: "MAE", value: modelMetrics.mae.toFixed(2) },
                    { label: "Current (T)", value: currentPods },
                    { label: "Predicted (T+5)", value: predictedPods },
                    { label: "Scaling", value: scalingStatus },
                    { label: "Within ±1", value: `${modelMetrics.accuracyWithin1.toFixed(1)}%` },
                ].map((stat, i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-darkBackground px-4 py-3 flex flex-col"
                    >
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">{stat.label}</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5 tabular-nums">{stat.value}</span>
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
