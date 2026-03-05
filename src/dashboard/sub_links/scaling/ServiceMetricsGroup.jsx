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
                    metrics.map((metric, idx) => (
                        <div key={idx} className="bg-white dark:bg-darkBackgroundVery border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:border-primary/50 transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Icon icon={metric.icon || "mdi:chart-line"} className="w-5 h-5 text-primary" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">{metric.label}</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${metric.status === 'Healthy' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                    {metric.status}
                                </span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-gray-900 dark:text-white">{metric.value}</span>
                                <span className="text-sm font-bold text-gray-400">{metric.unit}</span>
                            </div>
                            {metric.history && (
                                <div className="mt-3 flex items-end gap-1 h-8">
                                    {metric.history.map((h, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 bg-primary/20 rounded-t-sm hover:bg-primary transition-colors cursor-pointer"
                                            style={{ height: `${(h / Math.max(...metric.history)) * 100}%` }}
                                            title={`Value: ${h}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
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
                        {/* ... keep others for backward compatibility ... */}
                    </>
                )}
            </div>
        </div>
    );
};

export default ServiceMetricsGroup;
