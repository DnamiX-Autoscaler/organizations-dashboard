import React, { useMemo } from "react";
import {
    ComposedChart,
    Area,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import { Icon } from "@iconify/react";

/**
 * AccuracyTrendChart
 * Shows rolling MAE & RMSE over the last N predictions.
 * Highlights drift if recent MAE has increased >30% vs prior window.
 */
const AccuracyTrendChart = ({ accuracyHistory = [] }) => {
    const displayData = accuracyHistory.slice(-80);

    const stats = useMemo(() => {
        if (displayData.length === 0)
            return { currentMae: 0, avgMae: 0, minMae: 0, driftAlert: false, trend: "stable" };

        const maes = displayData.map((d) => d.mae);
        const avg = maes.reduce((s, v) => s + v, 0) / maes.length;
        const current = maes[maes.length - 1] || 0;
        const min = Math.min(...maes);

        let driftAlert = false;
        let trend = "stable";
        if (displayData.length >= 20) {
            const recentAvg =
                maes.slice(-10).reduce((s, v) => s + v, 0) / 10;
            const prevAvg =
                maes.slice(-20, -10).reduce((s, v) => s + v, 0) / 10;
            if (recentAvg > prevAvg * 1.3) {
                driftAlert = true;
                trend = "degrading";
            } else if (recentAvg < prevAvg * 0.85) {
                trend = "improving";
            }
        }

        return { currentMae: current, avgMae: avg, minMae: min, driftAlert, trend };
    }, [displayData]);

    const trendIcon =
        stats.trend === "improving"
            ? "mdi:trending-down"
            : stats.trend === "degrading"
            ? "mdi:trending-up"
            : "mdi:trending-neutral";
    const trendColor =
        stats.trend === "improving"
            ? "text-emerald-500"
            : stats.trend === "degrading"
            ? "text-red-500"
            : "text-gray-400";

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-xl dark:bg-darkBackground dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                        <Icon
                            icon="mdi:chart-timeline-variant-shimmer"
                            className="w-5 h-5 text-indigo-500"
                        />
                        Prediction Accuracy Trend
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Rolling MAE & RMSE — last{" "}
                        {displayData.length} predictions
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {stats.driftAlert && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/50">
                            <Icon
                                icon="mdi:alert-circle"
                                className="w-4 h-4 text-red-500"
                            />
                            <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                                Model Drift
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800/80 rounded-lg">
                        <Icon
                            icon={trendIcon}
                            className={`w-4 h-4 ${trendColor}`}
                        />
                        <span
                            className={`text-xs font-semibold capitalize ${trendColor}`}
                        >
                            {stats.trend}
                        </span>
                    </div>

                    <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Current
                        </p>
                        <p className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                            {stats.currentMae.toFixed(2)}
                            <span className="text-xs font-normal text-gray-400 ml-0.5">
                                pods
                            </span>
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Session Avg
                        </p>
                        <p className="text-base font-bold text-teal-600 dark:text-teal-400">
                            {stats.avgMae.toFixed(2)}
                            <span className="text-xs font-normal text-gray-400 ml-0.5">
                                pods
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {displayData.length < 3 ? (
                <div className="h-[200px] flex items-center justify-center">
                    <div className="text-center text-gray-400">
                        <Icon
                            icon="mdi:chart-line-variant"
                            className="w-10 h-10 mx-auto mb-2 opacity-30"
                        />
                        <p className="text-sm">Collecting accuracy data...</p>
                        <p className="text-xs mt-1 text-gray-300">
                            Needs at least 3 predictions
                        </p>
                    </div>
                </div>
            ) : (
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={displayData}
                            margin={{ top: 5, right: 8, left: -5, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient
                                    id="maeAreaGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#6366f1"
                                        stopOpacity={0.25}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#6366f1"
                                        stopOpacity={0.02}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e5e7eb"
                                opacity={0.4}
                            />
                            <XAxis
                                dataKey="time"
                                stroke="#9CA3AF"
                                style={{ fontSize: "9px" }}
                                tick={{ fill: "#9CA3AF" }}
                                tickLine={false}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                stroke="#9CA3AF"
                                style={{ fontSize: "9px" }}
                                tick={{ fill: "#9CA3AF" }}
                                tickLine={false}
                                domain={[0, "auto"]}
                                label={{
                                    value: "MAE",
                                    angle: -90,
                                    position: "insideLeft",
                                    style: { fontSize: "9px", fill: "#9CA3AF" },
                                    offset: 12,
                                }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(255,255,255,0.97)",
                                    borderRadius: "8px",
                                    border: "1px solid #e5e7eb",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                    fontSize: "12px",
                                }}
                                formatter={(value, name) => [
                                    `${parseFloat(value).toFixed(3)} pods`,
                                    name === "mae" ? "MAE" : "RMSE",
                                ]}
                                labelStyle={{
                                    fontWeight: 600,
                                    color: "#111827",
                                    marginBottom: "4px",
                                }}
                            />
                            {/* Session average reference */}
                            <ReferenceLine
                                y={stats.avgMae}
                                stroke="#14b8a6"
                                strokeDasharray="4 3"
                                label={{
                                    value: `avg ${stats.avgMae.toFixed(2)}`,
                                    position: "insideTopRight",
                                    fontSize: 9,
                                    fill: "#14b8a6",
                                }}
                            />
                            {/* Best (min) reference */}
                            <ReferenceLine
                                y={stats.minMae}
                                stroke="#10b981"
                                strokeDasharray="2 4"
                                opacity={0.5}
                            />
                            <Area
                                type="monotone"
                                dataKey="mae"
                                stroke="#6366f1"
                                strokeWidth={2}
                                fill="url(#maeAreaGradient)"
                                dot={false}
                                name="mae"
                                activeDot={{ r: 4, fill: "#6366f1" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="rmse"
                                stroke="#f59e0b"
                                strokeWidth={1.5}
                                dot={false}
                                strokeDasharray="3 3"
                                name="rmse"
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            )}

            <div className="mt-3 flex items-center gap-5 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                    <span
                        className="w-3 h-0.5 inline-block rounded"
                        style={{ background: "#6366f1" }}
                    />
                    MAE (lower = better)
                </span>
                <span className="flex items-center gap-1.5">
                    <span
                        className="w-3 inline-block"
                        style={{
                            borderTop: "1.5px dashed #f59e0b",
                            height: 0,
                        }}
                    />
                    RMSE
                </span>
                <span className="flex items-center gap-1.5">
                    <span
                        className="w-3 inline-block"
                        style={{
                            borderTop: "1px dashed #14b8a6",
                            height: 0,
                        }}
                    />
                    Session Avg
                </span>
            </div>
        </div>
    );
};

export default AccuracyTrendChart;
