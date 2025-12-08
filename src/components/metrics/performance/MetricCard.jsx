import React from "react";
import { Icon } from "@iconify/react";

const MetricCard = ({ icon, title, value, unit, percentage, color = "blue", children }) => (
    <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
                <Icon icon={icon} className={`w-5 h-5 text-${color}-500`} />
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</h3>
            </div>
            {percentage !== undefined && (
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{percentage}%</span>
            )}
        </div>
        <div className="mb-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
            {unit && <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">{unit}</span>}
        </div>
        {children}
    </div>
);

export default MetricCard;
