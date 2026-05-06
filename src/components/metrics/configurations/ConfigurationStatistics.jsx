import React from "react";
import { Icon } from "@iconify/react";

const cards = [
  {
    label: "Total Configs",
    valueKey: "total",
    icon: "mdi:cog-outline",
    iconBg: "bg-gray-100 dark:bg-gray-900/30",
    iconColor: "text-gray-600 dark:text-gray-400",
    valueColor: "text-gray-900 dark:text-white",
  },
  {
    label: "Active",
    valueKey: "active",
    icon: "mdi:check-circle",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
    valueColor: "text-green-600 dark:text-green-400",
  },
  {
    label: "Enabled",
    valueKey: "enabled",
    icon: "mdi:toggle-switch",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    valueColor: "text-blue-600 dark:text-blue-400",
  },
  {
    label: "Inactive",
    valueKey: "inactive",
    icon: "mdi:alert-circle-outline",
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-600 dark:text-orange-400",
    valueColor: "text-orange-600 dark:text-orange-400",
  },
];

const ConfigurationStatistics = ({ stats }) => (
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

export default ConfigurationStatistics;
