import React, { useMemo, useState, useEffect } from "react";
import { getResilienceMetricsStream } from "../../../api/config/autoscaling/api";
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
  const [metricsData, setMetricsData] = useState([]);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  useEffect(() => {
    // Fetch all records for comprehensive monitoring
    const stream = getResilienceMetricsStream(
      (data) => {
        setIsLiveConnected(true);
        setMetricsData((prev) => {
          // For live status, replace any existing live status for this specific service
          if (data.type === "LIVE_STATUS") {
            const otherData = prev.filter(m =>
              !(m.type === "LIVE_STATUS" && m.deployment === data.deployment && m.project === data.project)
            );
            return [data, ...otherData].slice(0, 50);
          }

          const exists = prev.find(m => m._id === data._id);
          if (exists) return prev;
          return [data, ...prev].slice(0, 50);
        });
      },
      (error) => {
        console.error("Resilience metrics stream error:", error);
        setIsLiveConnected(false);
      },
      { all: true } // Get all records for comprehensive monitoring
    );

    return () => {
      stream.close();
      setIsLiveConnected(false);
    };
  }, []);

  const filteredData = metricsData.filter((item) => {
    if (selectedProject && item.project !== selectedProject) return false;
    if (selectedDeployment && item.deployment !== selectedDeployment) return false;
    if (selectedDecision && item.status !== selectedDecision) return false;
    return true;
  });

  const uniqueProjects = useMemo(
    () => [...new Set(metricsData.map((item) => item.project).filter(Boolean))],
    [metricsData]
  );
  const uniqueDeployments = useMemo(
    () => [...new Set(metricsData.filter(i => !selectedProject || i.project === selectedProject).map((item) => item.deployment))],
    [metricsData, selectedProject]
  );
  const uniqueDecisions = useMemo(
    () => [...new Set(metricsData.map((item) => item.status))],
    [metricsData]
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

    // Separate event data (full metrics) from live status (partial real-time updates)
    const eventData = metricsData.filter(item => item.type !== "LIVE_STATUS");
    const liveData = metricsData.filter(item => item.type === "LIVE_STATUS");

    // First, process event data to get all metrics
    eventData.forEach(item => {
      const proj = item.project || "Unassigned";
      const serv = item.deployment;

      if (!grouped[proj]) grouped[proj] = {};
      if (!grouped[proj][serv]) {
        grouped[proj][serv] = item.validation?.metricsEvaluation || [];
      }
    });

    // Then, merge live status data to update real-time metrics (CPU, Memory)
    liveData.forEach(item => {
      const proj = item.project || "Unassigned";
      const serv = item.deployment;

      if (!grouped[proj]) grouped[proj] = {};

      const liveMetrics = item.validation?.metricsEvaluation || [];
      
      if (!grouped[proj][serv]) {
        // If no event data exists, use live data as is
        grouped[proj][serv] = liveMetrics;
      } else {
        // Merge: update existing metrics with live values, keep others unchanged
        const existingMetrics = grouped[proj][serv];
        const mergedMetrics = existingMetrics.map(metric => {
          const liveUpdate = liveMetrics.find(m => m.metric === metric.metric);
          return liveUpdate ? { ...metric, value: liveUpdate.value, tier: liveUpdate.tier } : metric;
        });
        
        // Add any new metrics from live data that don't exist in event data
        liveMetrics.forEach(liveMetric => {
          if (!existingMetrics.find(m => m.metric === liveMetric.metric)) {
            mergedMetrics.push(liveMetric);
          }
        });

        grouped[proj][serv] = mergedMetrics;
      }
    });

    return grouped;
  }, [metricsData]);

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

    const extractMetric = (item, key) => {
      const m = item.validation?.metricsEvaluation?.find(e => e.metric === key);
      return m ? m.value : 0;
    };

    const avg = (key) => filteredData.reduce((sum, d) => sum + extractMetric(d, key), 0) / filteredData.length;

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

  const chartData = filteredData.map((item) => {
    const extractMetric = (key) => {
      const m = item.validation?.metricsEvaluation?.find(e => e.metric === key);
      return m ? m.value : null;
    };

    return {
      time: new Date(item.timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      timeStamp: item.timestamp,
      successRate: extractMetric("successRate"),
      errorRate: extractMetric("errorRate"),
      p95LatencyAfter: extractMetric("p95LatencyAfter"),
      cpuPercent: extractMetric("cpuPercent"),
      memPercent: extractMetric("memPercent"),
      trafficRecovery: extractMetric("trafficRecovery"),
      deployment: item.deployment,
      status: item.status,
      project: item.project,
    };
  });

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
        <div className="ml-auto flex items-center gap-3">
          {isLiveConnected && (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-medium text-green-700 dark:text-green-300">LIVE</span>
            </div>
          )}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold">{filteredData.length}</span> results
          </div>
        </div>
      </div>

      {activeTab === "hierarchical" && (
        <div className="space-y-4">
          {Object.entries(hierarchicalData)
            .filter(([proj]) => !selectedProject || proj === selectedProject)
            .map(([projectName, servicesData]) => {
              // Filter services based on selected deployment
              const filteredServices = selectedDeployment
                ? Object.fromEntries(
                    Object.entries(servicesData).filter(([serviceName]) => 
                      serviceName === selectedDeployment
                    )
                  )
                : servicesData;

              // Skip empty projects after filtering
              if (Object.keys(filteredServices).length === 0) return null;

              return (
                <ProjectMetricsAccordion
                  key={projectName}
                  projectName={projectName}
                  servicesData={filteredServices}
                />
              );
            })}
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

