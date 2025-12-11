import React from "react";
import { Icon } from "@iconify/react";

// Reusable card component
const InsightCard = ({
  icon,
  iconClass,
  iconBgClass,
  value,
  title,
  description,
}) => (
  <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-3 rounded-lg ${iconBgClass}`}>
        <Icon icon={icon} className={`w-6 h-6 ${iconClass}`} />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      </div>
    </div>
    <p className="text-xs text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

const insightCards = [
  {
    icon: "mdi:alert-circle",
    iconClass: "text-red-600 dark:text-red-400",
    iconBgClass: "bg-red-50 dark:bg-red-900/20",
    valueKey: "critical_services",
    title: "Critical Services",
    description: "Services requiring immediate scaling attention",
  },
  {
    icon: "mdi:traffic-cone",
    iconClass: "text-yellow-600 dark:text-yellow-400",
    iconBgClass: "bg-yellow-50 dark:bg-yellow-900/20",
    valueKey: "bottleneck_services",
    title: "Bottleneck Services",
    description: "Identified through betweenness centrality",
  },
  {
    icon: "mdi:heart-pulse",
    iconClass: "text-green-600 dark:text-green-400",
    iconBgClass: "bg-green-50 dark:bg-green-900/20",
    valueKey: "system_health",
    title: "System Health",
    description: "Overall architecture stability score",
  },
];

const SystemInsights = ({ insights }) => (
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
    {insightCards.map((card, i) => (
      <InsightCard
        key={i}
        icon={card.icon}
        iconClass={card.iconClass}
        iconBgClass={card.iconBgClass}
        value={insights[card.valueKey]}
        title={card.title}
        description={card.description}
      />
    ))}
  </div>
);

export default SystemInsights;
