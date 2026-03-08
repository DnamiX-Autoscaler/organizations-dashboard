import React, { useState } from "react";
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import { Icon } from "@iconify/react";

const PerformanceMetrics = ({ data }) => {
    const [activeView, setActiveView] = useState("throughput");

    const views = {
        throughput: { label: "Throughput", icon: "mdi:speedometer" },
        latency: { label: "Latency", icon: "mdi:timer-outline" },
        errors: { label: "Errors", icon: "mdi:alert-circle-outline" },
    };

    const latestLatency = data?.length > 0 ? data[data.length - 1]?.latency?.toFixed(0) : 0;
    const latestRps = data?.length > 0 ? data[data.length - 1]?.requests?.toFixed(0) : 0;
    const latestError = data?.length > 0 ? data[data.length - 1]?.errorRate?.toFixed(2) : 0;
    const avgError = data?.length > 0
        ? (data.reduce((s, d) => s + (d.errorRate || 0), 0) / data.length).toFixed(2)
        : 0;

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                        <Icon icon="mdi:speedometer" className="w-5 h-5 text-primary" />
                        System Performance
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Live: <span className="font-semibold text-violet-500">{latestRps} rps</span> &nbsp;·&nbsp;
                        P95: <span className="font-semibold text-emerald-500">{latestLatency}ms</span> &nbsp;·&nbsp;
                        Err: <span className={`font-semibold ${parseFloat(latestError) > 1 ? 'text-red-500' : 'text-teal-500'}`}>{latestError}%</span>
                    </p>
                </div>
                <div className="flex gap-2">
                    {Object.entries(views).map(([key, v]) => (
                        <button
                            key={key}
                            onClick={() => setActiveView(key)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${activeView === key
                                ? "bg-primary text-white shadow-md"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-darkBackgroundVery dark:text-gray-400 dark:hover:bg-gray-700"
                            }`}
                        >
                            <Icon icon={v.icon} className="w-3 h-3" />
                            {v.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                    {activeView === "throughput" ? (
                        <ComposedChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.08} />
                            <XAxis dataKey="time" stroke="#9CA3AF" style={{ fontSize: "10px" }} tick={{ fill: "#9CA3AF" }} tickLine={false} />
                            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" style={{ fontSize: "10px" }} tick={{ fill: "#9CA3AF" }} tickLine={false} />
                            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" style={{ fontSize: "10px" }} tick={{ fill: "#9CA3AF" }} tickLine={false} />
                            <Tooltip cursor={{ fill: "rgba(99,102,241,0.05)" }} contentStyle={{ backgroundColor: "rgba(255,255,255,0.97)", borderRadius: "8px", border: "1px solid #e5e7eb" }} />
                            <Legend wrapperStyle={{ fontSize: "11px" }} />
                            <Bar yAxisId="left" dataKey="requests" name="Requests/sec" fill="#8b5cf6" radius={[3, 3, 0, 0]} barSize={14} opacity={0.85} />
                            <Line yAxisId="right" type="monotone" dataKey="latency" name="Latency P95 (ms)" stroke="#10b981" strokeWidth={2} dot={false} />
                        </ComposedChart>
                    ) : activeView === "latency" ? (
                        <ComposedChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.08} />
                            <XAxis dataKey="time" stroke="#9CA3AF" style={{ fontSize: "10px" }} tick={{ fill: "#9CA3AF" }} tickLine={false} />
                            <YAxis stroke="#9CA3AF" style={{ fontSize: "10px" }} tick={{ fill: "#9CA3AF" }} tickLine={false} label={{ value: "ms", angle: -90, position: "insideLeft", style: { fontSize: "10px", fill: "#9CA3AF" } }} />
                            <Tooltip contentStyle={{ backgroundColor: "rgba(255,255,255,0.97)", borderRadius: "8px", border: "1px solid #e5e7eb" }} />
                            <Legend wrapperStyle={{ fontSize: "11px" }} />
                            <Bar dataKey="latency" name="Latency P95 (ms)" fill="#10b981" radius={[3, 3, 0, 0]} barSize={14} opacity={0.85} />
                        </ComposedChart>
                    ) : (
                        <ComposedChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.08} />
                            <XAxis dataKey="time" stroke="#9CA3AF" style={{ fontSize: "10px" }} tick={{ fill: "#9CA3AF" }} tickLine={false} />
                            <YAxis stroke="#9CA3AF" style={{ fontSize: "10px" }} tick={{ fill: "#9CA3AF" }} tickLine={false} label={{ value: "%", angle: -90, position: "insideLeft", style: { fontSize: "10px", fill: "#9CA3AF" } }} />
                            <Tooltip contentStyle={{ backgroundColor: "rgba(255,255,255,0.97)", borderRadius: "8px", border: "1px solid #e5e7eb" }} formatter={(v) => [`${parseFloat(v).toFixed(3)}%`, "Error Rate"]} />
                            <Legend wrapperStyle={{ fontSize: "11px" }} />
                            <Bar dataKey="errorRate" name="Error Rate (%)" fill="#ef4444" radius={[3, 3, 0, 0]} barSize={14} opacity={0.85} />
                            <Line type="monotone" dataKey={() => parseFloat(avgError)} name={`Avg (${avgError}%)`} stroke="#f59e0b" strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
                        </ComposedChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PerformanceMetrics;
