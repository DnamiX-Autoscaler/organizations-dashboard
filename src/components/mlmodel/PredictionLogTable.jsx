import React from "react";
import { Icon } from "@iconify/react";

const PredictionLogTable = ({ logs }) => {
    // Get last 15 entries, most recent first
    const displayLogs = [...(logs || [])].reverse().slice(0, 15);

    const getStatusBadge = (error) => {
        const absError = Math.abs(error);
        if (absError === 0) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <Icon icon="mdi:check-circle" className="w-3 h-3" />
                    Exact
                </span>
            );
        } else if (absError === 1) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    <Icon icon="mdi:check" className="w-3 h-3" />
                    ±1
                </span>
            );
        } else if (error > 0) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    <Icon icon="mdi:arrow-up" className="w-3 h-3" />
                    Over +{error}
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    <Icon icon="mdi:arrow-down" className="w-3 h-3" />
                    Under {error}
                </span>
            );
        }
    };

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-xl dark:bg-darkBackground dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                        <Icon icon="mdi:table-clock" className="w-5 h-5 text-indigo-500" />
                        Prediction Log
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Recent predictions vs actual outcomes (T+5min validation)
                    </p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    {logs?.length || 0} total predictions
                </span>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800/80 backdrop-blur-sm">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Time
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Current
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Predicted
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actual@T+5
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Error
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {displayLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                                        <Icon icon="mdi:table-off" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p>Waiting for predictions...</p>
                                    </td>
                                </tr>
                            ) : (
                                displayLogs.map((log, idx) => (
                                    <tr
                                        key={idx}
                                        className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${idx === 0 ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}
                                    >
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="font-mono text-gray-700 dark:text-gray-300">
                                                {log.time}
                                            </span>
                                            {idx === 0 && (
                                                <span className="ml-2 text-xs text-indigo-500">Latest</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="font-semibold text-violet-600 dark:text-violet-400">
                                                {log.currentPods}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                {log.predicted}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                {log.actualAtT5}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`font-mono font-semibold ${log.error === 0 ? 'text-emerald-600' :
                                                    Math.abs(log.error) === 1 ? 'text-blue-600' :
                                                        log.error > 0 ? 'text-amber-600' : 'text-red-600'
                                                }`}>
                                                {log.error > 0 ? '+' : ''}{log.error}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {getStatusBadge(log.error)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PredictionLogTable;
