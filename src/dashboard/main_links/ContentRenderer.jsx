import React from "react";
import { useRoute } from "../../utils/RouteContext";

// Overview sub-components
import OverviewSummary from "../sub_links/overview/Summary";
import OverviewActivity from "../sub_links/overview/Activity";

// Metrics sub-components
import MetricsPerformance from "../sub_links/metrics/Performance";
import MetricsUsage from "../sub_links/metrics/Usage";
import MetricsTrends from "../sub_links/metrics/Trends";
import MetricsForecasting from "../sub_links/metrics/Forecasting";
import MetricsProcesses from "../sub_links/metrics/Processes";
import LevelUsages from "../sub_links/metrics/LevelUsages";

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
      trends: <MetricsTrends />,
      forecasting: <MetricsForecasting />,
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
