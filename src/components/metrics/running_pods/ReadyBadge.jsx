import React from "react";
import { getReadyColor } from "../../../data/runningPods";

const ReadyBadge = ({ ready }) => {
    const color = getReadyColor(ready);
    const colorClasses = {
        green: "text-green-600 dark:text-green-400",
        red: "text-red-600 dark:text-red-400",
        yellow: "text-yellow-600 dark:text-yellow-400",
    };

    return (
        <span className={`font-mono text-sm font-medium ${colorClasses[color]}`}>
            {ready}
        </span>
    );
};

export default ReadyBadge;
