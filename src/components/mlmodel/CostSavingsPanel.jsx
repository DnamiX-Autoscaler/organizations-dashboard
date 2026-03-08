import React, { useMemo } from "react";
import { Icon } from "@iconify/react";

/**
 * CostSavingsPanel
 * Estimates infrastructure cost savings compared to naive static over-provisioning.
 * Uses a baseline of: naive strategy always keeps maxPods+2 running.
 * ML strategy matches actual needs within ±1 pod most of the time.
 */
const CostSavingsPanel = ({ modelMetrics }) => {
    const {
        totalPredictions = 0,
        underCount = 0,
        exactCount = 0,
        overCount = 0,
        accuracyWithin1 = 0,
        mae = 0,
    } = modelMetrics || {};

    const insights = useMemo(() => {
        // Production-grade K8s pod cost assumptions (small service pod)
        const POD_COST_PER_HOUR_USD = 0.048; // ~$0.048/pod/hr (1 vCPU, 2GB RAM on AWS/GCP Asia)
        const INTERVAL_HOURS = 1 / 60; // 1-minute real intervals

        // Naive strategy: always over-provisions by 2 pods
        const naiveCostTotal =
            totalPredictions * 2 * INTERVAL_HOURS * POD_COST_PER_HOUR_USD;
        // ML strategy: actual over-provision cost
        const mlOverCost =
            overCount * 1 * INTERVAL_HOURS * POD_COST_PER_HOUR_USD;
        const costAvoided = Math.max(0, naiveCostTotal - mlOverCost);

        // Wasted pod-hours from over-provisioning
        const wastedPodHours = overCount * INTERVAL_HOURS;

        // SLA risk score: under-provisioned events, weighted by magnitude
        const slaRiskScore = underCount;

        // Savings percentage
        const savingsPct =
            naiveCostTotal > 0
                ? Math.min(100, (costAvoided / naiveCostTotal) * 100)
                : 0;

        return {
            costAvoided,
            naiveCostTotal,
            wastedPodHours,
            slaRiskScore,
            savingsPct,
            mlOverCost,
        };
    }, [totalPredictions, underCount, overCount]);

    const efficiencyColor =
        accuracyWithin1 >= 85
            ? "text-emerald-500"
            : accuracyWithin1 >= 70
            ? "text-blue-500"
            : accuracyWithin1 >= 50
            ? "text-yellow-500"
            : "text-red-500";

    const slaColor =
        insights.slaRiskScore === 0
            ? "text-emerald-500"
            : insights.slaRiskScore < 5
            ? "text-yellow-500"
            : "text-red-500";

    const slaIconColor =
        insights.slaRiskScore === 0
            ? "bg-emerald-50 dark:bg-emerald-900/20"
            : insights.slaRiskScore < 5
            ? "bg-yellow-50 dark:bg-yellow-900/20"
            : "bg-red-50 dark:bg-red-900/20";

    const statCards = [
        {
            label: "Cost Avoided",
            value: `$${insights.costAvoided.toFixed(4)}`,
            sublabel: `vs. naive +2 buffer ($${insights.naiveCostTotal.toFixed(4)})`,
            icon: "mdi:cash-multiple",
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            badge:
                insights.savingsPct > 0
                    ? `${insights.savingsPct.toFixed(0)}% saved`
                    : null,
            badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
        },
        {
            label: "Wasted Pod-Hours",
            value: insights.wastedPodHours.toFixed(3),
            sublabel: `${overCount} over-provision events`,
            icon: "mdi:clock-alert-outline",
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-900/20",
            badge: null,
        },
        {
            label: "SLA Risk Events",
            value: insights.slaRiskScore,
            sublabel: "under-provisioned predictions",
            icon: "mdi:alert-rhombus-outline",
            color: slaColor,
            bg: slaIconColor,
            badge:
                insights.slaRiskScore === 0 ? "No Risk" : null,
            badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
        },
        {
            label: "Efficiency Score",
            value: `${Math.round(accuracyWithin1)}%`,
            sublabel: "predictions within ±1 pod",
            icon: "mdi:gauge",
            color: efficiencyColor,
            bg:
                accuracyWithin1 >= 85
                    ? "bg-emerald-50 dark:bg-emerald-900/20"
                    : accuracyWithin1 >= 70
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : "bg-yellow-50 dark:bg-yellow-900/20",
            badge: null,
        },
    ];

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-xl dark:bg-darkBackground dark:border-gray-700">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                        <Icon
                            icon="mdi:finance"
                            className="w-5 h-5 text-emerald-500"
                        />
                        Cost & Efficiency Insights
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Infrastructure savings vs. naive static over-provisioning
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
                        {totalPredictions} decisions
                    </span>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                        <Icon
                            icon="mdi:information-outline"
                            className="w-3.5 h-3.5 text-blue-400"
                        />
                        <span className="text-xs text-blue-600 dark:text-blue-400">
                            $0.048/pod/hr
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                {statCards.map((stat, idx) => (
                    <div
                        key={idx}
                        className={`p-4 rounded-xl ${stat.bg} flex flex-col gap-1.5 relative overflow-hidden`}
                    >
                        <div className="flex items-center justify-between">
                            <Icon
                                icon={stat.icon}
                                className={`w-4 h-4 ${stat.color}`}
                            />
                            {stat.badge && (
                                <span
                                    className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${stat.badgeColor}`}
                                >
                                    {stat.badge}
                                </span>
                            )}
                        </div>
                        <span
                            className={`text-xl font-bold ${stat.color} leading-tight mt-1`}
                        >
                            {stat.value}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {stat.label}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            {stat.sublabel}
                        </p>
                    </div>
                ))}
            </div>

            {/* MAE info row */}
            <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-xs text-gray-600 dark:text-gray-400">
                <Icon icon="mdi:chart-scatter-plot" className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <span>
                    Session MAE: <span className="font-bold text-violet-500">{mae.toFixed(3)} pods</span>
                </span>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <span>
                    Exact matches: <span className="font-bold text-emerald-500">{exactCount}</span>
                </span>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <span>
                    Under: <span className="font-bold text-red-500">{underCount}</span>
                </span>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <span>
                    Over: <span className="font-bold text-amber-500">{overCount}</span>
                </span>
            </div>

            {/* Provisioning breakdown bar */}
            {totalPredictions > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium">
                            Provisioning breakdown
                        </span>
                        <span>{totalPredictions} total decisions</span>
                    </div>
                    <div className="flex h-3 rounded-full overflow-hidden gap-0.5 bg-gray-100 dark:bg-gray-800">
                        {underCount > 0 && (
                            <div
                                className="h-full bg-red-400 transition-all duration-500 rounded-l-full"
                                style={{
                                    width: `${(underCount / totalPredictions) * 100}%`,
                                }}
                                title={`Under-provisioned: ${underCount} (${((underCount / totalPredictions) * 100).toFixed(1)}%)`}
                            />
                        )}
                        {exactCount > 0 && (
                            <div
                                className="h-full bg-emerald-400 transition-all duration-500"
                                style={{
                                    width: `${(exactCount / totalPredictions) * 100}%`,
                                }}
                                title={`Exact: ${exactCount} (${((exactCount / totalPredictions) * 100).toFixed(1)}%)`}
                            />
                        )}
                        {overCount > 0 && (
                            <div
                                className="h-full bg-amber-400 transition-all duration-500 rounded-r-full"
                                style={{
                                    width: `${(overCount / totalPredictions) * 100}%`,
                                }}
                                title={`Over-provisioned: ${overCount} (${((overCount / totalPredictions) * 100).toFixed(1)}%)`}
                            />
                        )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-sm bg-red-400 inline-block" />
                            Under ({underCount} ·{" "}
                            {totalPredictions > 0
                                ? (
                                      (underCount / totalPredictions) *
                                      100
                                  ).toFixed(1)
                                : 0}
                            %)
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-sm bg-emerald-400 inline-block" />
                            Exact ({exactCount} ·{" "}
                            {totalPredictions > 0
                                ? (
                                      (exactCount / totalPredictions) *
                                      100
                                  ).toFixed(1)
                                : 0}
                            %)
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-sm bg-amber-400 inline-block" />
                            Over ({overCount} ·{" "}
                            {totalPredictions > 0
                                ? (
                                      (overCount / totalPredictions) *
                                      100
                                  ).toFixed(1)
                                : 0}
                            %)
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CostSavingsPanel;
