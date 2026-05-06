import React from "react";
import { Icon } from "@iconify/react";

const cards = [
  {
    label: "Total Services",
    valueKey: "total",
    icon: "mdi:monitor-dashboard",
    iconBg: "bg-gray-100 dark:bg-gray-900/30",
    iconColor: "text-gray-600 dark:text-gray-400",
    valueColor: "text-gray-900 dark:text-white",
  },
  {
    label: "Prometheus",
    valueKey: "prometheus",
    icon: "simple-icons:prometheus",
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-600 dark:text-orange-400",
    valueColor: "text-orange-600 dark:text-orange-400",
  },
  {
    label: "Grafana",
    valueKey: "grafana",
    icon: "simple-icons:grafana",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    valueColor: "text-blue-600 dark:text-blue-400",
  },
  {
    label: "Alertmanager",
    valueKey: "alertmanager",
    icon: "mdi:bell-alert",
    iconBg: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-600 dark:text-red-400",
    valueColor: "text-red-600 dark:text-red-400",
  },
  {
    label: "Exporters",
    valueKey: "exporters",
    icon: "mdi:export",
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
    valueColor: "text-purple-600 dark:text-purple-400",
  },
];

const PrometheusStatisticsCards = ({ stats }) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
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

export default PrometheusStatisticsCards;
