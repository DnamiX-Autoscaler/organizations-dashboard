import React, { useState } from "react";
import { Icon } from "@iconify/react";
import TitleHeader from "../../../components/common/TitleHeader";
import PerformanceGraph from "../../../components/metrics/performance/PerformanceGraph";
import FilterDropdown from "../../../components/common/FilterDropdown";
import ResourceCard from "../../../components/metrics/performance/ResourceCard";
import performanceData from "../../../data/performanceData";
import getResourceConfig from "../../../components/metrics/performance/resourceConfig";
import getResourceCards from "../../../components/metrics/performance/resourceCards";

const Performance = () => {
  const [selectedResource, setSelectedResource] = useState("cpu");
  const [selectedClusterId, setSelectedClusterId] = useState(
    performanceData.clusters[0].id
  );

  // Get current cluster data
  const currentCluster = performanceData.clusters.find(
    (c) => c.id === selectedClusterId
  );

  // Prepare cluster options for dropdown
  const clusterOptions = performanceData.clusters.map((cluster) => ({
    value: cluster.id,
    label: cluster.name,
  }));

  const currentConfig = getResourceConfig(currentCluster)[selectedResource];
  const resourceCards = getResourceCards(currentCluster);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <TitleHeader
          title="Performance"
          subtitle="Real-time cluster and resource monitoring"
        />

        {/* Cluster Selector */}
        <FilterDropdown
          value={selectedClusterId}
          onChange={setSelectedClusterId}
          options={clusterOptions}
          placeholder="Select Cluster"
        />
      </div>

      <div className="flex h-full gap-4">
        {/* Left Panel - Resource Cards */}
        <div className="flex flex-col w-1/3 space-y-3">
          {resourceCards.map((card) => (
            <ResourceCard
              key={card.type}
              {...card}
              isSelected={selectedResource === card.type}
              onClick={() => setSelectedResource(card.type)}
            />
          ))}
        </div>

        {/* Right Panel - Detailed View */}
        <div className="flex-1 p-6 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentConfig.title}
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {currentCluster.name}
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {currentConfig.subtitle}
            </div>
          </div>

          {/* Large Graph - Show only for CPU and Memory */}
          {currentConfig.data.length > 0 && (
            <div className="mb-6" style={{ height: "280px" }}>
              <PerformanceGraph
                data={currentConfig.data}
                color={currentConfig.color}
                height={280}
              />
            </div>
          )}

          {/* No Graph Message for Disk and Network */}
          {currentConfig.data.length === 0 && (
            <div
              className="flex items-center justify-center mb-6"
              style={{ height: "280px" }}
            >
              <div className="text-center">
                <Icon
                  icon="mdi:chart-timeline-variant"
                  className="w-16 h-16 mx-auto mb-3 text-gray-300 dark:text-gray-600"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Real-time graph available for CPU and Memory only
                </p>
              </div>
            </div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 mb-6 gap-x-8 gap-y-3">
            {currentConfig.metrics.map((metric, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {metric.label}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Info Grid */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                Total Nodes
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {currentCluster.totalNodes}
              </div>
            </div>
            <div>
              <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                Total Pods
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {currentCluster.totalPods}
              </div>
            </div>
            <div>
              <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                Total Memory
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {currentCluster.totalMemory} GB
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;
