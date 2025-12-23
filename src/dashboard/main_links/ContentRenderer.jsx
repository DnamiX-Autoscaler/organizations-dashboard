import React from "react";
import { useRoute } from "../../utils/RouteContext";

// Overview sub-components
import OverviewSummary from "../sub_links/overview/Summary";
import OverviewActivity from "../sub_links/overview/Activity";

// Metrics sub-components
import MetricsPerformance from "../sub_links/metrics/Performance";
import MetricsProcesses from "../sub_links/metrics/Processes";
import LevelUsages from "../sub_links/metrics/LevelUsages";
import GraphCentrality from "../sub_links/metrics/GraphCentrality";
import Indexes from "../sub_links/metrics/Indexes";
import Explore from "../sub_links/metrics/Explore";
import RunningPods from "../sub_links/metrics/RunningPods";
import RunningServices from "../sub_links/metrics/RunningServices";
import RunningPrometheusIPs from "../sub_links/metrics/RunningPrometheusIPs";
import Configuratons from "../sub_links/metrics/Configuratons";
import MonitoringNotes from "../sub_links/metrics/MonitoringNotes";
import MetricsExport from "../sub_links/metrics/MetricsExport";

// Scaling sub-components
import ScalingEvent from "../sub_links/scaling/ScalingEvent";
import RollbackHistory from "../sub_links/scaling/RollbackHistory";
import ResilienceMetrics from "../sub_links/scaling/ResilienceMetrics";
import ThresholdPolicyConfig from "../sub_links/scaling/ThresholdPolicyConfig";
import RealTimeScaling from "../sub_links/scaling/RealTimeScaling";
import Alerts from "../sub_links/scaling/Alerts";
import Reports from "../sub_links/scaling/Reports";
import CostResourceImpact from "../sub_links/scaling/CostResourceImpact";

// Add more imports as needed...

const ContentRenderer = () => {
  const { activeMain, activeSub } = useRoute();

  // Route configuration
  const routes = {
    overview: {
      summary: <OverviewSummary />,
      activity: <OverviewActivity />,
    },
    metrics: {
      processes: <MetricsProcesses />,
      performance: <MetricsPerformance />,
      [`level-usages`]: <LevelUsages />,
      [`graph-centrality`]: <GraphCentrality />,
      indexes: <Indexes />,
      configurations: <Configuratons />,
      explore: <Explore />,
      [`running-pods`]: <RunningPods />,
      services: <RunningServices />,
      [`prometheus-ips`]: <RunningPrometheusIPs />,
      [`monitoring-notes`]: <MonitoringNotes />,
      [`data-exporter`]: <MetricsExport />
    },
    scaling: {
      event: <ScalingEvent />,
      metrics: <ResilienceMetrics />,
      rollback: <RollbackHistory />,
      "real-time-scaling": <RealTimeScaling />,
      config: <ThresholdPolicyConfig />,
      alerts: <Alerts />,
      reports: <Reports />,
      cost: <CostResourceImpact />,
      // Add more scaling sub-components here...
    },
    projects: {
      // Add project sub-components here...
    },
    // Add more main menu routes here...
  };

  // Get the component to render
  const ComponentToRender = routes[activeMain]?.[activeSub];

  if (!ComponentToRender) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Page Not Found
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {activeMain} / {activeSub}
          </p>
        </div>
      </div>
    );
  }

  return ComponentToRender;
};

export default ContentRenderer;
