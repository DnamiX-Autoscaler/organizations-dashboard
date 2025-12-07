import React, { useMemo, useState } from "react";
import { rollbackHistoryData } from "../../../data";
import TitleHeader from "../../../components/common/TitleHeader";
import TabSection from "../../../components/common/TabSection";
import FilterDropdown from "../../../components/common/FilterDropdown";
import ClearFilterButton from "../../../components/common/ClearFilterButton";
import Graph from "../../../components/common/Graph";

const ResilienceMetrics = () => {
  const [activeTab, setActiveTab] = useState("metrics");
  const [selectedDeployment, setSelectedDeployment] = useState("");
  const [selectedDecision, setSelectedDecision] = useState("");

  const filteredData = rollbackHistoryData.filter((item) => {
    if (selectedDeployment && item.deployment !== selectedDeployment) return false;
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

  const deploymentOptions = uniqueDeployments.map((deployment) => ({ value: deployment, label: deployment }));
  const decisionOptions = uniqueDecisions.map((decision) => ({ value: decision, label: decision }));

  const handleClearFilter = () => {
    setSelectedDeployment("");
    setSelectedDecision("");
  };

  const tabs = [
    { key: "metrics", label: "Metrics", icon: "mdi:view-dashboard-outline" },
    { key: "charts", label: "Charts", icon: "mdi:chart-line" },
  ];

  const metricAverages = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        successRate: 0,
        errorRate: 0,
        p95LatencyBefore: 0,
        p95LatencyAfter: 0,
        cpuPercent: 0,
        memPercent: 0,
        restartCount: 0,
        trafficRecovery: 0,
      };
    }

    const avg = (key) => filteredData.reduce((sum, d) => sum + (d.metrics?.[key] || 0), 0) / filteredData.length;

    return {
      successRate: avg("successRate"),
      errorRate: avg("errorRate"),
      p95LatencyBefore: avg("p95LatencyBefore"),
      p95LatencyAfter: avg("p95LatencyAfter"),
      cpuPercent: avg("cpuPercent"),
      memPercent: avg("memPercent"),
      restartCount: avg("restartCount"),
      trafficRecovery: avg("trafficRecovery"),
    };
  }, [filteredData]);

  const clampPercent = (value) => Math.max(0, Math.min(Math.round(value), 100));

  const renderMetricCard = (title, value, suffix, colorClass, hint) => (
    <div className="p-4 border rounded-lg bg-white dark:bg-darkBackground border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
            {Number.isFinite(value) ? value.toFixed(suffix === "%" ? 0 : 1) : "-"}
            {suffix}
          </p>
          {hint && <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
        </div>
        <div className={`${colorClass} bg-opacity-10 text-opacity-80 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold`}>
          •
        </div>
      </div>
      <div className="mt-3 h-2 rounded-full bg-gray-100 dark:bg-darkBackgroundVery">
        <div
          className={`h-full rounded-full ${colorClass}`}
          style={{ width: `${suffix === "%" ? clampPercent(value) : clampPercent((value / 1200) * 100)}%` }}
        />
      </div>
    </div>
  );

  const chartData = filteredData.map((item) => ({
    time: new Date(item.timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    timeStamp: item.timestamp,
    successRate: item.metrics?.successRate,
    errorRate: item.metrics?.errorRate,
    p95LatencyAfter: item.metrics?.p95LatencyAfter,
    cpuPercent: item.metrics?.cpuPercent,
    memPercent: item.metrics?.memPercent,
    trafficRecovery: item.metrics?.trafficRecovery,
    deployment: item.deployment,
    decision: item.decision,
  }));

  const tooltipFieldsBase = [
    { key: "deployment", label: "Deployment" },
    { key: "decision", label: "Decision" },
  ];

  return (
    <div className="flex flex-col h-full">
      <TitleHeader
        title="Resilience Metrics"
        subtitle="Roll-up metrics from rollback / failed scale events"
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

      {activeTab === "metrics" && (
        <div className="grid gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          {renderMetricCard("Success rate", metricAverages.successRate, "%", "bg-green-500", "Higher is better")}
          {renderMetricCard("Error rate", metricAverages.errorRate, "%", "bg-red-500", "Lower is better")}
          {renderMetricCard("p95 latency (before)", metricAverages.p95LatencyBefore, " ms", "bg-amber-500", "Pre-change latency")}
          {renderMetricCard("p95 latency (after)", metricAverages.p95LatencyAfter, " ms", "bg-blue-500", "Post-change latency")}
          {renderMetricCard("CPU utilization", metricAverages.cpuPercent, "%", "bg-purple-500", "Average during event")}
          {renderMetricCard("Memory utilization", metricAverages.memPercent, "%", "bg-indigo-500", "Average during event")}
          {renderMetricCard("Restart count", metricAverages.restartCount, "", "bg-slate-500", "Avg pod restarts")}
          {renderMetricCard("Traffic recovery", metricAverages.trafficRecovery, "%", "bg-emerald-500", "Post-rollback recovery")}
        </div>
      )}

      {activeTab === "charts" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Graph
            data={chartData}
            xKey="time"
            yKey="successRate"
            chartType="line"
            color="#10b981"
            height={320}
            showControls={true}
            showStats={true}
            tooltipFields={[...tooltipFieldsBase, { key: "successRate", label: "Success rate", suffix: "%" }]}
            enableAxisSwap={true}
            enableTypeToggle={true}
            enableTimeRange={false}
            enableLiveToggle={false}
          />
          <Graph
            data={chartData}
            xKey="time"
            yKey="errorRate"
            chartType="area"
            color="#ef4444"
            height={320}
            showControls={true}
            showStats={true}
            tooltipFields={[...tooltipFieldsBase, { key: "errorRate", label: "Error rate", suffix: "%" }]}
            enableAxisSwap={true}
            enableTypeToggle={true}
            enableTimeRange={false}
            enableLiveToggle={false}
          />
        </div>
      )}
    </div>
  );
};

export default ResilienceMetrics;
