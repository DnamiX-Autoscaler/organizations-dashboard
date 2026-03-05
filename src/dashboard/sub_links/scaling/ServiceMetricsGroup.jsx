import React from "react";
import { Icon } from "@iconify/react";
import ResilienceMetricCard from "../../../components/common/ResilienceMetricCard";

const ServiceMetricsGroup = ({ serviceName, metrics }) => {
    if (!metrics) return null;

    return (
        <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-primary rounded-full"></div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    {serviceName}
                </h4>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {Array.isArray(metrics) ? (
                    metrics.map((metric, idx) => {
                        // Format metric name for display
                        const formatMetricName = (name) => {
                            const nameMap = {
                                'successRate': 'Success Rate',
                                'errorRate': 'Error Rate',
                                'p95LatencyBefore': 'p95 Latency (Pre)',
                                'p95LatencyAfter': 'p95 Latency (Post)',
                                'cpuPercent': 'CPU Usage',
                                'memPercent': 'Memory Usage',
                                'restartCount': 'Restart Count',
                                'trafficRecovery': 'Traffic Recovery'
                            };
                            return nameMap[name] || name;
                        };

                        // Determine color based on metric type
                        const getColorClass = (metricName) => {
                            if (metricName.includes('success') || metricName.includes('Recovery')) return 'bg-green-500';
                            if (metricName.includes('error')) return 'bg-red-500';
                            if (metricName.includes('cpu') || metricName.includes('CPU')) return 'bg-purple-500';
                            if (metricName.includes('mem') || metricName.includes('Memory')) return 'bg-indigo-500';
                            if (metricName.includes('Latency') || metricName.includes('p95')) return 'bg-amber-500';
                            if (metricName.includes('restart')) return 'bg-slate-500';
                            return 'bg-blue-500';
                        };

                        // Determine suffix based on metric type
                        const getSuffix = (metricName) => {
                            if (metricName.includes('Percent') || metricName.includes('Rate') || metricName.includes('Recovery')) return '%';
                            if (metricName.includes('Latency') || metricName.includes('p95')) return ' ms';
                            return '';
                        };

                        // Determine max value for certain metrics
                        const getMaxValue = (metricName) => {
                            if (metricName.includes('Latency') || metricName.includes('p95')) return 2000;
                            if (metricName.includes('restart')) return 10;
                            return undefined;
                        };

                        const metricName = metric.metric || metric.label || 'Unknown';
                        
                        return (
                            <ResilienceMetricCard
                                key={idx}
                                title={formatMetricName(metricName)}
                                value={metric.value || 0}
                                suffix={getSuffix(metricName)}
                                colorClass={getColorClass(metricName)}
                                hint={metric.tier || metric.status || ''}
                                maxValue={getMaxValue(metricName)}
                            />
                        );
                    })
                ) : (
                    <>
                        <ResilienceMetricCard
                            title="Success Rate"
                            value={metrics.successRate}
                            suffix="%"
                            colorClass="bg-green-500"
                            hint="Higher is better"
                        />
                        <ResilienceMetricCard
                            title="Error Rate"
                            value={metrics.errorRate}
                            suffix="%"
                            colorClass="bg-red-500"
                            hint="Lower is better"
                        />
                        <ResilienceMetricCard
                            title="Latency (Pre)"
                            value={metrics.p95LatencyBefore}
                            suffix=" ms"
                            colorClass="bg-amber-500"
                            hint="Original p95"
                            maxValue={2000}
                        />
                        <ResilienceMetricCard
                            title="Latency (Post)"
                            value={metrics.p95LatencyAfter}
                            suffix=" ms"
                            colorClass="bg-blue-500"
                            hint="Current p95"
                            maxValue={2000}
                        />
                        <ResilienceMetricCard
                            title="CPU %"
                            value={metrics.cpuPercent}
                            suffix="%"
                            colorClass="bg-purple-500"
                            hint="Avg utilization"
                        />
                        <ResilienceMetricCard
                            title="Memory %"
                            value={metrics.memPercent}
                            suffix="%"
                            colorClass="bg-indigo-500"
                            hint="Avg utilization"
                        />
                        <ResilienceMetricCard
                            title="Restart Count"
                            value={metrics.restartCount}
                            suffix=""
                            colorClass="bg-slate-500"
                            hint="Total restarts"
                            maxValue={10}
                        />
                        <ResilienceMetricCard
                            title="Traffic Recovery"
                            value={metrics.trafficRecovery}
                            suffix="%"
                            colorClass="bg-emerald-500"
                            hint="Post-event recovery"
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default ServiceMetricsGroup;
