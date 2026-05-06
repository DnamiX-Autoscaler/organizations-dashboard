import React, { useState, useEffect, useRef } from "react";
import TitleHeader from "../../../components/common/TitleHeader";
import FilterDropdown from "../../../components/common/FilterDropdown";
import ResourceCard from "../../../components/metrics/performance/ResourceCard";
import DetailedView from "../../../components/metrics/performance/DetailedView";
import getResourceConfig from "../../../components/metrics/performance/resourceConfig";
import getResourceCards from "../../../components/metrics/performance/resourceCards";
import performanceService from "../../../api/services/metrics/performance";

const Performance = () => {
  const [selectedResource, setSelectedResource] = useState("cpu");
  const [selectedClusterId, setSelectedClusterId] = useState("");

  // Real-time SSE state
  const [clusters, setClusters] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 5;

  // Connect to SSE on mount
  useEffect(() => {
    let cancelled = false;

    const connectSSE = async () => {
      if (cancelled || retryCountRef.current >= MAX_RETRIES) return;
      setError(null);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      await performanceService.connectLiveStream({
        signal: controller.signal,

        onOpen: () => {
          if (!cancelled) {
            setIsConnected(true);
            setError(null);
            retryCountRef.current = 0;
          }
        },

        onMessage: (data) => {
          if (cancelled) return;
          setIsConnected(true);
          setError(null);

          if (data?.clusters && Array.isArray(data.clusters)) {
            setClusters(data.clusters);
            // Auto-select first cluster if none selected yet
            setSelectedClusterId((prev) =>
              prev ? prev : data.clusters[0]?.id ?? ""
            );
          }
        },

        onError: (err) => {
          if (cancelled) return;
          setIsConnected(false);
          setError("Connection lost. Reconnecting...");
          retryCountRef.current += 1;
          if (retryCountRef.current < MAX_RETRIES) {
            setTimeout(() => { if (!cancelled) connectSSE(); }, 3000);
          } else {
            setError("Max retry attempts reached. Please refresh the page.");
          }
        },
      });

      // Stream ended naturally — reconnect to stay live
      if (!cancelled) {
        setIsConnected(false);
        setTimeout(() => { if (!cancelled) connectSSE(); }, 1000);
      }
    };

    connectSSE();

    return () => {
      cancelled = true;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  // Derive current cluster object
  const currentCluster = clusters.find((c) => c.id === selectedClusterId);

  // Cluster dropdown options
  const clusterOptions = clusters.map((cluster) => ({
    value: cluster.id,
    label: cluster.name,
  }));

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
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

      {/* SSE Connection Status */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <span
          className={`inline-block w-2.5 h-2.5 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
            }`}
        />
        <span className={isConnected ? "text-green-400" : "text-red-400"}>
          {isConnected ? "Live — Real-time streaming" : "Disconnected"}
        </span>
        {error && <span className="ml-2 text-yellow-400">{error}</span>}
      </div>

      {/* Loading state */}
      {!currentCluster ? (
        <div className="flex items-center justify-center flex-1 text-gray-500 dark:text-gray-400">
          {isConnected ? "Waiting for data..." : "Connecting to live stream..."}
        </div>
      ) : (
        <div className="flex h-full gap-4">
          {/* Left Panel - Resource Cards */}
          <div className="flex flex-col w-1/3 space-y-3">
            {getResourceCards(currentCluster).map((card) => (
              <ResourceCard
                key={card.type}
                {...card}
                isSelected={selectedResource === card.type}
                onClick={() => setSelectedResource(card.type)}
              />
            ))}
          </div>

          {/* Right Panel - Detailed View */}
          <DetailedView
            config={getResourceConfig(currentCluster)[selectedResource]}
            cluster={currentCluster}
          />
        </div>
      )}
    </div>
  );
};

export default Performance;
