import React from "react";
import { Icon } from "@iconify/react";

// Reusable card component
const BenefitCard = ({
  icon,
  iconClass,
  borderClass,
  bgClass,
  titleClass,
  textClass,
  title,
  description,
}) => (
  <div className={`p-6 border rounded-lg ${borderClass} ${bgClass}`}>
    <Icon icon={icon} className={`w-8 h-8 mb-3 ${iconClass}`} />
    <h4 className={`mb-2 text-sm font-semibold ${titleClass}`}>{title}</h4>
    <p className={`text-xs ${textClass}`}>{description}</p>
  </div>
);

const benefits = [
  {
    icon: "mdi:graph-outline",
    iconClass: "text-blue-600 dark:text-blue-400",
    borderClass: "border-blue-500/50",
    bgClass: "bg-blue-50 dark:bg-blue-900/20",
    titleClass: "text-blue-900 dark:text-blue-200",
    textClass: "text-blue-700 dark:text-blue-300",
    title: "Degree → Load Exposure",
    description:
      "ML learns which high-dependency services need early scaling before CPU spikes occur.",
  },
  {
    icon: "mdi:transit-connection-variant",
    iconClass: "text-green-600 dark:text-green-400",
    borderClass: "border-green-500/50",
    bgClass: "bg-green-50 dark:bg-green-900/20",
    titleClass: "text-green-900 dark:text-green-200",
    textClass: "text-green-700 dark:text-green-300",
    title: "Betweenness → Bottlenecks",
    description:
      "Predicts cascade failures by identifying critical path services that service-mesh logs cannot detect.",
  },
  {
    icon: "mdi:network-strength-4",
    iconClass: "text-orange-600 dark:text-orange-400",
    borderClass: "border-orange-500/50",
    bgClass: "bg-orange-50 dark:bg-orange-900/20",
    titleClass: "text-orange-900 dark:text-orange-200",
    textClass: "text-orange-700 dark:text-orange-300",
    title: "Closeness → Propagation",
    description:
      "Forecasts latency spread speed across the system—impossible with traditional metrics alone.",
  },
  {
    icon: "mdi:vector-circle",
    iconClass: "text-purple-600 dark:text-purple-400",
    borderClass: "border-purple-500/50",
    bgClass: "bg-purple-50 dark:bg-purple-900/20",
    titleClass: "text-purple-900 dark:text-purple-200",
    textClass: "text-purple-700 dark:text-purple-300",
    title: "Eigenvector → Influence",
    description:
      'Identifies "silent influencers" for prioritized scaling—a dimension raw logs cannot provide.',
  },
];

const MLBenefitsExplanation = () => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
    {benefits.map((b, i) => (
      <BenefitCard key={i} {...b} />
    ))}
  </div>
);

export default MLBenefitsExplanation;
