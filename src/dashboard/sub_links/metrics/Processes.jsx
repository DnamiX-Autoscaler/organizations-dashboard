import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import processesService from "../../../api/services/metrics/processes";
import TitleHeader from "../../../components/common/TitleHeader";
import TabSection from "../../../components/common/TabSection";
import FilterDropdown from "../../../components/common/FilterDropdown";
import ClearFilterButton from "../../../components/common/ClearFilterButton";
import ProcessesTable from "../../../components/metrics/processes/ProcessesTable";
import ProcessesGraph from "../../../components/metrics/processes/ProcessesGraph";

const MetricsProcesses = () => {
  const [activeTab, setActiveTab] = useState("table");
  const [selectedClusterId, setSelectedClusterId] = useState("");
  const [selectedNamespace, setSelectedNamespace] = useState("");
  const [selectedService, setSelectedService] = useState("");

  // Real-time SSE state
  const [processData, setProcessData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 5;

  // Connect to SSE on mount, disconnect on unmount
  useEffect(() => {
    let cancelled = false;

    const connectSSE = async () => {
      if (cancelled || retryCountRef.current >= MAX_RETRIES) return;
      setError(null);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      await processesService.connectLiveStream({
        signal: controller.signal,

        onOpen: () => {
          if (!cancelled) {
            setIsConnected(true);
            setError(null);
            retryCountRef.current = 0; // Reset retry count on successful connection
          }
        },

        onMessage: (data) => {
          if (cancelled) return;
          setIsConnected(true);
          setError(null);

          // The SSE may send an array of processes or a single object
          if (Array.isArray(data)) {
            setProcessData(data);
          } else {
            setProcessData((prev) => {
              const updated = [...prev, data];
              return updated.length > 500 ? updated.slice(-500) : updated;
            });
          }
        },

        onError: (err) => {
          if (cancelled) return;
          console.error("SSE error:", err);
          setIsConnected(false);
          setError("Connection lost. Reconnecting...");

          retryCountRef.current += 1;
          if (retryCountRef.current < MAX_RETRIES) {
            // Retry after 3 seconds
            setTimeout(() => {
              if (!cancelled) connectSSE();
            }, 3000);
          } else {
            setError("Max retry attempts reached. Please refresh the page.");
          }
        },
      });

      // Stream ended naturally — reconnect to keep it live
      if (!cancelled) {
        setIsConnected(false);
        setTimeout(() => {
          if (!cancelled) connectSSE();
        }, 1000);
      }
    };

    connectSSE();

    // Cleanup: abort the stream on unmount
    return () => {
      cancelled = true;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  // Filter logic
  const filteredData = processData.filter((item) => {
    if (selectedClusterId && item.clusterId !== selectedClusterId) return false;
    if (selectedNamespace && item.namespace !== selectedNamespace) return false;
    if (selectedService && item.serviceName !== selectedService) return false;
    return true;
  });

  // Get unique values for filters from live data
  const uniqueClusterIds = [
    ...new Set(processData.map((item) => item.clusterId)),
  ];
  const uniqueNamespaces = [
    ...new Set(processData.map((item) => item.namespace)),
  ];
  const uniqueServices = [
    ...new Set(processData.map((item) => item.serviceName)),
  ];

  // Prepare dropdown options
  const clusterIdOptions = uniqueClusterIds.map((id) => ({
    value: id,
    label: id,
  }));
  const namespaceOptions = uniqueNamespaces.map((ns) => ({
    value: ns,
    label: ns,
  }));
  const serviceOptions = uniqueServices.map((service) => ({
    value: service,
    label: service,
  }));

  const handleClearFilter = () => {
    setSelectedClusterId("");
    setSelectedNamespace("");
    setSelectedService("");
  };

  const tabs = [
    { key: "table", label: "Table", icon: "mdi:table" },
    { key: "graph", label: "Graph", icon: "mdi:chart-line" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <TitleHeader
        title="Processes"
        subtitle="Check Clusters How to Processing"
      />

      {/* SSE Connection Status */}
      <div className="flex items-center gap-2 mb-3 text-sm">
        <span
          className={`inline-block w-2.5 h-2.5 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
            }`}
        />
        <span className={isConnected ? "text-green-400" : "text-red-400"}>
          {isConnected ? "Live — Real-time streaming" : "Disconnected"}
        </span>
        {processData.length > 0 && (
          <span className="ml-2 text-gray-500">
            ({processData.length} records)
          </span>
        )}
        {error && <span className="ml-2 text-yellow-400">{error}</span>}
      </div>

      {/* Tabs Section */}
      <TabSection
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Filters Section */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Select Cluster ID */}
        <FilterDropdown
          value={selectedClusterId}
          onChange={setSelectedClusterId}
          options={clusterIdOptions}
          placeholder="Select Cluster Id"
        />

        {/* Select Namespace */}
        <FilterDropdown
          value={selectedNamespace}
          onChange={setSelectedNamespace}
          options={namespaceOptions}
          placeholder="Select Namespace"
        />

        {/* Select Service */}
        <FilterDropdown
          value={selectedService}
          onChange={setSelectedService}
          options={serviceOptions}
          placeholder="Select Service"
        />

        {/* Clear Filter Button */}
        <ClearFilterButton onClick={handleClearFilter} />
      </div>

      {/* Table Section */}
      {activeTab === "table" && <ProcessesTable data={filteredData} />}

      {/* Graph View */}
      {activeTab === "graph" && <ProcessesGraph data={filteredData} />}
    </div>
  );
};

export default MetricsProcesses;
