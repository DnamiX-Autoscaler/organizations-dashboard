import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import TitleHeader from "../../../components/common/TitleHeader";
import graphCentralityData from "../../../data/graphCentrality";
import CentralityCard from "../../../components/metrics/graph_centrality/CentralityCard";
import ServiceCentralityTable from "../../../components/metrics/graph_centrality/ServiceCentralityTable";
import CentralityComparison from "../../../components/metrics/graph_centrality/CentralityComparison";
import ViewModeToggle from "../../../components/metrics/graph_centrality/ViewModeToggle";
import SystemInsights from "../../../components/metrics/graph_centrality/SystemInsights";
import AdditionalInsights from "../../../components/metrics/graph_centrality/AdditionalInsights";
import MLBenefitsExplanation from "../../../components/metrics/graph_centrality/MLBenefitsExplanation";
import GraphCentralityGuide from "../../../components/metrics/graph_centrality/GraphCentralityGuide";

const GraphCentrality = () => {
  const [data, setData] = useState(graphCentralityData);
  const [viewMode, setViewMode] = useState("overview"); // 'overview', 'table', 'comparison', 'guide'

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => ({
        ...prevData,
        services: prevData.services.map((service) => ({
          ...service,
          degree_centrality: Math.min(
            1,
            Math.max(
              0,
              service.degree_centrality + (Math.random() * 0.04 - 0.02)
            )
          ),
          betweenness_centrality: Math.min(
            1,
            Math.max(
              0,
              service.betweenness_centrality + (Math.random() * 0.04 - 0.02)
            )
          ),
          closeness_centrality: Math.min(
            1,
            Math.max(
              0,
              service.closeness_centrality + (Math.random() * 0.04 - 0.02)
            )
          ),
          eigenvector_centrality: Math.min(
            1,
            Math.max(
              0,
              service.eigenvector_centrality + (Math.random() * 0.04 - 0.02)
            )
          ),
        })),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Calculate average centrality metrics
  const avgCentrality = {
    degree:
      data.services.reduce((sum, s) => sum + s.degree_centrality, 0) /
      data.services.length,
    betweenness:
      data.services.reduce((sum, s) => sum + s.betweenness_centrality, 0) /
      data.services.length,
    closeness:
      data.services.reduce((sum, s) => sum + s.closeness_centrality, 0) /
      data.services.length,
    eigenvector:
      data.services.reduce((sum, s) => sum + s.eigenvector_centrality, 0) /
      data.services.length,
  };

  return (
    <div className="flex flex-col flex-1 gap-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <TitleHeader
          title="Graph Centrality Analysis"
          subtitle="ML-driven service importance & dependency prediction using advanced graph algorithms"
        />

        {/* View Mode Toggle */}
        <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {/* Live Indicator */}
      {viewMode !== "guide" && (
        <div className="flex items-center gap-2 px-4 py-2 border border-green-200 rounded-lg bg-green-50 dark:bg-green-900/20 dark:border-green-800">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-green-700 dark:text-green-400">
            Live graph analysis - Metrics update every 3 seconds
          </span>
        </div>
      )}

      {/* Research Novelty Highlight */}
      {viewMode !== "guide" && (
        <div className="p-6 border rounded-lg border-purple-500/50 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-400/50">
          <div className="flex items-start gap-3">
            <Icon
              icon="mdi:lightbulb-on"
              className="w-6 h-6 text-purple-600 dark:text-purple-400"
            />
            <div>
              <h3 className="mb-2 text-lg font-semibold text-purple-900 dark:text-purple-200">
                Graph-Based ML Scaling
              </h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                This system uses graph centrality metrics to predict service
                bottlenecks, latency propagation, and indirect influence—
                capabilities impossible with CPU/memory metrics alone. Our ML
                model leverages these features for intelligent auto-scaling
                decisions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Overview Mode */}
      {viewMode === "overview" && (
        <>
          {/* Centrality Metrics Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <CentralityCard
              type="degree"
              title="Degree Centrality"
              description="Load exposure awareness - How many services depend on this service?"
              value={avgCentrality.degree}
              color="blue"
              icon="mdi:graph-outline"
              trend={2.5}
            />
            <CentralityCard
              type="betweenness"
              title="Betweenness Centrality"
              description="Bottleneck prediction - Does traffic pass through this service along shortest paths?"
              value={avgCentrality.betweenness}
              color="green"
              icon="mdi:transit-connection-variant"
              trend={-1.2}
            />
            <CentralityCard
              type="closeness"
              title="Closeness Centrality"
              description="Latency propagation speed - How quickly can faults spread from this service?"
              value={avgCentrality.closeness}
              color="orange"
              icon="mdi:network-strength-4"
              trend={1.8}
            />
            <CentralityCard
              type="eigenvector"
              title="Eigenvector Centrality"
              description="Influence strength - How strongly does this service impact the architecture?"
              value={avgCentrality.eigenvector}
              color="purple"
              icon="mdi:vector-circle"
              trend={3.1}
            />
          </div>

          {/* System Insights */}
          <SystemInsights insights={data.insights} />

          {/* Service Table */}
          <ServiceCentralityTable services={data.services} />
        </>
      )}

      {/* Table Mode */}
      {viewMode === "table" && (
        <div className="space-y-6">
          <ServiceCentralityTable services={data.services} />
          <AdditionalInsights services={data.services} />
        </div>
      )}

      {/* Comparison Mode */}
      {viewMode === "comparison" && (
        <div className="space-y-6">
          <CentralityComparison services={data.services} />

          {/* ML Benefits Explanation */}
          {/* <MLBenefitsExplanation /> */}
        </div>
      )}

      {/* Guide Section */}
      {viewMode === "guide" && <GraphCentralityGuide />}
    </div>
  );
};

export default GraphCentrality;
