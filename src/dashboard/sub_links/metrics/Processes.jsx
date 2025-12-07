import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { processData } from "../../../data";
import TitleHeader from "../../../components/common/TitleHeader";
import TabSection from "../../../components/common/TabSection";
import FilterDropdown from "../../../components/common/FilterDropdown";

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
        <button
          onClick={handleClearFilter}
          className="flex items-center px-4 py-2.5 space-x-2 text-sm  text-gray-700 dark:text-gray-300 bg-white/60 dark:bg-darkBackground/60 backdrop-blur-md border border-gray-200 dark:border-gray-600/50 rounded-full transition-all duration-200  hover:bg-white/80 dark:hover:bg-darkBackground/80 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <Icon icon="mdi:filter-off-outline" className="w-4 h-4" />
          <span>Clear Filter</span>
        </button>
      </div>

      {/* Table Section */}
      {activeTab === "table" && (
        <div className="flex-1 overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-darkBackgroundVery">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <span>Cluster Id</span>
                      <Icon
                        icon="mdi:information-outline"
                        className="w-4 h-4 text-gray-400"
                      />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <span>Time Stamps</span>
                      <Icon
                        icon="mdi:information-outline"
                        className="w-4 h-4 text-gray-400"
                      />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                    Window Size
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                    Namespace
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <span>Service Name</span>
                      <Icon
                        icon="mdi:information-outline"
                        className="w-4 h-4 text-gray-400"
                      />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <span>Node Name</span>
                      <Icon
                        icon="mdi:information-outline"
                        className="w-4 h-4 text-gray-400"
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-darkBackground dark:divide-gray-700">
                {filteredData.map((item, index) => (
                  <tr
                    key={index}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-darkBackgroundVery"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-gray-200">
                      {item.clusterId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap dark:text-gray-300">
                      {item.timeStamp}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap dark:text-gray-300">
                      {item.windowSize}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap dark:text-gray-300">
                      {item.namespace}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap dark:text-gray-300">
                      {item.serviceName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap dark:text-gray-300">
                      {item.nodeName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Icon
                icon="mdi:database-off-outline"
                className="w-16 h-16 text-gray-300 dark:text-gray-600"
              />
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                No data found matching your filters
              </p>
            </div>
          )}
        </div>
      )}

      {/* Graph View Placeholder */}
      {activeTab === "graph" && (
        <div className="flex items-center justify-center flex-1 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
          <div className="text-center">
            <Icon
              icon="mdi:chart-line"
              className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600"
            />
            <p className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Graph View
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Visual representation of process data will be displayed here
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricsProcesses;
