import React from "react";
import { Icon } from "@iconify/react";

const ModelMetrics = ({ metrics }) => {
    const {
        mae = 0,
        rmse = 0,
        accuracy = 0,
        accuracyWithin1 = 0,
        totalPredictions = 0,
        underCount = 0,
        exactCount = 0,
        overCount = 0
    } = metrics || {};

    // Determine overall health
    let healthStatus = "Excellent";
    let healthColor = "text-emerald-500";
    let healthBg = "bg-emerald-50 dark:bg-emerald-900/20";
    let healthIcon = "mdi:check-decagram";

    if (mae > 2) {
        healthStatus = "Poor";
        healthColor = "text-red-500";
        healthBg = "bg-red-50 dark:bg-red-900/20";
        healthIcon = "mdi:alert-circle";
    } else if (mae > 1) {
        healthStatus = "Fair";
        healthColor = "text-yellow-500";
        healthBg = "bg-yellow-50 dark:bg-yellow-900/20";
        healthIcon = "mdi:alert";
    } else if (mae > 0.5) {
        healthStatus = "Good";
        healthColor = "text-blue-500";
        healthBg = "bg-blue-50 dark:bg-blue-900/20";
        healthIcon = "mdi:check-circle";
    }

    const metricCards = [
        {
            label: "MAE",
            sublabel: "Mean Absolute Error",
            value: mae.toFixed(2),
            unit: "pods",
            icon: "mdi:chart-scatter-plot",
            color: "text-violet-500",
            bg: "bg-violet-50 dark:bg-violet-900/20",
            description: "Average prediction deviation"
        },
        {
            label: "RMSE",
            sublabel: "Root Mean Square Error",
            value: rmse.toFixed(2),
            unit: "pods",
            icon: "mdi:chart-bell-curve-cumulative",
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            description: "Penalizes larger errors more"
        },
        {
            label: "Exact Match",
            sublabel: "Perfect Predictions",
            value: accuracy.toFixed(1),
            unit: "%",
            icon: "mdi:target",
            color: "text-emerald-500",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            description: "Predictions matching actual exactly"
        },
        {
            label: "Within ±1",
            sublabel: "Acceptable Range",
            value: accuracyWithin1.toFixed(1),
            unit: "%",
            icon: "mdi:approximately-equal",
            color: "text-teal-500",
            bg: "bg-teal-50 dark:bg-teal-900/20",
            description: "Predictions within 1 pod of actual"
        }
    ];

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-xl dark:bg-darkBackground dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                        <Icon icon="mdi:chart-box-outline" className="w-5 h-5 text-blue-500" />
                        Model Performance Metrics
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Statistical analysis of prediction accuracy
                    </p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${healthBg}`}>
                    <Icon icon={healthIcon} className={`w-5 h-5 ${healthColor}`} />
                    <span className={`text-sm font-semibold ${healthColor}`}>{healthStatus}</span>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {metricCards.map((metric, idx) => (
                    <div
                        key={idx}
                        className={`p-4 rounded-xl ${metric.bg} border border-gray-100 dark:border-gray-700/50 transition-transform hover:scale-105`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Icon icon={metric.icon} className={`w-4 h-4 ${metric.color}`} />
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{metric.label}</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className={`text-2xl font-bold ${metric.color}`}>{metric.value}</span>
                            <span className="text-sm text-gray-400">{metric.unit}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{metric.description}</p>
                    </div>
                ))}
            </div>

            {/* Summary Stats */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <span className="text-2xl font-bold text-gray-700 dark:text-gray-200">{totalPredictions}</span>
                        <p className="text-xs text-gray-500">Total Predictions</p>
                    </div>
                    <div className="h-10 w-px bg-gray-200 dark:bg-gray-700" />
                    <div className="flex gap-4">
                        <div className="text-center">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                <span className="text-lg font-semibold text-red-600 dark:text-red-400">{underCount}</span>
                            </div>
                            <p className="text-xs text-gray-500">Under</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">{exactCount}</span>
                            </div>
                            <p className="text-xs text-gray-500">Exact</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                                <span className="text-lg font-semibold text-amber-600 dark:text-amber-400">{overCount}</span>
                            </div>
                            <p className="text-xs text-gray-500">Over</p>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Model Status</p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">BiLSTM Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelMetrics;
