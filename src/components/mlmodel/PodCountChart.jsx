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
    ReferenceArea,
} from "recharts";
import { Icon } from "@iconify/react";
import useMLModel from "../../services/useMLModel";

const CONF_CONFIG = {
    High: { label: "High Confidence", pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300", dot: "bg-emerald-500" },
    Medium: { label: "Medium Confidence", pill: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300", dot: "bg-amber-400" },
    Low: { label: "Low Confidence", pill: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300", dot: "bg-orange-500" },
    Critical: { label: "Critical", pill: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300", dot: "bg-red-500" },
};

const CustomDot = ({ cx, cy, payload, color }) => {
    if (payload.actual === null || payload.actual === undefined) return null;
    return <circle cx={cx} cy={cy} r={4} fill={color} stroke="#fff" strokeWidth={2} />;
};

const ForecastDot = ({ cx, cy, payload, color }) => {
    if (payload.actual !== null && payload.actual !== undefined) return null;
    if (payload.predicted === null || payload.predicted === undefined) return null;
    return <circle cx={cx} cy={cy} r={4} fill={color} stroke="#fff" strokeWidth={2} />;
};

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const actual = payload.find((p) => p.dataKey === "actual");
    const predicted = payload.find((p) => p.dataKey === "predicted");
    const hpa = payload.find((p) => p.dataKey === "hpa");
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg px-4 py-3 text-sm min-w-[200px]">
            <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">{label}</p>
            {actual?.value != null && (
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-1 rounded-full" style={{ backgroundColor: '#84006A' }} />
                        <span className="text-gray-500 dark:text-gray-400">Running Now</span>
                    </div>
                    <span className="font-bold" style={{ color: '#84006A' }}>{actual.value} pods</span>
                </div>
            )}
            {hpa?.value != null && (
                <div className="flex items-center justify-between gap-4 mt-1">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-0 border-t-2 border-dashed border-amber-400" />
                        <span className="text-gray-500 dark:text-gray-400">HPA Reactive</span>
                    </div>
                    <span className="font-bold text-amber-500 dark:text-amber-400">{hpa.value} pods</span>
                </div>
            )}
            {predicted?.value != null && (
                <div className="flex items-center justify-between gap-4 mt-1">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-0 border-t-2 border-dashed border-cyan-500" />
                        <span className="text-gray-500 dark:text-gray-400">AI Forecast (+5 min)</span>
                    </div>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400">{predicted.value} pods</span>
                </div>
            )}
            {actual?.value != null && hpa?.value != null && actual.value > hpa.value && (
                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-1.5 text-xs">
                        <div className="w-3 h-2.5 rounded-sm bg-red-400/40" />
                        <span className="font-semibold text-red-500">HPA Latency Gap: {actual.value - hpa.value} pod{actual.value - hpa.value !== 1 ? 's' : ''}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">Under-provisioned during HPA reaction delay</p>
                </div>
            )}
        </div>
    );
};

const PodCountChart = ({ data = [] }) => {
    const { oodScore = 0, modelConfidence = "High" } = useMLModel();
    const confCfg = CONF_CONFIG[modelConfidence] ?? CONF_CONFIG.High;

    const nowIdx = data.findLastIndex((d) => d.actual !== null);
    const nowPoint = nowIdx >= 0 ? data[nowIdx] : null;
    const forecastStart = nowPoint?.time ?? null;
    const forecastEnd = data[data.length - 1]?.time ?? null;

    const currentPods = nowPoint?.actual ?? 0;
    const predictedPods = data[data.length - 1]?.predicted ?? 0;
    const delta = predictedPods - currentPods;

    const allValues = data?.flatMap(d => [d.actual, d.predicted, d.hpa]).filter(v => v != null) || [0];
    const minVal = Math.max(0, Math.min(...allValues) - 2);
    const maxVal = Math.max(...allValues) + 3;

    // Compute HPA latency gap: where actual > hpa (HPA hasn't caught up yet)
    const chartData = data.map(d => ({
        ...d,
        hpaGap: (d.actual != null && d.hpa != null && d.actual > d.hpa) ? d.actual : null,
        hpaGapBase: (d.actual != null && d.hpa != null && d.actual > d.hpa) ? d.hpa : null,
    }));

    const deltaColor = delta > 0 ? "text-orange-500" : delta < 0 ? "text-sky-500" : "text-emerald-500";
    const deltaIcon = delta > 0 ? "mdi:arrow-up-bold" : delta < 0 ? "mdi:arrow-down-bold" : "mdi:minus";

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-xl dark:bg-darkBackground dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight">
                    Pod Count
                </h3>
                <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                        <span className="text-gray-400">Now</span>
                        <span className="font-semibold tabular-nums" style={{ color: '#84006A' }}>{currentPods}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-gray-400">T+5m</span>
                        <span className="font-semibold text-cyan-500 tabular-nums">{predictedPods}</span>
                    </div>
                    {delta !== 0 && (
                        <span className={`font-medium ${deltaColor}`}>
                            {delta > 0 ? "+" : ""}{delta}
                        </span>
                    )}
                </div>
            </div>

            {/* Chart */}
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#84006A" stopOpacity={0.25} />
                                <stop offset="100%" stopColor="#84006A" stopOpacity={0.02} />
                            </linearGradient>
                            <linearGradient id="gradForecast" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.4} />

                        <XAxis
                            dataKey="time"
                            stroke="#d1d5db"
                            tick={{ fill: "#9ca3af", fontSize: 11 }}
                            tickLine={false}
                            axisLine={{ stroke: "#e5e7eb" }}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            domain={[minVal, maxVal]}
                            stroke="#d1d5db"
                            tick={{ fill: "#9ca3af", fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            label={{ value: "Pods", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "#9ca3af" } }}
                            width={40}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        {/* Shaded forecast zone */}
                        {forecastStart && forecastEnd && forecastStart !== forecastEnd && (
                            <ReferenceArea
                                x1={forecastStart}
                                x2={forecastEnd}
                                fill="#06b6d4"
                                fillOpacity={0.07}
                                stroke="#06b6d4"
                                strokeOpacity={0.15}
                            />
                        )}

                        {/* NOW marker */}
                        {forecastStart && (
                            <ReferenceLine
                                x={forecastStart}
                                stroke="#84006A"
                                strokeWidth={2}
                                strokeDasharray="4 3"
                                label={{ value: "NOW", position: "insideTopLeft", fill: "#84006A", fontSize: 10, fontWeight: 700 }}
                            />
                        )}

                        {/* Actual area fill */}
                        <Area
                            type="monotone"
                            dataKey="actual"
                            fill="url(#gradActual)"
                            stroke="none"
                            animationDuration={400}
                            connectNulls={false}
                        />

                        {/* HPA Latency Gap — red shaded area where actual > hpa */}
                        <Area
                            type="monotone"
                            dataKey="hpaGap"
                            fill="#ef4444"
                            fillOpacity={0.15}
                            stroke="#ef4444"
                            strokeWidth={0}
                            animationDuration={400}
                            connectNulls={false}
                            legendType="none"
                            name="HPA Latency Gap"
                        />
                        <Area
                            type="monotone"
                            dataKey="hpaGapBase"
                            fill="#ffffff"
                            fillOpacity={0}
                            stroke="none"
                            animationDuration={400}
                            connectNulls={false}
                            legendType="none"
                        />

                        {/* Actual pods — solid brand primary */}
                        <Line
                            type="monotone"
                            dataKey="actual"
                            stroke="#84006A"
                            strokeWidth={2.5}
                            name="Actual Pods"
                            dot={<CustomDot color="#84006A" />}
                            activeDot={{ r: 6, fill: "#84006A", stroke: "#fff", strokeWidth: 2 }}
                            animationDuration={400}
                            connectNulls={false}
                        />

                        {/* Forecast area fill */}
                        <Area
                            type="monotone"
                            dataKey="predicted"
                            fill="url(#gradForecast)"
                            stroke="none"
                            connectNulls={false}
                            animationDuration={400}
                        />

                        {/* Predicted — dashed cyan */}
                        <Line
                            type="monotone"
                            dataKey="predicted"
                            stroke="#06b6d4"
                            strokeWidth={2.5}
                            name="AI Forecast (+5min)"
                            strokeDasharray="7 4"
                            dot={<ForecastDot color="#06b6d4" />}
                            activeDot={{ r: 6, fill: "#06b6d4", stroke: "#fff", strokeWidth: 2 }}
                            connectNulls={false}
                            animationDuration={400}
                        />

                        {/* HPA Reactive baseline — dashed orange, historical only */}
                        <Line
                            type="monotone"
                            dataKey="hpa"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            name="HPA Reactive"
                            strokeDasharray="4 6"
                            dot={false}
                            activeDot={{ r: 5, fill: "#f59e0b", stroke: "#fff", strokeWidth: 2 }}
                            connectNulls={false}
                            animationDuration={400}
                        />

                        {/* Remove Recharts built-in legend — using custom bottom key instead */}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Bottom key */}
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700/50 pt-3">
                <div className="flex items-center gap-1.5">
                    <div className="w-5 h-0.5 rounded" style={{ backgroundColor: '#84006A' }} />
                    <span>Actual</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-5 h-0 border-t border-dashed border-cyan-500" />
                    <span>AI Forecast</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-5 h-0 border-t border-dashed border-amber-400" />
                    <span>HPA Baseline</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-5 h-1.5 rounded-sm bg-red-400/30" />
                    <span>Latency Gap</span>
                </div>
            </div>
        </div>
    );
};

export default PodCountChart;
