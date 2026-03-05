import React from "react";
import { Icon } from "@iconify/react";

const ModelInfoPanel = ({ modelHealth, apiLatency, isApiHealthy }) => {
    const modelFile = modelHealth?.model_file || "Unknown";

    // Infer model type from filename
    const modelType = modelFile.includes("bilstm")
        ? "BiLSTM"
        : modelFile.includes("tcn")
        ? "TCN"
        : modelFile.includes("informer")
        ? "Informer"
        : modelFile.includes("prophet")
        ? "Prophet"
        : "LSTM";

    // Parse trained date from filename pattern: bilstm-pods-20260104_012142.keras
    const dateMatch = modelFile.match(/(\d{8})_(\d{6})/);
    let trainedDate = "Unknown";
    let trainedTime = "";
    if (dateMatch) {
        const d = dateMatch[1];
        const t = dateMatch[2];
        trainedDate = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
        trainedTime = `${t.slice(0, 2)}:${t.slice(2, 4)}`;
    }

    const lookback = modelHealth?.lookback || 48;
    const horizon = modelHealth?.horizon_min || 5;
    const scalersFile = modelHealth?.scalers_file || "N/A";

    const infoItems = [
        {
            label: "Model Architecture",
            value: modelType,
            icon: "mdi:brain",
            color: "text-violet-500",
            bg: "bg-violet-50 dark:bg-violet-900/20",
        },
        {
            label: "Weights File",
            value: modelFile.replace(".keras", "").replace(".json", ""),
            icon: "mdi:file-code-outline",
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            truncate: true,
        },
        {
            label: "Last Trained",
            value: trainedDate,
            subvalue: trainedTime ? `at ${trainedTime} UTC` : "",
            icon: "mdi:calendar-clock",
            color: "text-teal-500",
            bg: "bg-teal-50 dark:bg-teal-900/20",
        },
        {
            label: "Lookback Window",
            value: `${lookback} steps`,
            subvalue: `≈ ${lookback} min of history`,
            icon: "mdi:timeline-clock-outline",
            color: "text-amber-500",
            bg: "bg-amber-50 dark:bg-amber-900/20",
        },
        {
            label: "Prediction Horizon",
            value: `+${horizon} min`,
            subvalue: "proactive scaling lead time",
            icon: "mdi:clock-fast",
            color: "text-emerald-500",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
        },
        {
            label: "Safety Buffer",
            value: "×1.0",
            subvalue: "minimal over-provision",
            icon: "mdi:shield-check-outline",
            color: "text-indigo-500",
            bg: "bg-indigo-50 dark:bg-indigo-900/20",
        },
    ];

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-xl dark:bg-darkBackground dark:border-gray-700">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                        <Icon icon="mdi:robot-outline" className="w-5 h-5 text-violet-500" />
                        Model Information
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Inference engine configuration
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                            isApiHealthy
                                ? "bg-emerald-50 dark:bg-emerald-900/20"
                                : "bg-red-50 dark:bg-red-900/20"
                        }`}
                    >
                        <span
                            className={`w-2 h-2 rounded-full animate-pulse ${
                                isApiHealthy ? "bg-emerald-500" : "bg-red-500"
                            }`}
                        />
                        <span
                            className={`text-xs font-semibold ${
                                isApiHealthy
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-red-600 dark:text-red-400"
                            }`}
                        >
                            {isApiHealthy
                                ? `Online · ${apiLatency}ms`
                                : "Offline"}
                        </span>
                    </div>
                    {scalersFile !== "N/A" && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <Icon
                                icon="mdi:scale-balance"
                                className="w-3.5 h-3.5 text-gray-500"
                            />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                MinMax Scaled
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {infoItems.map((item, idx) => (
                    <div
                        key={idx}
                        className={`flex items-start gap-3 p-3.5 rounded-xl ${item.bg} border border-white/60 dark:border-gray-700/30`}
                    >
                        <div
                            className={`p-1.5 rounded-lg bg-white/60 dark:bg-gray-900/40 flex-shrink-0`}
                        >
                            <Icon
                                icon={item.icon}
                                className={`w-4 h-4 ${item.color}`}
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                                {item.label}
                            </p>
                            <p
                                className={`text-sm font-bold ${item.color} ${
                                    item.truncate ? "truncate" : ""
                                }`}
                                title={item.value}
                            >
                                {item.value}
                            </p>
                            {item.subvalue && (
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                    {item.subvalue}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Feature count footer */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                        <Icon icon="mdi:table-column" className="w-4 h-4 text-blue-400" />
                        20 input features + 1 target
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Icon
                            icon="mdi:matrix"
                            className="w-4 h-4 text-violet-400"
                        />
                        Input shape: {lookback}×21
                    </span>
                </div>
                <span className="flex items-center gap-1.5">
                    <Icon
                        icon="mdi:kubernetes"
                        className="w-4 h-4 text-teal-400"
                    />
                    K8s Pod Autoscaler
                </span>
            </div>
        </div>
    );
};

export default ModelInfoPanel;
