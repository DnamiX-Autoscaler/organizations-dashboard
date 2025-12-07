import React from 'react';
import { useRoute } from '../utils/RouteContext';

// Overview sub-components
import OverviewSummary from '../dashboard/sub_links/overview/Summary';
import OverviewActivity from '../dashboard/sub_links/overview/Activity';

// Metrics sub-components
import MetricsProcesses from '../dashboard/sub_links/metrics/Processes';
import MetricsPerformance from '../dashboard/sub_links/metrics/Performance';
import MetricsUsage from '../dashboard/sub_links/metrics/Usage';
import MetricsTrends from '../dashboard/sub_links/metrics/Trends';
import MetricsForecasting from '../dashboard/sub_links/metrics/Forecasting';

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
            usage: <MetricsUsage />,
            trends: <MetricsTrends />,
            forecasting: <MetricsForecasting />,
            // Add other metrics sub-routes here
        },
        // ...existing code...
    };

    return routes[activeMain]?.[activeSub] || null;
};

export default ContentRenderer;