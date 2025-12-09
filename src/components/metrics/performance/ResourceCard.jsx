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
}) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 p-3 bg-white border rounded-lg cursor-pointer dark:bg-darkBackground transition-all ${
      isSelected
        ? `border-${borderColor} dark:border-${borderColor} bg-${bgColor} dark:bg-${bgColor.replace(
            "50",
            "900/20"
          )}`
        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-darkBackgroundVery"
    }`}
  >
    <div className="w-16 h-16">
      {graphData && graphData.length > 0 ? (
        <PerformanceGraph data={graphData} color={graphColor} height={64} />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded dark:bg-darkBackgroundVery">
          <Icon icon={icon} className={`w-8 h-8 text-${iconColor}`} />
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

export default ResourceCard;
