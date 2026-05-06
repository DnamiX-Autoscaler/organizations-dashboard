import React from "react";
import { getServiceTypeColor } from "../../../data/runningServices";

const ServiceTypeBadge = ({ type }) => {
    const color = getServiceTypeColor(type);
    const colorClasses = {
        blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        purple: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
        green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        orange: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
        gray: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    };

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-md ${colorClasses[color]}`}>
            {type}
        </span>
    );
};

export default ServiceTypeBadge;
