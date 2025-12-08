import React, { useState } from "react";
import { Icon } from "@iconify/react";
import TitleHeader from "../../../components/common/TitleHeader";
import PerformanceGraph from "../../../components/metrics/performance/PerformanceGraph";
import FilterDropdown from "../../../components/common/FilterDropdown";
import ResourceCard from "../../../components/metrics/performance/ResourceCard";
import DetailedView from "../../../components/metrics/performance/DetailedView";
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
        <DetailedView config={currentConfig} cluster={currentCluster} />
      </div>
    </div>
  );
};

export default Performance;
