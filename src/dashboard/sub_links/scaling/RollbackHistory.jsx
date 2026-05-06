import React, { useMemo, useState } from "react";
import { rollbackHistoryData } from "../../../data";
import TitleHeader from "../../../components/common/TitleHeader";
import TabSection from "../../../components/common/TabSection";
import FilterDropdown from "../../../components/common/FilterDropdown";
import ClearFilterButton from "../../../components/common/ClearFilterButton";
import Graph from "../../../components/common/Graph";

const RollbackHistory = () => {
  const [activeTab, setActiveTab] = useState("graph");
  const [selectedDeployment, setSelectedDeployment] = useState("");
  const [selectedDecision, setSelectedDecision] = useState("");

  const filteredData = rollbackHistoryData.filter((item) => {
    if (selectedDeployment && item.deployment !== selectedDeployment)
      return false;
    if (selectedDecision && item.decision !== selectedDecision) return false;
    return true;
  });

  const uniqueDeployments = useMemo(
    () => [...new Set(rollbackHistoryData.map((item) => item.deployment))],
    []
  );
  const uniqueDecisions = useMemo(
    () => [...new Set(rollbackHistoryData.map((item) => item.decision))],
    []
  );

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

  const tabs = [{ key: "graph", label: "Graph", icon: "mdi:chart-areaspline" }];

  const chartData = filteredData.map((item) => ({
    time: new Date(item.timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    timeStamp: item.timestamp,
    appliedReplicas: item.appliedReplicas,
    previousReplicas: item.previousReplicas,
    deployment: item.deployment,
    decision: item.decision,
    reason: item.reason,
  }));

  const stats = useMemo(() => {
    const total = filteredData.length;
    const rolledBack = filteredData.filter((d) => d.decision === "ROLLED_BACK").length;
    const failed = filteredData.filter((d) => d.decision === "FAILED").length;
    const avgDelta =
      total > 0
        ? (
            filteredData.reduce(
              (sum, d) => sum + (d.previousReplicas - d.appliedReplicas),
              0
            ) / total
          ).toFixed(1)
        : 0;

    return { total, rolledBack, failed, avgDelta };
  }, [filteredData]);

  const tooltipFields = [
    { key: "deployment", label: "Deployment" },
    { key: "decision", label: "Decision" },
    { key: "previousReplicas", label: "Previous Replicas" },
    { key: "appliedReplicas", label: "Applied Replicas" },
    { key: "reason", label: "Reason" },
  ];

  return (
    <div className="flex flex-col h-full">
      <TitleHeader
        title="Rollback History"
        subtitle="Visualize rollbacks and failed scale actions over time"
      />

      <TabSection tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <FilterDropdown
          value={selectedDeployment}
          onChange={setSelectedDeployment}
          options={deploymentOptions}
          placeholder="Select Deployment"
        />
        <FilterDropdown
          value={selectedDecision}
          onChange={setSelectedDecision}
          options={decisionOptions}
          placeholder="Select Decision"
        />
        {(selectedDeployment || selectedDecision) && (
          <ClearFilterButton onClick={handleClearFilter} />
        )}
        <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold">{filteredData.length}</span> of{" "}
          <span className="font-semibold">{rollbackHistoryData.length}</span> events
        </div>
      </div>

      <div className="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 border rounded-lg bg-white dark:bg-darkBackground border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total events</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="p-4 border rounded-lg bg-white dark:bg-darkBackground border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Rolled back</p>
          <p className="mt-1 text-2xl font-semibold text-yellow-600 dark:text-yellow-300">{stats.rolledBack}</p>
        </div>
        <div className="p-4 border rounded-lg bg-white dark:bg-darkBackground border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Failed</p>
          <p className="mt-1 text-2xl font-semibold text-red-600 dark:text-red-300">{stats.failed}</p>
        </div>
        <div className="p-4 border rounded-lg bg-white dark:bg-darkBackground border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Avg replica delta</p>
          <p className="mt-1 text-2xl font-semibold text-blue-600 dark:text-blue-300">{stats.avgDelta}</p>
        </div>
      </div>

      {activeTab === "graph" && (
        <Graph
          data={chartData}
          xKey="time"
          yKey="appliedReplicas"
          chartType="area"
          color="#ef4444"
          height={420}
          showControls={true}
          showStats={true}
          tooltipFields={tooltipFields}
          enableAxisSwap={true}
          enableTypeToggle={true}
          enableTimeRange={false}
          enableLiveToggle={false}
        />
      )}
    </div>
  );
};

export default RollbackHistory;
