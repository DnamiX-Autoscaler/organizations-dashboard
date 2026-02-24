import React, { useState, useEffect, useRef } from "react";
import { serviceMeshLevel } from "../../../data";
import nodeLevelService from "../../../api/services/metrics/node_level";
import podLevelService from "../../../api/services/metrics/pod_level";
import appLevelService from "../../../api/services/metrics/app_level";
import TitleHeader from "../../../components/common/TitleHeader";
import TabSection from "../../../components/common/TabSection";
import NodeLevel from "../../../components/metrics/level_usages/node_level/NodeLevel";
import PodLevel from "../../../components/metrics/level_usages/pod_level/PodLevel";
import AppLevel from "../../../components/metrics/level_usages/app_level/AppLevel";
import ServiceMeshLevel from "../../../components/metrics/level_usages/service_mesh_level/ServiceMeshLevel";

const LevelUsages = () => {
  const [activeTab, setActiveTab] = useState("node");

  // ── Node Level SSE State ──
  const MAX_RETRIES = 5;

  // ── Node Level SSE State ──
  const [nodeLevelData, setNodeLevelData] = useState([]);
  const [nodeConnected, setNodeConnected] = useState(false);
  const [nodeError, setNodeError] = useState(null);
  const nodeAbortRef = useRef(null);
  const nodeRetryRef = useRef(0);

  // ── Pod Level SSE State ──
  const [podLevelData, setPodLevelData] = useState([]);
  const [podConnected, setPodConnected] = useState(false);
  const [podError, setPodError] = useState(null);
  const podAbortRef = useRef(null);
  const podRetryRef = useRef(0);

  // ── App Level SSE State ──
  const [appLevelData, setAppLevelData] = useState([]);
  const [appConnected, setAppConnected] = useState(false);
  const [appError, setAppError] = useState(null);
  const appAbortRef = useRef(null);
  const appRetryRef = useRef(0);

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

  // ── Pod Level SSE ──
  useEffect(() => {
    let cancelled = false;

    const connectSSE = async () => {
      if (cancelled || podRetryRef.current >= MAX_RETRIES) return;
      setPodError(null);

      const controller = new AbortController();
      podAbortRef.current = controller;

      await podLevelService.connectLiveStream({
        signal: controller.signal,

        onOpen: () => {
          if (!cancelled) {
            setPodConnected(true);
            setPodError(null);
            podRetryRef.current = 0;
          }
        },

        onMessage: (data) => {
          if (cancelled) return;
          setPodConnected(true);
          setPodError(null);
          if (Array.isArray(data)) {
            setPodLevelData(data);
          }
        },

        onError: () => {
          if (cancelled) return;
          setPodConnected(false);
          podRetryRef.current += 1;
          if (podRetryRef.current < MAX_RETRIES) {
            setPodError("Connection lost. Reconnecting...");
            setTimeout(() => { if (!cancelled) connectSSE(); }, 3000);
          } else {
            setPodError("Max retry attempts reached. Please refresh the page.");
          }
        },
      });

      // Stream ended naturally — reconnect to stay live
      if (!cancelled) {
        setPodConnected(false);
        setTimeout(() => { if (!cancelled) connectSSE(); }, 1000);
      }
    };

    connectSSE();

    return () => {
      cancelled = true;
      if (podAbortRef.current) {
        podAbortRef.current.abort();
        podAbortRef.current = null;
      }
    };
  }, []);

  // ── App Level SSE ──
  useEffect(() => {
    let cancelled = false;

    const connectSSE = async () => {
      if (cancelled || appRetryRef.current >= MAX_RETRIES) return;
      setAppError(null);

      const controller = new AbortController();
      appAbortRef.current = controller;

      await appLevelService.connectLiveStream({
        signal: controller.signal,

        onOpen: () => {
          if (!cancelled) {
            setAppConnected(true);
            setAppError(null);
            appRetryRef.current = 0;
          }
        },

        onMessage: (data) => {
          if (cancelled) return;
          setAppConnected(true);
          setAppError(null);
          if (Array.isArray(data)) {
            setAppLevelData(data);
          }
        },

        onError: () => {
          if (cancelled) return;
          setAppConnected(false);
          appRetryRef.current += 1;
          if (appRetryRef.current < MAX_RETRIES) {
            setAppError("Connection lost. Reconnecting...");
            setTimeout(() => { if (!cancelled) connectSSE(); }, 3000);
          } else {
            setAppError("Max retry attempts reached. Please refresh the page.");
          }
        },
      });

      if (!cancelled) {
        setAppConnected(false);
        setTimeout(() => { if (!cancelled) connectSSE(); }, 1000);
      }
    };

    connectSSE();

    return () => {
      cancelled = true;
      if (appAbortRef.current) {
        appAbortRef.current.abort();
        appAbortRef.current = null;
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
      {/* Pod Level — live SSE data */}
      {activeTab === "pod" && (
        <PodLevel
          data={podLevelData}
          isConnected={podConnected}
          error={podError}
        />
      )}
      {/* Application Level — live SSE data */}
      {activeTab === "app" && (
        <AppLevel
          data={appLevelData}
          isConnected={appConnected}
          error={appError}
        />
      )}
      {/* Service Mesh Level */}
      {activeTab === "serviceMesh" && (
        <ServiceMeshLevel data={serviceMeshLevel} />
      )}
    </div>
  );
};

export default LevelUsages;
