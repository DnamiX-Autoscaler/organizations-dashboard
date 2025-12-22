import React from "react";
import { Icon } from "@iconify/react";

const cards = [
  {
    label: "Total Pods",
    valueKey: "total",
    icon: "mdi:cube-outline",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    valueColor: "text-gray-900 dark:text-white",
  },
  {
    label: "Running",
    valueKey: "running",
    icon: "mdi:check-circle",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
    valueColor: "text-green-600 dark:text-green-400",
  },
  {
    label: "Error",
    valueKey: "error",
    icon: "mdi:alert-circle",
    iconBg: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-600 dark:text-red-400",
    valueColor: "text-red-600 dark:text-red-400",
  },
  {
    label: "Pending",
    valueKey: "pending",
    icon: "mdi:clock-outline",
    iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    valueColor: "text-yellow-600 dark:text-yellow-400",
  },
];

const StatisticsCards = ({ stats }) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
    {cards.map((card) => (
      <div
        key={card.label}
        className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {card.label}
            </p>
            <p className={`mt-1 text-2xl font-bold ${card.valueColor}`}>
              {stats[card.valueKey]}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${card.iconBg}`}>
            <Icon icon={card.icon} className={`w-6 h-6 ${card.iconColor}`} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default StatisticsCards;
