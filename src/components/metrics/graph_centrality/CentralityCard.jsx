import React from "react";
import { Icon } from "@iconify/react";

const CentralityCard = ({ type, title, description, value, color, icon, trend }) => {
    return (
        <div className="relative overflow-hidden transition-all bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700 hover:shadow-lg">
            {/* Background Gradient */}
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 bg-gradient-to-br from-${color}-400 to-${color}-600 rounded-full blur-3xl`} />

            <div className="relative p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-${color}-50 dark:bg-${color}-900/20`}>
                        <Icon icon={icon} className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
                    </div>
                    {trend && (
                        <div className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${trend > 0
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                            <Icon icon={trend > 0 ? "mdi:trending-up" : "mdi:trending-down"} className="w-3 h-3" />
                            {Math.abs(trend)}%
                        </div>
                    )}
                </div>

                {/* Title & Description */}
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                </h3>
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {description}
                </p>

                {/* Value & Progress */}
                <div className="space-y-2">
                    <div className="flex items-end justify-between">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            {(value * 100).toFixed(1)}%
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Centrality Score</span>
                    </div>
                    <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                        <div
                            className={`h-full bg-gradient-to-r from-${color}-400 to-${color}-600 rounded-full transition-all duration-500`}
                            style={{ width: `${value * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CentralityCard;
