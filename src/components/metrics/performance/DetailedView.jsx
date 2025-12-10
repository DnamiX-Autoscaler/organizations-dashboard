import React from "react";
import { Icon } from "@iconify/react";
import PerformanceGraph from "./PerformanceGraph";

const DetailedView = ({ config, cluster }) => (
    <div className="flex-1 p-6 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
        <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {config.title}
                </h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {cluster.name}
                </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
                {config.subtitle}
            </div>
        </div>

        {/* Large Graph - Show only for CPU and Memory */}
        {config.data.length > 0 && (
            <div className="mb-6" style={{ height: "280px" }}>
                <PerformanceGraph
                    data={config.data}
                    color={config.color}
                    height={280}
                />
            </div>
        )}

        {/* No Graph Message for Disk and Network */}
        {config.data.length === 0 && (
            <div
                className="flex items-center justify-center mb-6"
                style={{ height: "280px" }}
            >
                <div className="text-center">
                    <Icon
                        icon="mdi:chart-timeline-variant"
                        className="w-16 h-16 mx-auto mb-3 text-gray-300 dark:text-gray-600"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Real-time graph available for CPU and Memory only
                    </p>
                </div>
            </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 mb-6 gap-x-8 gap-y-3">
            {config.metrics.map((metric, index) => (
                <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                        {metric.label}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                        {metric.value}
                    </span>
                </div>
            ))}
        </div>

        {/* Bottom Info Grid */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
                <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                    Total Nodes
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {cluster.totalNodes}
                </div>
            </div>
            <div>
                <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                    Total Pods
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {cluster.totalPods}
                </div>
            </div>
            <div>
                <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                    Total Memory
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {cluster.totalMemory} GB
                </div>
            </div>
        </div>
    </div>
);

export default DetailedView;
