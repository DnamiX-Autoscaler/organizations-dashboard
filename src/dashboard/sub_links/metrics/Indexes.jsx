import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import TitleHeader from "../../../components/common/TitleHeader";
import TabSection from "../../../components/common/TabSection";
import stressIndexService from "../../../api/services/metrics/stress_index";
import IndexesTable from "../../../components/metrics/indexes/IndexesTable";
import IndexesGraph from "../../../components/metrics/indexes/IndexesGraph";
import IndexesCard from "../../../components/metrics/indexes/indexesCard";

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

const MAX_RETRIES = 5;

const Indexes = () => {
  const [data, setData] = useState({ services: [], historical: [], insights: {} });
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("table");

  const abortRef = useRef(null);
  const retryRef = useRef(0);

  const tabs = [
    { key: "table", label: "Table View", icon: "mdi:table" },
    { key: "card", label: "Card View", icon: "mdi:view-grid" },
    { key: "graph", label: "Graph View", icon: "mdi:chart-line" },
  ];

  // SSE stream
  useEffect(() => {
    const connect = () => {
      const controller = new AbortController();
      abortRef.current = controller;

      stressIndexService.connectLiveStream({
        signal: controller.signal,
        onOpen: () => {
          setIsConnected(true);
          setError(null);
          retryRef.current = 0;
        },
        onMessage: (parsed) => {
          if (parsed && parsed.services) {
            setData(parsed);
          }
        },
        onError: (err) => {
          setIsConnected(false);
          setError(err?.message ?? "Stream error");
          if (retryRef.current < MAX_RETRIES) {
            retryRef.current += 1;
            setTimeout(connect, 2000 * retryRef.current);
          }
        },
      });
    };

    connect();
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  return (
    <div className="flex flex-col flex-1 gap-6">
      {/* Header */}
      <TitleHeader
        title="Pressure Indexes & Scaling Recommendations"
        subtitle="Real-time monitoring of system pressure metrics and ML-driven scaling decisions"
      />

      {/* Live Indicator */}
      <div className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${isConnected
          ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
          : error
            ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
            : "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
        }`}>
        <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : error ? "bg-red-500" : "bg-yellow-500 animate-pulse"
          }`} />
        <span className={`text-sm font-medium ${isConnected
            ? "text-green-700 dark:text-green-400"
            : error
              ? "text-red-700 dark:text-red-400"
              : "text-yellow-700 dark:text-yellow-400"
          }`}>
          {isConnected
            ? "Live monitoring — SSE stream connected"
            : error
              ? `Connection error — ${error}`
              : "Connecting to live stream…"}
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

      {/* Card View */}
      {activeTab === "card" && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Service-Level Pressure Analysis
          </h3>
          <IndexesCard services={data.services} />
        </div>
      )}

      {/* Graph View */}
      {activeTab === "graph" && <IndexesGraph data={data.historical} />}
    </div>
  );
};

export default Indexes;
