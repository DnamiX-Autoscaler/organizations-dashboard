import React from "react";
import { Icon } from "@iconify/react";
import TitleHeader from "../../../components/common/TitleHeader";
import PodCountChart from "../../../components/mlmodel/PodCountChart";
import ProvisioningEfficiency from "../../../components/mlmodel/ProvisioningEfficiency";
import ModelInfoPanel from "../../../components/mlmodel/ModelInfoPanel";
import TrafficSpikePanel from "../../../components/mlmodel/TrafficSpikePanel";
import PredictionAccuracyChart from "../../../components/mlmodel/PredictionAccuracyChart";
import useMLModel from "../../../services/useMLModel";

const MLModelOverview = () => {
    const {
        isApiHealthy, isSimulating, apiLatency, modelHealth,
        currentPods, predictedPods, scalingStatus,
        podData, efficiencyData, modelMetrics, spikeActive,
    } = useMLModel();

    const kpis = [
        {
            label: "Accuracy",
            value: `${modelMetrics.accuracy.toFixed(1)}%`,
            icon: "mdi:check-decagram",
            color: "text-emerald-500",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
        },
        {
            label: "MAE",
            value: modelMetrics.mae.toFixed(2),
            icon: "mdi:chart-line-variant",
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-900/20",
        },
        {
            label: "Current Pods (T)",
            value: currentPods,
            icon: "mdi:cube-outline",
            color: "text-indigo-500",
            bg: "bg-indigo-50 dark:bg-indigo-900/20",
        },
        {
            label: "Predicted (T+5m)",
            value: predictedPods,
            icon: "mdi:crystal-ball",
            color: "text-violet-500",
            bg: "bg-violet-50 dark:bg-violet-900/20",
        },
        {
            label: "Scaling Action",
            value: scalingStatus,
            icon:
                scalingStatus === "Scaling UP"
                    ? "mdi:arrow-up-bold"
                    : scalingStatus === "Scaling DOWN"
                    ? "mdi:arrow-down-bold"
                    : "mdi:minus",
            color: scalingStatus === "Stable" ? "text-teal-500" : "text-orange-500",
            bg:
                scalingStatus === "Stable"
                    ? "bg-teal-50 dark:bg-teal-900/20"
                    : "bg-orange-50 dark:bg-orange-900/20",
        },
        {
            label: "Accuracy (±1 pod)",
            value: `${modelMetrics.accuracyWithin1.toFixed(1)}%`,
            icon: "mdi:target",
            color: "text-amber-500",
            bg: "bg-amber-50 dark:bg-amber-900/20",
        },
    ];

    return (
        <div className="space-y-6">
            <TitleHeader
                title="Predictive Autoscaling"
                subtitle="Real-time inference · Pod demand forecasting · Autonomous scaling decisions"
            />

            {/* Active traffic event banner */}
            {spikeActive && (
                <div className="px-4 py-3 text-sm font-medium rounded-xl flex items-center gap-3 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-800 border border-orange-200 dark:from-orange-900/30 dark:to-amber-900/20 dark:text-orange-300 dark:border-orange-700/50">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                    <Icon icon="mdi:lightning-bolt" className="w-4 h-4 text-orange-500" />
                    <span className="font-semibold tracking-wide">Traffic Event Detected</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-800/40 font-medium">
                        {spikeActive.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                    <span className="ml-auto text-xs opacity-60">Inference engine responding · Scaling decision in progress</span>
                </div>
            )}

            {/* Connection banner */}
            <div
                className={`px-4 py-3 text-sm font-medium rounded-xl flex justify-between items-center ${
                    isApiHealthy
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200 dark:from-green-900/20 dark:to-emerald-900/20 dark:text-green-300 dark:border-green-800"
                        : "bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-800 border border-yellow-200 dark:from-yellow-900/20 dark:to-amber-900/20 dark:text-yellow-300 dark:border-yellow-800"
                }`}
            >
                <div className="flex items-center gap-3">
                    <div
                        className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                            isApiHealthy ? "bg-green-500" : "bg-yellow-500"
                        }`}
                    />
                    <Icon
                        icon={isApiHealthy ? "mdi:server-network" : "mdi:server-network-off"}
                        className="w-5 h-5"
                    />
                    <span className="font-semibold">
                        {isApiHealthy ? "Inference Engine Online" : "Inference Engine Offline"}
                    </span>
                    {isApiHealthy && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-800/30">
                            API: {apiLatency}ms
                        </span>
                    )}
                </div>
                {isSimulating && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-800/30 dark:text-emerald-300">
                        ● Live
                    </span>
                )}
            </div>

            {/* KPI grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {kpis.map((stat, i) => (
                    <div
                        key={i}
                        className="p-4 bg-white border border-gray-100 rounded-xl dark:bg-darkBackground dark:border-gray-700/50 flex items-center gap-3 shadow-sm"
                    >
                        <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                            <Icon icon={stat.icon} className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pod chart + efficiency */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <PodCountChart data={podData} />
                </div>
                <div className="lg:col-span-1">
                    <ProvisioningEfficiency data={efficiencyData} />
                </div>
            </div>

            {/* Accuracy chart — predicted vs actual at same T+5 moment */}
            <PredictionAccuracyChart />

            {/* Model info */}
            <ModelInfoPanel
                modelHealth={modelHealth}
                apiLatency={apiLatency}
                isApiHealthy={isApiHealthy}
            />

            {/* Traffic scenario simulator */}
            <TrafficSpikePanel />
        </div>
    );
};

export default MLModelOverview;
