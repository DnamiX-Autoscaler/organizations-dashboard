import React from "react";
import { Icon } from "@iconify/react";
import { formatDuration, formatFileSize } from "../../../data/metricsExport";

const ExportStatistics = ({ status }) => {
    const stats = [
        {
            label: "Total Records",
            value: status.totalRecords.toLocaleString(),
            icon: "mdi:database",
            iconBg: "bg-blue-100 dark:bg-blue-900/30",
            iconColor: "text-blue-600 dark:text-blue-400",
            valueColor: "text-gray-900 dark:text-white",
        },
        {
            label: "Records/Second",
            value: `${status.stats.recordsPerSecond}/s`,
            icon: "mdi:speedometer",
            iconBg: "bg-green-100 dark:bg-green-900/30",
            iconColor: "text-green-600 dark:text-green-400",
            valueColor: "text-green-600 dark:text-green-400",
        },
        {
            label: "CSV Size",
            value: formatFileSize(status.stats.totalSize.csv),
            icon: "mdi:file-delimited",
            iconBg: "bg-purple-100 dark:bg-purple-900/30",
            iconColor: "text-purple-600 dark:text-purple-400",
            valueColor: "text-purple-600 dark:text-purple-400",
        },
        {
            label: "JSON Size",
            value: formatFileSize(status.stats.totalSize.json),
            icon: "mdi:code-json",
            iconBg: "bg-orange-100 dark:bg-orange-900/30",
            iconColor: "text-orange-600 dark:text-orange-400",
            valueColor: "text-orange-600 dark:text-orange-400",
        },
        {
            label: "Duration",
            value: formatDuration(status.stats.duration),
            icon: "mdi:clock-outline",
            iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
            iconColor: "text-indigo-600 dark:text-indigo-400",
            valueColor: "text-indigo-600 dark:text-indigo-400",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {stat.label}
                            </p>
                            <p className={`mt-1 text-2xl font-bold ${stat.valueColor}`}>
                                {stat.value}
                            </p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.iconBg}`}>
                            <Icon icon={stat.icon} className={`w-6 h-6 ${stat.iconColor}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ExportStatistics;
