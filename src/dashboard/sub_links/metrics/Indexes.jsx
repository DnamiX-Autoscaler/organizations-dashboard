import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import TitleHeader from "../../../components/common/TitleHeader";
import TabSection from "../../../components/common/TabSection";
import indexesData from "../../../data/indexes";
import IndexesTable from "../../../components/metrics/indexes/IndexesTable";
import IndexesGraph from "../../../components/metrics/indexes/IndexesGraph";

// Reusable Insight Card Component
const InsightCard = ({ icon, iconBg, iconColor, value, title, subtitle }) => (
  <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-3 rounded-lg ${iconBg}`}>
        <Icon icon={icon} className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      </div>
    </div>
    <p className="text-xs text-gray-600 dark:text-gray-300">{subtitle}</p>
  </div>
);

const insightCards = [
  {
    icon: "mdi:alert-circle",
    iconBg: "bg-red-50 dark:bg-red-900/20",
    iconColor: "text-red-600 dark:text-red-400",
    valueKey: "high_pressure_services",
    title: "High Pressure Services",
    subtitle: "Services with stress index > 80%",
  },
  {
    icon: "mdi:arrow-up-bold",
    iconBg: "bg-orange-50 dark:bg-orange-900/20",
    iconColor: "text-orange-600 dark:text-orange-400",
    valueKey: "scale_up_needed",
    title: "Scale Up Needed",
    subtitle: "Services requiring immediate upscaling",
  },
  {
    icon: "mdi:arrow-down-bold",
    iconBg: "bg-green-50 dark:bg-green-900/20",
    iconColor: "text-green-600 dark:text-green-400",
    valueKey: "scale_down_needed",
    title: "Scale Down Opportunity",
    subtitle: "Services that can be downscaled",
  },
  {
    icon: "mdi:check-circle",
    iconBg: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    valueKey: "stable_services",
    title: "Stable Services",
    subtitle: "Services operating optimally",
  },
];

const Indexes = () => {
  const [data, setData] = useState(indexesData);
  const [activeTab, setActiveTab] = useState("table");

  const tabs = [
    { key: "table", label: "Table View", icon: "mdi:table" },
    { key: "graph", label: "Graph View", icon: "mdi:chart-line" },
  ];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => ({
        ...prevData,
        services: prevData.services.map((service) => ({
          ...service,
          cpu_pressure_index: Math.min(
            1,
            Math.max(
              0,
              service.cpu_pressure_index + (Math.random() * 0.1 - 0.05)
            )
          ),
          memory_pressure_index: Math.min(
            1,
            Math.max(
              0,
              service.memory_pressure_index + (Math.random() * 0.1 - 0.05)
            )
          ),
          io_pressure_index: Math.min(
            1,
            Math.max(
              0,
              service.io_pressure_index + (Math.random() * 0.1 - 0.05)
            )
          ),
          stress_index: Math.min(
            1,
            Math.max(0, service.stress_index + (Math.random() * 0.1 - 0.05))
          ),
        })),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col flex-1 gap-6 p-6">
      {/* Header */}
      <TitleHeader
        title="Pressure Indexes & Scaling Recommendations"
        subtitle="Real-time monitoring of system pressure metrics and ML-driven scaling decisions"
      />

      {/* Live Indicator */}
      <div className="flex items-center gap-2 px-4 py-2 border border-green-200 rounded-lg bg-green-50 dark:bg-green-900/20 dark:border-green-800">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium text-green-700 dark:text-green-400">
          Live monitoring - Updates every 3 seconds
        </span>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {insightCards.map((card, index) => (
          <InsightCard
            key={index}
            icon={card.icon}
            iconBg={card.iconBg}
            iconColor={card.iconColor}
            value={data.insights[card.valueKey]}
            title={card.title}
            subtitle={card.subtitle}
          />
        ))}
      </div>

      {/* Index Explanation */}
      <div className="p-6 border rounded-lg border-blue-500/50 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400/50">
        <div className="flex items-start gap-3">
          <Icon
            icon="mdi:information"
            className="w-6 h-6 text-blue-600 dark:text-blue-400"
          />
          <div>
            <h3 className="mb-2 text-lg font-semibold text-blue-900 dark:text-blue-200">
              Understanding Pressure Indexes
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Pressure indexes combine multiple resource metrics (CPU, memory,
              I/O) with graph centrality data to predict service stress. The
              stress index aggregates all pressure signals to recommend optimal
              replica counts, preventing both over-provisioning and resource
              starvation.
            </p>
          </div>
        </div>
      </div>

      {/* Tab Section */}
      <TabSection
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Table View */}
      {activeTab === "table" && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Service-Level Pressure Analysis
          </h3>
          <IndexesTable services={data.services} />
        </div>
      )}

      {/* Graph View */}
      {activeTab === "graph" && <IndexesGraph data={data.historical} />}
    </div>
  );
};

export default Indexes;
