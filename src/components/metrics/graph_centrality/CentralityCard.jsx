import React from "react";
import { Icon } from "@iconify/react";

const CentralityCard = ({
  type,
  title,
  description,
  value,
  color,
  icon,
  trend,
}) => {
  // Color mapping for proper Tailwind classes and inline styles
  const colorMap = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      icon: "text-blue-600 dark:text-blue-400",
      gradient:
        "linear-gradient(to right, rgb(96, 165, 250), rgb(37, 99, 235))",
    },
    green: {
      bg: "bg-green-50 dark:bg-green-900/20",
      icon: "text-green-600 dark:text-green-400",
      gradient:
        "linear-gradient(to right, rgb(74, 222, 128), rgb(22, 163, 74))",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      icon: "text-orange-600 dark:text-orange-400",
      gradient:
        "linear-gradient(to right, rgb(251, 146, 60), rgb(234, 88, 12))",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      icon: "text-purple-600 dark:text-purple-400",
      gradient:
        "linear-gradient(to right, rgb(192, 132, 252), rgb(147, 51, 234))",
    },
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <div className="relative overflow-hidden transition-all bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700 hover:shadow-lg">
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 blur-3xl" />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${colors.bg}`}>
            <Icon icon={icon} className={`w-6 h-6 ${colors.icon}`} />
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                trend > 0
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              <Icon
                icon={trend > 0 ? "mdi:trending-up" : "mdi:trending-down"}
                className="w-3 h-3"
              />
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        {/* Title & Description */}
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {description}
        </p>

        {/* Value & Progress */}
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {(value * 100).toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Centrality Score
            </span>
          </div>
          <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${value * 100}%`,
                background: colors.gradient,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CentralityCard;
