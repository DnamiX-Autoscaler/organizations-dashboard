import React, { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import TabSection from '../../common/TabSection';
import Graph from '../../common/Graph';

const ExploreGraph = ({ queryData, queryExpression }) => {
    const [activeTab, setActiveTab] = useState('raw');

    const tabs = [
        { key: 'raw', label: 'Raw Metrics', icon: 'mdi:code-json' },
        { key: 'graph', label: 'Graph', icon: 'mdi:chart-line' }
    ];

    // Transform data for graph visualization
    const graphData = useMemo(() => {
        if (!queryData?.data?.result || queryData.data.result.length === 0) {
            return [];
        }

        const timeSeriesMap = new Map();

        queryData.data.result.forEach((timeSeries, seriesIndex) => {
            const metricLabel = formatMetricLabel(timeSeries.metric, seriesIndex);

            timeSeries.values.forEach(([timestamp, value]) => {
                const timeKey = formatTimestamp(timestamp);

                if (!timeSeriesMap.has(timeKey)) {
                    timeSeriesMap.set(timeKey, {
                        time: timeKey,
                        timeStamp: timestamp * 1000
                    });
                }

                timeSeriesMap.get(timeKey)[metricLabel] = parseFloat(value);
            });
        });

        return Array.from(timeSeriesMap.values());
    }, [queryData]);

    // Get all metric series for graphing
    const metricKeys = useMemo(() => {
        if (!graphData || graphData.length === 0) return [];

        return Object.keys(graphData[0]).filter(key =>
            key !== 'time' && key !== 'timeStamp'
        );
    }, [graphData]);

    // Format metric label from metric object
    const formatMetricLabel = (metric, index) => {
        const labels = Object.entries(metric)
            .filter(([key]) => key !== '__name__')
            .map(([key, value]) => `${key}="${value}"`)
            .join(', ');

        if (labels) {
            return `{${labels}}`;
        }

        return metric.__name__ || `Series ${index + 1}`;
    };

    // Format timestamp
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    // Colors for multiple series
    const seriesColors = [
        '#84006A', '#FF6B6B', '#4ECDC4', '#45B7D1',
        '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'
    ];

    return (
        <div className="space-y-6">
            {/* Query Info Header */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <Icon icon="mdi:information" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-400">
                        Query Results
                    </p>
                    <p className="mt-1 text-xs font-mono text-blue-600 dark:text-blue-300 break-all">
                        {queryExpression}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-blue-600 dark:text-blue-300">
                        <span>
                            <strong>Series:</strong> {queryData?.data?.result?.length || 0}
                        </span>
                        <span>
                            <strong>Type:</strong> {queryData?.data?.resultType || 'N/A'}
                        </span>
                        <span>
                            <strong>Status:</strong> {queryData?.status || 'N/A'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <TabSection
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Tab Content */}
            {activeTab === 'raw' && (
                <div className="bg-white dark:bg-darkBackground border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-darkBackgroundVery">
                        <div className="flex items-center gap-2">
                            <Icon icon="mdi:code-json" className="w-5 h-5 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Raw Prometheus Response
                            </span>
                        </div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(JSON.stringify(queryData, null, 2));
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-darkBackground border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <Icon icon="mdi:content-copy" className="w-4 h-4" />
                            Copy
                        </button>
                    </div>

                    <div className="p-4 overflow-auto max-h-[600px]">
                        <pre className="text-xs font-mono text-gray-800 dark:text-gray-200">
                            {JSON.stringify(queryData, null, 2)}
                        </pre>
                    </div>

                    {/* Metrics Summary */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-darkBackgroundVery">
                        <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Time Series Data:
                        </p>
                        <div className="space-y-3">
                            {queryData?.data?.result?.map((series, idx) => (
                                <div key={idx} className="p-3 bg-white dark:bg-darkBackground border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <div className="flex items-start justify-between mb-2">
                                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                                            Series {idx + 1}
                                        </p>
                                        <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">
                                            {series.values?.length || 0} data points
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            <strong>Metric:</strong> {series.metric?.__name__ || 'N/A'}
                                        </p>
                                        {Object.entries(series.metric || {})
                                            .filter(([key]) => key !== '__name__')
                                            .map(([key, value]) => (
                                                <p key={key} className="text-xs text-gray-600 dark:text-gray-400">
                                                    <strong>{key}:</strong> {value}
                                                </p>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'graph' && (
                <div className="space-y-4">
                    {metricKeys.length > 0 ? (
                        metricKeys.map((metricKey, index) => (
                            <div key={metricKey} className="space-y-2">
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-darkBackgroundVery rounded-lg">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: seriesColors[index % seriesColors.length] }}
                                    />
                                    <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                                        {metricKey}
                                    </span>
                                </div>
                                <Graph
                                    data={graphData}
                                    xKey="time"
                                    yKey={metricKey}
                                    chartType="line"
                                    color={seriesColors[index % seriesColors.length]}
                                    height={300}
                                    showControls={true}
                                    showStats={true}
                                    enableAxisSwap={true}
                                    enableTypeToggle={true}
                                    enableTimeRange={false}
                                    enableLiveToggle={false}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-darkBackground border border-gray-200 dark:border-gray-700 rounded-lg">
                            <Icon icon="mdi:chart-line-variant" className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                No data available for visualization
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExploreGraph;
