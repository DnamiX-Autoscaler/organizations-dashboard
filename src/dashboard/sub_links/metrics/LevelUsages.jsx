import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { nodeLevel, podLevel, appLevel, serviceMeshLevel } from "../../../data";
import TitleHeader from "../../../components/common/TitleHeader";
import TabSection from "../../../components/common/TabSection";
import NodeLevel from "../../../components/metrics/level_usages/node_level/NodeLevel";
import PodLevel from "../../../components/metrics/level_usages/pod_level/PodLevel";
import AppLevel from "../../../components/metrics/level_usages/app_level/AppLevel";
import ServiceMeshLevel from "../../../components/metrics/level_usages/service_mesh_level/ServiceMeshLevel";

const LevelUsages = () => {
  const [activeTab, setActiveTab] = useState("node");

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

      {/* Node Level */}
      {activeTab === "node" && <NodeLevel data={nodeLevel} />}
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
