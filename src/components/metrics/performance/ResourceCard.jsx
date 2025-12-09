import React from "react";
import { Icon } from "@iconify/react";
import PerformanceGraph from "./PerformanceGraph";

const ResourceCard = ({
  type,
  title,
  value,
  subtitle,
  icon,
  iconColor,
  borderColor,
  bgColor,
  graphData,
  graphColor,
  isSelected,
  onClick,
}) => {
  const getSelectedClasses = () => {
    const colorMap = {
      "blue-500":
        "border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20",
      "green-500":
        "border-green-500 dark:border-green-500 bg-green-50 dark:bg-green-900/20",
      "purple-500":
        "border-purple-500 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/20",
      "orange-500":
        "border-orange-500 dark:border-orange-500 bg-orange-50 dark:bg-orange-900/20",
    };
    return colorMap[borderColor] || "";
  };

  const getIconColorClass = () => {
    const colorMap = {
      "blue-500": "text-blue-500",
      "green-500": "text-green-500",
      "purple-500": "text-purple-500",
      "orange-500": "text-orange-500",
    };
    return colorMap[iconColor] || "";
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 bg-white border rounded-lg cursor-pointer dark:bg-darkBackground transition-all ${
        isSelected
          ? getSelectedClasses()
          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-darkBackgroundVery"
      }`}
    >
      <div className="w-16 h-16">
        {graphData && graphData.length > 0 ? (
          <PerformanceGraph data={graphData} color={graphColor} height={64} />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded dark:bg-darkBackgroundVery">
            <Icon icon={icon} className={`w-8 h-8 ${getIconColorClass()}`} />
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-gray-900 dark:text-white">
          {title}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{value}</div>
      </div>
    </div>
  );
};

export default ResourceCard;
