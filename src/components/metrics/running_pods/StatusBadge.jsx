import React from "react";
import { getStatusColor } from "../../../data/runningPods";

const StatusBadge = ({ status }) => {
    const color = getStatusColor(status);
    const colorClasses = {
        green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        orange: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
        yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        gray: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    };

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-md ${colorClasses[color]}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
