import React from "react";
import { Icon } from "@iconify/react";

const ServiceSelector = ({ services, selectedService, onSelect }) => {
  if (!services || Object.keys(services).length === 0) {
    return null;
  }

  const serviceEntries = Object.entries(services);

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
      <p className="mb-3 text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
        Select Service ({serviceEntries.length})
      </p>
      <div className="flex flex-wrap gap-2">
        {serviceEntries.map(([key, dataPoints]) => {
          const isActive = selectedService === key;
          const pointCount = Array.isArray(dataPoints) ? dataPoints.length : 0;
          const hasData = pointCount > 0;
          const serviceName = hasData ? dataPoints[0].service_name : key.split("/").pop();

          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all border ${isActive
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : hasData
                    ? "bg-white dark:bg-darkBackgroundVery text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500"
                    : "bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 border-gray-100 dark:border-gray-700"
                }`}
            >
              <Icon
                icon={hasData ? "mdi:cube-outline" : "mdi:cube-off-outline"}
                className={`w-4 h-4 ${isActive ? "text-white" : hasData ? "text-indigo-500 dark:text-indigo-400" : "text-gray-300 dark:text-gray-600"}`}
              />
              <span>{serviceName}</span>
              <span
                className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${isActive
                    ? "bg-white/20 text-white"
                    : hasData
                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                  }`}
              >
                {pointCount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceSelector;
