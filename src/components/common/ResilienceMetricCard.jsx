import React from "react";

const ResilienceMetricCard = ({ title, value, suffix, colorClass, hint, maxValue = 100 }) => {
    const clampPercent = (val) => Math.max(0, Math.min(Math.round(val), 100));

    const percentage = suffix === "%"
        ? clampPercent(value)
        : clampPercent((value / maxValue) * 100);

    return (
        <div className="p-4 border rounded-lg bg-white dark:bg-darkBackground border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{title}</p>
                    <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                        {Number.isFinite(value) ? value.toFixed(suffix === "%" ? (value < 1 && value > 0 ? 3 : 0) : 1) : "-"}
                        {suffix}
                    </p>
                    {hint && <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{hint}</p>}
                </div>
                <div className={`${colorClass} bg-opacity-10 text-opacity-80 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold`}>
                    •
                </div>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-gray-100 dark:bg-darkBackgroundVery overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${colorClass}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default ResilienceMetricCard;
