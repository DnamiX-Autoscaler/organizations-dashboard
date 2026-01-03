import React, { useMemo, useState } from "react";
import { rollbackHistoryData } from "../../../data";
import TitleHeader from "../../../components/common/TitleHeader";
import TabSection from "../../../components/common/TabSection";
import FilterDropdown from "../../../components/common/FilterDropdown";
import ClearFilterButton from "../../../components/common/ClearFilterButton";
import Graph from "../../../components/common/Graph";
import ProjectMetricsAccordion from "./ProjectMetricsAccordion";
import ResilienceMetricCard from "../../../components/common/ResilienceMetricCard";

const ResilienceMetrics = () => {
  const [activeTab, setActiveTab] = useState("hierarchical");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedDeployment, setSelectedDeployment] = useState("");
  const [selectedDecision, setSelectedDecision] = useState("");

  const filteredData = rollbackHistoryData.filter((item) => {
    if (selectedProject && item.project !== selectedProject) return false;
    if (selectedDeployment && item.deployment !== selectedDeployment) return false;
    if (selectedDecision && item.decision !== selectedDecision) return false;
    return true;
  });

  const uniqueProjects = useMemo(
    () => [...new Set(rollbackHistoryData.map((item) => item.project).filter(Boolean))],
    []
  );
  const uniqueDeployments = useMemo(
    () => [...new Set(rollbackHistoryData.filter(i => !selectedProject || i.project === selectedProject).map((item) => item.deployment))],
    [selectedProject]
  );
  const uniqueDecisions = useMemo(
    () => [...new Set(rollbackHistoryData.map((item) => item.decision))],
    []
  );

  const projectOptions = uniqueProjects.map((project) => ({ value: project, label: project }));
  const deploymentOptions = uniqueDeployments.map((deployment) => ({ value: deployment, label: deployment }));
  const decisionOptions = uniqueDecisions.map((decision) => ({ value: decision, label: decision }));

  const handleClearFilter = () => {
    setSelectedProject("");
    setSelectedDeployment("");
    setSelectedDecision("");
  };

  const tabs = [
    { key: "hierarchical", label: "Hierarchical View", icon: "mdi:file-tree" },
    { key: "metrics", label: "Averages", icon: "mdi:view-dashboard-outline" },
    { key: "charts", label: "Trends", icon: "mdi:chart-line" },
  ];

  const hierarchicalData = useMemo(() => {
    const grouped = {};

    rollbackHistoryData.forEach(item => {
      const proj = item.project || "Unassigned";
      const serv = item.deployment;

      if (!grouped[proj]) grouped[proj] = {};

      // For simplicity, using the latest metrics for each service in the hierarchical view
      // In a real app, this might be a rolling average or real-time snapshot
      if (!grouped[proj][serv]) {
        grouped[proj][serv] = item.metrics;
      }
    });

    return grouped;
  }, []);

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
    project: item.project,
  }));

  const tooltipFieldsBase = [
    { key: "project", label: "Project" },
    { key: "deployment", label: "Service" },
    { key: "decision", label: "Decision" },
  ];

  return (
    <div className="flex flex-col h-full">
      <TitleHeader
        title="Resilience Metrics"
        subtitle="Hierarchical monitoring across projects and services"
      />

      <TabSection tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <FilterDropdown
          value={selectedProject}
          onChange={(val) => {
            setSelectedProject(val);
            setSelectedDeployment(""); // Reset service filter when project changes
          }}
          options={projectOptions}
          placeholder="Select Project"
        />
        <FilterDropdown
          value={selectedDeployment}
          onChange={setSelectedDeployment}
          options={deploymentOptions}
          placeholder="Select Service"
        />
        <FilterDropdown
          value={selectedDecision}
          onChange={setSelectedDecision}
          options={decisionOptions}
          placeholder="Select Decision"
        />
        {(selectedProject || selectedDeployment || selectedDecision) && (
          <ClearFilterButton onClick={handleClearFilter} />
        )}
        <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold">{filteredData.length}</span> results
        </div>
      </div>

      {activeTab === "hierarchical" && (
        <div className="space-y-4">
          {Object.entries(hierarchicalData)
            .filter(([proj]) => !selectedProject || proj === selectedProject)
            .map(([projectName, servicesData]) => (
              <ProjectMetricsAccordion
                key={projectName}
                projectName={projectName}
                servicesData={servicesData}
              />
            ))}
        </div>
      )}

      {activeTab === "metrics" && (
        <div className="grid gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <ResilienceMetricCard
            title="Avg Success Rate"
            value={metricAverages.successRate}
            suffix="%"
            colorClass="bg-green-500"
            hint="System-wide average"
          />
          <ResilienceMetricCard
            title="Avg Error Rate"
            value={metricAverages.errorRate}
            suffix="%"
            colorClass="bg-red-500"
            hint="System-wide average"
          />
          <ResilienceMetricCard
            title="Avg p95 (Pre)"
            value={metricAverages.p95LatencyBefore}
            suffix=" ms"
            colorClass="bg-amber-500"
            hint="System-wide average"
            maxValue={2000}
          />
          <ResilienceMetricCard
            title="Avg p95 (After)"
            value={metricAverages.p95LatencyAfter}
            suffix=" ms"
            colorClass="bg-blue-500"
            hint="System-wide average"
            maxValue={2000}
          />
          <ResilienceMetricCard
            title="Avg CPU"
            value={metricAverages.cpuPercent}
            suffix="%"
            colorClass="bg-purple-500"
            hint="System-wide average"
          />
          <ResilienceMetricCard
            title="Avg Memory"
            value={metricAverages.memPercent}
            suffix="%"
            colorClass="bg-indigo-500"
            hint="System-wide average"
          />
          <ResilienceMetricCard
            title="Avg Restarts"
            value={metricAverages.restartCount}
            suffix=""
            colorClass="bg-slate-500"
            hint="System-wide average"
            maxValue={10}
          />
          <ResilienceMetricCard
            title="Avg Traffic Recov."
            value={metricAverages.trafficRecovery}
            suffix="%"
            colorClass="bg-emerald-500"
            hint="System-wide average"
          />
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
          />
        </div>
      )}
    </div>
  );
};

export default ResilienceMetrics;

