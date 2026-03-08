import React from "react";
import { Icon } from "@iconify/react";
import TitleHeader from "../../../components/common/TitleHeader";
import CostSavingsPanel from "../../../components/mlmodel/CostSavingsPanel";
import useMLModel from "../../../services/useMLModel";

const COST_PER_POD_HR = 0.048;

const MLModelCostSavings = () => {
    const { modelMetrics, isSimulating } = useMLModel();

    const totalPredictions = modelMetrics.totalPredictions || 0;
    const exactCount = modelMetrics.exactCount || 0;
    const overCount = modelMetrics.overCount || 0;

    // Each data tick = 5-min window, so hours = predictions * 5 / 60
    const hoursTracked = (totalPredictions * 5) / 60;
    const naivePodExtra = 2; // naive safety buffer
    const naiveCostTotal = naivePodExtra * hoursTracked * COST_PER_POD_HR;
    const actualExtraPodsAvg = overCount > 0 ? (overCount / totalPredictions) * 0.5 : 0;
    const mlCostTotal = actualExtraPodsAvg * hoursTracked * COST_PER_POD_HR;
    const costAvoided = Math.max(0, naiveCostTotal - mlCostTotal);
    const efficiencyScore = totalPredictions > 0 ? Math.round(((exactCount + overCount * 0.5) / totalPredictions) * 100) : 0;

    const highlights = [
        {
            label: "Estimated Cost Avoided",
            value: `$${costAvoided.toFixed(2)}`,
            sub: "vs naive +2 pod buffer",
            icon: "mdi:cash-check",
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
        },
        {
            label: "Naive Cost (Session)",
            value: `$${naiveCostTotal.toFixed(2)}`,
            sub: `${hoursTracked.toFixed(1)}h × $${COST_PER_POD_HR}/pod/hr`,
            icon: "mdi:cash-remove",
            color: "text-red-500 dark:text-red-400",
            bg: "bg-red-50 dark:bg-red-900/20",
        },
        {
            label: "Efficiency Score",
            value: `${efficiencyScore}%`,
            sub: "exact + near-exact / total",
            icon: "mdi:gauge",
            color: "text-violet-600 dark:text-violet-400",
            bg: "bg-violet-50 dark:bg-violet-900/20",
        },
        {
            label: "Hours Tracked",
            value: `${hoursTracked.toFixed(1)}h`,
            sub: `${totalPredictions} predictions`,
            icon: "mdi:clock-outline",
            color: "text-blue-500 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-900/20",
        },
    ];

    return (
        <div className="space-y-6">
            <TitleHeader
                title="Cost Savings"
                subtitle="Infrastructure cost avoided by using ML-driven scaling vs static over-provisioning"
            />

            {!isSimulating && totalPredictions === 0 && (
                <div className="flex items-center gap-3 px-4 py-3 text-sm rounded-xl bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800">
                    <Icon icon="mdi:timer-sand" className="w-5 h-5 shrink-0" />
                    <span>Waiting for simulation to start — cost data will appear once predictions begin.</span>
                </div>
            )}

            {/* Summary highlight cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {highlights.map((h, i) => (
                    <div
                        key={i}
                        className="p-5 bg-white dark:bg-darkBackground border border-gray-100 dark:border-gray-700/50 rounded-xl shadow-sm flex items-start gap-4"
                    >
                        <div className={`p-3 rounded-xl ${h.bg}`}>
                            <Icon icon={h.icon} className={`w-7 h-7 ${h.color}`} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{h.label}</p>
                            <p className={`text-2xl font-bold ${h.color}`}>{h.value}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{h.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detailed cost savings panel */}
            <CostSavingsPanel modelMetrics={modelMetrics} />

            {/* Assumptions note */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700/50 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <p className="font-semibold text-gray-600 dark:text-gray-300 mb-2">Calculation Assumptions</p>
                <p>• Baseline: naive approach adds a fixed +2 pod safety buffer at all times.</p>
                <p>• Unit cost: <span className="font-mono">${COST_PER_POD_HR}/pod/hr</span> (approximate on-demand k8s node).</p>
                <p>• Each simulation tick represents a 5-minute prediction window.</p>
                <p>• Cost avoided = (naive wasted pods − ML wasted pods) × hours tracked × unit cost.</p>
                <p>• Figures are indicative only and depend on actual pod sizing and cloud pricing.</p>
            </div>
        </div>
    );
};

export default MLModelCostSavings;
