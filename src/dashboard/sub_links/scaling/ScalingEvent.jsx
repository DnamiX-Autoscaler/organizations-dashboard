import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { getScalingEventsStream } from "../../../api/config/autoscaling/api";
import TitleHeader from "../../../components/common/TitleHeader";
import TabSection from "../../../components/common/TabSection";
import FilterDropdown from "../../../components/common/FilterDropdown";
import ClearFilterButton from "../../../components/common/ClearFilterButton";
import Table from "../../../components/common/Table";

const ScalingEvent = () => {
  const [activeTab, setActiveTab] = useState("table");
  const [selectedDeployment, setSelectedDeployment] = useState("");
  const [selectedDecision, setSelectedDecision] = useState("");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const stream = getScalingEventsStream(
      (data) => {
        setEvents((prev) => {
          // Prevent duplicates if same ID comes through
          const exists = prev.find(e => e._id === data._id);
          if (exists) return prev;
          return [data, ...prev].slice(0, 50);
        });
      },
      (error) => {
        console.error("Scaling events stream error:", error);
      },
      { all: true } // Get all records for comprehensive event tracking
    );

    return () => stream.close();
  }, []);

  // Filter logic
  const filteredData = events.filter((item) => {
    if (selectedDeployment && item.deployment !== selectedDeployment) return false;
    if (selectedDecision && item.status !== selectedDecision) return false;
    return true;
  });

  // Get unique values for filters
  const uniqueDeployments = [
    ...new Set(events.map((item) => item.deployment)),
  ];
  const uniqueDecisions = [
    ...new Set(events.map((item) => item.status)),
  ];

  // Prepare dropdown options
  const deploymentOptions = uniqueDeployments.map((deployment) => ({
    value: deployment,
    label: deployment,
  }));
  const decisionOptions = uniqueDecisions.map((decision) => ({
    value: decision,
    label: decision,
  }));

  const handleClearFilter = () => {
    setSelectedDeployment("");
    setSelectedDecision("");
  };

  const tabs = [
    { key: "table", label: "Table", icon: "mdi:table" },
  ];

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  // Get badge color based on decision
  const getDecisionBadge = (decision) => {
    const colors = {
      SUCCESS: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      FAILED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      ROLLED_BACK: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    };
    return (
      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full text-center min-w-[110px] ${colors[decision] || 'bg-gray-100 text-gray-800'}`}>
        {decision}
      </span>
    );
  };

  // Define table columns
  const columns = [
    { key: "timestamp", label: "Timestamp", icon: "mdi:clock-outline", bold: false },
    { key: "deployment", label: "Deployment", icon: "mdi:server", bold: true },
    { key: "scaleAction", label: "Action", icon: "mdi:swap-vertical", bold: false },
    { key: "previousReplicas", label: "Previous Replicas", icon: "mdi:numeric", bold: false },
    { key: "appliedReplicas", label: "Applied Replicas", icon: "mdi:check-circle", bold: false },
    { key: "decision", label: "Status", icon: "mdi:flag", bold: false },
  ];

  // Prepare data for table
  const tableData = filteredData.map((item) => ({
    timestamp: formatTimestamp(item.timestamp),
    deployment: item.deployment,
    scaleAction: item.scale_action,
    previousReplicas: item.previous_replicas,
    appliedReplicas: item.required_replicas,
    decision: getDecisionBadge(item.status),
  }));

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <TitleHeader
        title="Scaling Events"
        subtitle="Monitor and analyze autoscaling decisions across deployments"
      />

      {/* Tabs Section */}
      <TabSection
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Filters Section */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Select Deployment */}
        <FilterDropdown
          value={selectedDeployment}
          onChange={setSelectedDeployment}
          options={deploymentOptions}
          placeholder="Select Deployment"
        />

        {/* Select Decision */}
        <FilterDropdown
          value={selectedDecision}
          onChange={setSelectedDecision}
          options={decisionOptions}
          placeholder="Select Decision"
        />

        {/* Clear Filter Button */}
        {(selectedDeployment || selectedDecision) && (
          <ClearFilterButton onClick={handleClearFilter} />
        )}

        {/* Result Count */}
        <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold">{filteredData.length}</span> of{" "}
          <span className="font-semibold">{events.length}</span> events
        </div>
      </div>

      {/* Content Section */}
      {activeTab === "table" && (
        <Table
          columns={columns}
          data={tableData}
          empty="No scaling events found"
          itemsPerPage={10}
          showPagination={true}
        />
      )}
    </div>
  );
};

export default ScalingEvent;
