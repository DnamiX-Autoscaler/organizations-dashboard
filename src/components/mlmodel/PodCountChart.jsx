import React from "react";
import {
    ComposedChart,
    Line,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import { Icon } from "@iconify/react";

const PodCountChart = ({ data }) => {
    // Find the transition point (last actual value)
    const lastActualIndex = data?.findIndex(d => d.actual === null) - 1;
    const currentTime = lastActualIndex >= 0 ? data[lastActualIndex]?.time : null;
    const currentPods = lastActualIndex >= 0 ? data[lastActualIndex]?.actual : 0;
    const predictedPods = data?.[data.length - 1]?.predicted || 0;

    // Calculate domain for Y axis with some padding
    const allValues = data?.flatMap(d => [d.actual, d.predicted]).filter(v => v != null) || [0];
    const minVal = Math.max(0, Math.min(...allValues) - 1);
    const maxVal = Math.max(...allValues) + 2;

    return (
        <div className="flex-1 p-6 bg-white border border-gray-200 rounded-xl dark:bg-darkBackground dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                        <Icon icon="mdi:chart-timeline-variant" className="w-5 h-5 text-violet-500" />
                        Pod Count Prediction
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Actual pods vs 5-minute forecast trajectory
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                        <div className="w-3 h-0.5 bg-violet-500" />
                        <span className="text-xs font-medium text-violet-700 dark:text-violet-300">
                            Now: {currentPods} pods
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                        <div className="w-3 h-0.5 bg-emerald-500 border-dashed" style={{ borderTop: '2px dashed #10b981', height: 0 }} />
                        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                            +5min: {predictedPods} pods
                        </span>
                    </div>
                </div>
            </div>

            <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                            </linearGradient>
                            <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />

                        <XAxis
                            dataKey="time"
                            stroke="#9CA3AF"
                            style={{ fontSize: "11px" }}
                            tick={{ fill: "#6B7280" }}
                            tickLine={false}
                            axisLine={{ stroke: '#e5e7eb' }}
                        />

                        <YAxis
                            domain={[minVal, maxVal]}
                            stroke="#9CA3AF"
                            style={{ fontSize: "11px" }}
                            tick={{ fill: "#6B7280" }}
                            tickLine={false}
                            axisLine={{ stroke: '#e5e7eb' }}
                            label={{ value: 'Pods', angle: -90, position: 'insideLeft', style: { fontSize: '11px', fill: '#9CA3AF' } }}
                        />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(255, 255, 255, 0.98)",
                                borderRadius: "10px",
                                border: "none",
                                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15)",
                                padding: "12px 16px"
                            }}
                            labelStyle={{ color: "#111827", fontWeight: "600", marginBottom: "8px", fontSize: "13px" }}
                            formatter={(value, name) => {
                                if (value === null) return ['-', name];
                                return [
                                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{value} pods</span>,
                                    name
                                ];
                            }}
                        />

                        <Legend
                            wrapperStyle={{ paddingTop: "15px" }}
                            formatter={(value) => (
                                <span className="text-sm text-gray-600 dark:text-gray-300">{value}</span>
                            )}
                        />

                        {/* Reference line for "now" */}
                        {currentTime && (
                            <ReferenceLine
                                x={currentTime}
                                stroke="#6366f1"
                                strokeDasharray="4 4"
                                strokeWidth={2}
                                label={{
                                    value: 'NOW',
                                    position: 'top',
                                    fill: '#6366f1',
                                    fontSize: 10,
                                    fontWeight: 600
                                }}
                            />
                        )}

                        {/* Actual pods - solid area + line */}
                        <Area
                            type="monotone"
                            dataKey="actual"
                            fill="url(#actualGradient)"
                            stroke="transparent"
                            animationDuration={300}
                        />
                        <Line
                            type="monotone"
                            dataKey="actual"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            name="Actual Pods"
                            dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 2, stroke: "#fff" }}
                            activeDot={{ r: 7, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }}
                            animationDuration={300}
                        />

                        {/* Predicted pods - dashed line with area */}
                        <Area
                            type="monotone"
                            dataKey="predicted"
                            fill="url(#predictedGradient)"
                            stroke="transparent"
                            connectNulls={true}
                            animationDuration={300}
                        />
                        <Line
                            type="monotone"
                            dataKey="predicted"
                            stroke="#10b981"
                            strokeWidth={3}
                            name="Predicted (+5min)"
                            strokeDasharray="8 4"
                            dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                            activeDot={{ r: 7, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
                            connectNulls={true}
                            animationDuration={300}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PodCountChart;
