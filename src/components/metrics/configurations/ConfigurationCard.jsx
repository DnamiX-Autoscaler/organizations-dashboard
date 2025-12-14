import React, { useState } from "react";
import { Icon } from "@iconify/react";

const ConfigurationCard = ({ config, level, onEdit, onToggle }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const statusColors = {
        active: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
        inactive: "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20",
    };

    return (
        <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            {config.name}
                        </h3>
                        <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[config.status]
                                }`}
                        >
                            {config.status}
                        </span>
                    </div>
                    {config.namespace && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Namespace: {config.namespace}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* Enable/Disable Toggle */}
                    <button
                        onClick={() => onToggle(config.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.enabled ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.enabled ? "translate-x-6" : "translate-x-1"
                                }`}
                        />
                    </button>

                    {/* Expand/Collapse */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1 text-gray-500 transition-colors rounded hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <Icon
                            icon={isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"}
                            className="w-5 h-5"
                        />
                    </button>
                </div>
            </div>

            {/* Collapsed Info */}
            {!isExpanded && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Scrape Interval
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {config.scrapeInterval}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Metrics</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {config.metrics.length} enabled
                        </p>
                    </div>
                </div>
            )}

            {/* Expanded Details */}
            {isExpanded && (
                <div className="pt-4 mt-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
                    {/* Metrics */}
                    <div>
                        <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                            Enabled Metrics
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {config.metrics.map((metric) => (
                                <span
                                    key={metric}
                                    className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded dark:bg-gray-800 dark:text-gray-300"
                                >
                                    {metric}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Scrape Interval
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {config.scrapeInterval}
                            </p>
                        </div>
                        {config.port && (
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Port</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {config.port}
                                </p>
                            </div>
                        )}
                        {config.endpoint && (
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Endpoint
                                </p>
                                <p className="text-sm font-mono text-gray-900 dark:text-white">
                                    {config.endpoint}
                                </p>
                            </div>
                        )}
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Last Updated
                            </p>
                            <p className="text-sm text-gray-900 dark:text-white">
                                {new Date(config.lastUpdated).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        <button
                            onClick={() => onEdit(config)}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white transition-all rounded-lg bg-primary hover:bg-primary/90"
                        >
                            <Icon icon="mdi:pencil" className="w-4 h-4" />
                            Edit Configuration
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConfigurationCard;
