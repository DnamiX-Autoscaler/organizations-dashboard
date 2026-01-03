import React from "react";
import ResilienceMetricCard from "../../../components/common/ResilienceMetricCard";

const ServiceMetricsGroup = ({ serviceName, metrics }) => {
    if (!metrics) return null;

    return (
        <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    {serviceName}
                </h4>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
            </div>
        </div>
    );
};

export default ServiceMetricsGroup;
