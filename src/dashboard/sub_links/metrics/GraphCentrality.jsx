import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import TitleHeader from "../../../components/common/TitleHeader";
import graphCentralityService from "../../../api/services/metrics/graph_centrality";
import CentralityCard from "../../../components/metrics/graph_centrality/CentralityCard";
import ServiceCentralityTable from "../../../components/metrics/graph_centrality/ServiceCentralityTable";
import CentralityComparison from "../../../components/metrics/graph_centrality/CentralityComparison";
import ViewModeToggle from "../../../components/metrics/graph_centrality/ViewModeToggle";
import SystemInsights from "../../../components/metrics/graph_centrality/SystemInsights";
import AdditionalInsights from "../../../components/metrics/graph_centrality/AdditionalInsights";
import MLBenefitsExplanation from "../../../components/metrics/graph_centrality/MLBenefitsExplanation";
import GraphCentralityGuide from "../../../components/metrics/graph_centrality/GraphCentralityGuide";

const MAX_RETRIES = 5;

const GraphCentrality = () => {
  const [data, setData] = useState({ services: [], connections: [], insights: {} });
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("overview"); // 'overview', 'table', 'comparison', 'guide'

  const abortRef = useRef(null);
  const retryRef = useRef(0);

  // SSE stream
  useEffect(() => {
    const connect = () => {
      const controller = new AbortController();
      abortRef.current = controller;

      graphCentralityService.connectLiveStream({
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

  // Calculate average centrality metrics
  const serviceCount = data.services.length || 1;
  const avgCentrality = {
    degree:
      data.services.reduce((sum, s) => sum + s.degree_centrality, 0) /
      serviceCount,
    betweenness:
      data.services.reduce((sum, s) => sum + s.betweenness_centrality, 0) /
      serviceCount,
    closeness:
      data.services.reduce((sum, s) => sum + s.closeness_centrality, 0) /
      serviceCount,
    eigenvector:
      data.services.reduce((sum, s) => sum + s.eigenvector_centrality, 0) /
      serviceCount,
  };

  return (
    <div className="flex flex-col flex-1 gap-6">
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
              ? "Live graph analysis — SSE stream connected"
              : error
                ? `Connection error — ${error}`
                : "Connecting to live stream…"}
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
