import React, { useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Icon } from "@iconify/react";

const ResourceMetrics = ({ data }) => {
    const [activeMetric, setActiveMetric] = useState("cpu");

    const metrics = {
        cpu: { label: "CPU Usage (%)", color: "#3b82f6", icon: "mdi:cpu-64-bit" },
        memory: { label: "Memory Usage (MB)", color: "#f59e0b", icon: "mdi:memory" },
        network: { label: "Inbound RPS (mesh)", color: "#ec4899", icon: "mdi:transit-connection-variant" },
    };

    const currentMetric = metrics[activeMetric];

    return (
        <div className="flex-1 p-6 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                        <Icon icon="mdi:monitor-dashboard" className="w-5 h-5 text-primary" />
                        Resource Utilization
                    </h3>
                </div>
                <div className="flex gap-2">
                    {Object.keys(metrics).map((key) => (
                        <button
                            key={key}
                            onClick={() => setActiveMetric(key)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${activeMetric === key
                                    ? "bg-primary text-white shadow-md"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-darkBackgroundVery dark:text-gray-400 dark:hover:bg-gray-700"
                                }`}
                        >
                            <Icon icon={metrics[key].icon} className="w-3 h-3" />
                            {key.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id={`color-${activeMetric}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                        <XAxis dataKey="time" stroke="#9CA3AF" style={{ fontSize: "10px" }} tick={{ fill: "#9CA3AF" }} />
                        <YAxis stroke="#9CA3AF" style={{ fontSize: "10px" }} tick={{ fill: "#9CA3AF" }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                borderRadius: "6px",
                                border: "none",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey={activeMetric}
                            stroke={currentMetric.color}
                            fillOpacity={1}
                            fill={`url(#color-${activeMetric})`}
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span>Avg: {Math.round(data.reduce((acc, curr) => acc + curr[activeMetric], 0) / data.length)}</span>
                <span>Max: {Math.max(...data.map(d => d[activeMetric]))}</span>
            </div>
        </div>
    );
};

export default ResourceMetrics;
