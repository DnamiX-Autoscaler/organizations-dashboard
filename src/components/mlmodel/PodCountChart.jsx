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
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg px-4 py-3 text-sm min-w-[160px]">
            <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">{label}</p>
            {actual?.value != null && (
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-1 rounded-full bg-violet-500" />
                        <span className="text-gray-500 dark:text-gray-400">Actual</span>
                    </div>
                    <span className="font-bold text-violet-600 dark:text-violet-400">{actual.value} pods</span>
                </div>
            )}
            {predicted?.value != null && (
                <div className="flex items-center justify-between gap-4 mt-1">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-0 border-t-2 border-dashed border-emerald-500" />
                        <span className="text-gray-500 dark:text-gray-400">Forecast</span>
                    </div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{predicted.value} pods</span>
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

    const allValues = data?.flatMap(d => [d.actual, d.predicted]).filter(v => v != null) || [0];
    const minVal = Math.max(0, Math.min(...allValues) - 2);
    const maxVal = Math.max(...allValues) + 3;

    const deltaColor = delta > 0 ? "text-orange-500" : delta < 0 ? "text-sky-500" : "text-emerald-500";
    const deltaIcon = delta > 0 ? "mdi:arrow-up-bold" : delta < 0 ? "mdi:arrow-down-bold" : "mdi:minus";

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-xl dark:bg-darkBackground dark:border-gray-700">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
                <div>
                    <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                        <Icon icon="mdi:chart-timeline-variant" className="w-5 h-5 text-violet-500" />
                        Pod Count Prediction
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        Solid = live pod count · Dashed = 5-min forecast
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex flex-col items-center px-3 py-1.5 bg-violet-50 dark:bg-violet-900/20 rounded-lg border border-violet-100 dark:border-violet-800/40">
                        <span className="text-[10px] text-violet-500 font-medium uppercase tracking-wide">Now</span>
                        <span className="text-lg font-bold text-violet-600 dark:text-violet-300">{currentPods}</span>
                        <span className="text-[10px] text-violet-400">pods</span>
                    </div>
                    <Icon icon={deltaIcon} className={`w-5 h-5 ${deltaColor}`} />
                    <div className="flex flex-col items-center px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800/40">
                        <span className="text-[10px] text-emerald-500 font-medium uppercase tracking-wide">T+5m</span>
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-300">{predictedPods}</span>
                        <span className="text-[10px] text-emerald-400">pods</span>
                    </div>
                    {/* Confidence badge */}
                    <div className={`flex flex-col items-center px-3 py-1.5 rounded-lg border ${
                        modelConfidence === "High" ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/40" :
                        modelConfidence === "Medium" ? "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/40" :
                        modelConfidence === "Low" ? "bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800/40" :
                        "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/40"
                    }`}>
                        <span className="text-[10px] font-medium uppercase tracking-wide text-gray-500">Conf.</span>
                        <div className="flex items-center gap-1 mt-0.5">
                            <div className={`w-2 h-2 rounded-full ${confCfg.dot} ${modelConfidence === "Critical" ? "animate-ping" : ""}`} />
                            <span className={`text-xs font-bold ${
                                modelConfidence === "High" ? "text-emerald-600 dark:text-emerald-300" :
                                modelConfidence === "Medium" ? "text-amber-600 dark:text-amber-300" :
                                modelConfidence === "Low" ? "text-orange-600 dark:text-orange-300" :
                                "text-red-600 dark:text-red-300"
                            }`}>{modelConfidence}</span>
                        </div>
                        <span className="text-[10px] text-gray-400">{oodScore}% OOD</span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.25} />
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} />
                            </linearGradient>
                            <linearGradient id="gradForecast" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
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
                                fill="#10b981"
                                fillOpacity={0.07}
                                stroke="#10b981"
                                strokeOpacity={0.15}
                            />
                        )}

                        {/* NOW marker */}
                        {forecastStart && (
                            <ReferenceLine
                                x={forecastStart}
                                stroke="#6366f1"
                                strokeWidth={2}
                                strokeDasharray="4 3"
                                label={{ value: "NOW", position: "insideTopLeft", fill: "#6366f1", fontSize: 10, fontWeight: 700 }}
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

                        {/* Actual pods — solid violet */}
                        <Line
                            type="monotone"
                            dataKey="actual"
                            stroke="#8b5cf6"
                            strokeWidth={2.5}
                            name="Actual Pods"
                            dot={<CustomDot color="#8b5cf6" />}
                            activeDot={{ r: 6, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }}
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

                        {/* Predicted — dashed emerald */}
                        <Line
                            type="monotone"
                            dataKey="predicted"
                            stroke="#10b981"
                            strokeWidth={2.5}
                            name="Forecast (+5min)"
                            strokeDasharray="7 4"
                            dot={<ForecastDot color="#10b981" />}
                            activeDot={{ r: 6, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
                            connectNulls={false}
                            animationDuration={400}
                        />

                        <Legend
                            wrapperStyle={{ paddingTop: 12 }}
                            iconType="plainline"
                            formatter={(value, entry) => (
                                <span style={{ color: entry.color, fontSize: 12, fontWeight: 500 }}>{value}</span>
                            )}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Bottom key */}
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700/50 pt-3">
                <div className="flex items-center gap-1.5">
                    <div className="w-8 h-0.5 bg-violet-500 rounded" />
                    <span>Actual (live data)</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-8 h-0 border-t-2 border-dashed border-emerald-500" />
                    <span>BiLSTM forecast</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-emerald-500/10 border border-emerald-300/40" />
                    <span>5-min forecast window</span>
                </div>
                {delta !== 0 && (
                    <span className={`ml-auto font-semibold ${deltaColor}`}>
                        {delta > 0 ? "+" : ""}{delta} pod{Math.abs(delta) !== 1 ? "s" : ""} forecast
                    </span>
                )}
            </div>
        </div>
    );
};

export default PodCountChart;
