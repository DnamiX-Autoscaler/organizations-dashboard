import React, { useState, useEffect, useRef } from "react";
import { podLevel, appLevel, serviceMeshLevel } from "../../../data";
import nodeLevelService from "../../../api/services/metrics/node_level";
import TitleHeader from "../../../components/common/TitleHeader";
import TabSection from "../../../components/common/TabSection";
import NodeLevel from "../../../components/metrics/level_usages/node_level/NodeLevel";
import PodLevel from "../../../components/metrics/level_usages/pod_level/PodLevel";
import AppLevel from "../../../components/metrics/level_usages/app_level/AppLevel";
import ServiceMeshLevel from "../../../components/metrics/level_usages/service_mesh_level/ServiceMeshLevel";

const LevelUsages = () => {
  const [activeTab, setActiveTab] = useState("node");

  // ── Node Level SSE State ──
  const [nodeLevelData, setNodeLevelData] = useState([]);
  const [nodeConnected, setNodeConnected] = useState(false);
  const [nodeError, setNodeError] = useState(null);
  const nodeAbortRef = useRef(null);
  const nodeRetryRef = useRef(0);
  const MAX_RETRIES = 5;

  useEffect(() => {
    let cancelled = false;

    const connectSSE = async () => {
      if (cancelled || nodeRetryRef.current >= MAX_RETRIES) return;
      setNodeError(null);

      const controller = new AbortController();
      nodeAbortRef.current = controller;

      await nodeLevelService.connectLiveStream({
        signal: controller.signal,

        onOpen: () => {
          if (!cancelled) {
            setNodeConnected(true);
            setNodeError(null);
            nodeRetryRef.current = 0;
          }
        },

        onMessage: (data) => {
          if (cancelled) return;
          setNodeConnected(true);
          setNodeError(null);
          // Response is an array of node objects
          if (Array.isArray(data)) {
            setNodeLevelData(data);
          }
        },

        onError: () => {
          if (cancelled) return;
          setNodeConnected(false);
          nodeRetryRef.current += 1;
          if (nodeRetryRef.current < MAX_RETRIES) {
            setNodeError("Connection lost. Reconnecting...");
            setTimeout(() => { if (!cancelled) connectSSE(); }, 3000);
          } else {
            setNodeError("Max retry attempts reached. Please refresh the page.");
          }
        },
      });

      // Stream ended naturally — reconnect to stay live
      if (!cancelled) {
        setNodeConnected(false);
        setTimeout(() => { if (!cancelled) connectSSE(); }, 1000);
      }
    };

    connectSSE();

    return () => {
      cancelled = true;
      if (nodeAbortRef.current) {
        nodeAbortRef.current.abort();
        nodeAbortRef.current = null;
      }
    };
  }, []);

  const tabs = [
    { key: "node", label: "Node Level", icon: "mdi:server" },
    { key: "pod", label: "Pod Level", icon: "mdi:cube-outline" },
    { key: "app", label: "Application Level", icon: "mdi:application" },
    {
      key: "serviceMesh",
      label: "Service Mesh Level",
      icon: "mdi:vector-link",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <TitleHeader
        title="Level Usages"
        subtitle="Detailed insights into process levels (Node, Pod, Application, Service Mesh)"
      />

      {/* Tabs Section */}
      <TabSection
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Node Level — live SSE data */}
      {activeTab === "node" && (
        <NodeLevel
          data={nodeLevelData}
          isConnected={nodeConnected}
          error={nodeError}
        />
      )}
      {/* Pod Level */}
      {activeTab === "pod" && <PodLevel data={podLevel} />}
      {/* Application Level */}
      {activeTab === "app" && <AppLevel data={appLevel} />}
      {/* Service Mesh Level */}
      {activeTab === "serviceMesh" && (
        <ServiceMeshLevel data={serviceMeshLevel} />
      )}
    </div>
  );
};

export default LevelUsages;
