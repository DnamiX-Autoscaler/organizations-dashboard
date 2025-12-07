import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { processData } from "../../../data";
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

  // Filter logic
  const filteredData = processData.filter((item) => {
    if (selectedClusterId && item.clusterId !== selectedClusterId) return false;
    if (selectedNamespace && item.namespace !== selectedNamespace) return false;
    if (selectedService && item.serviceName !== selectedService) return false;
    return true;
  });

  // Get unique values for filters
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
