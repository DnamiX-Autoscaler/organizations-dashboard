/**
 * PredictionAccuracyChart.jsx
 *
 * TWO-PANEL accuracy view — clear at a glance:
 *
 *  ┌─────────────────────────────────────────────────────┐
 *  │  TOP: Forecast vs Observed Pods (same T+5 moment)   │
 *  │    Purple  = model forecast                         │
 *  │    Teal    = observed value at T+5                  │
 *  │    → Convergence = accurate prediction              │
 *  ├─────────────────────────────────────────────────────┤
 *  │  BOTTOM: Prediction error per inference cycle       │
 *  │    Green   = |error| ≤ 1 pod  (within tolerance)   │
 *  │    Amber   = |error| ≤ 3 pods (minor deviation)    │
 *  │    Red     = |error| >  3 pods (significant miss)  │
 *  └─────────────────────────────────────────────────────┘
 */

import React, { useMemo } from "react";
import {
    ComposedChart, BarChart,
    Line, Bar, Area,
    XAxis, YAxis,
    CartesianGrid, Tooltip,
    ResponsiveContainer, ReferenceLine, Cell, Legend,
} from "recharts";
import { Icon } from "@iconify/react";
import useMLModel from "../../services/useMLModel";

// ---------------------------------------------------------------------------
// Tooltip helpers
// ---------------------------------------------------------------------------

const TopTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const pred = payload.find((p) => p.dataKey === "predicted");
    const truth = payload.find((p) => p.dataKey === "actualAtT5");
    const hpa = payload.find((p) => p.dataKey === "hpaPods");
    const err = (pred?.value != null && truth?.value != null)
        ? pred.value - truth.value : null;
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg px-4 py-3 text-sm min-w-[200px]">
            <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">{label}</p>
            {pred?.value != null && (
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-0 border-t-2 border-dashed border-violet-500" />
                        <span className="text-gray-500 dark:text-gray-400">Predicted Demand</span>
                    </div>
                    <span className="font-bold text-violet-600 dark:text-violet-300">{pred.value} pods</span>
                </div>
            )}
            {truth?.value != null && (
                <div className="flex items-center justify-between gap-4 mt-1">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-0.5 bg-teal-500 rounded" />
                        <span className="text-gray-500 dark:text-gray-400">Actual Demand</span>
                    </div>
                    <span className="font-bold text-teal-600 dark:text-teal-300">{truth.value} pods</span>
                </div>
            )}
            {hpa?.value != null && (
                <div className="flex items-center justify-between gap-4 mt-1">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-0 border-t-2 border-dashed border-orange-400" />
                        <span className="text-gray-500 dark:text-gray-400">HPA Reactive</span>
                    </div>
                    <span className="font-bold text-orange-500 dark:text-orange-400">{hpa.value} pods</span>
                </div>
            )}
            {err != null && (
                <div className={`mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-xs font-semibold
                    ${Math.abs(err) <= 1 ? "text-emerald-600" : Math.abs(err) <= 3 ? "text-amber-600" : "text-red-600"}`}>
                    Error: {err > 0 ? "+" : ""}{err} pod{Math.abs(err) !== 1 ? "s" : ""}
                    {" · "}{Math.abs(err) <= 1 ? "✓ Accurate" : Math.abs(err) <= 3 ? "⚠ Off" : "✗ Miss"}
                </div>
            )}
        </div>
    );
};

const BottomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const e = payload[0]?.value;
    const transition = payload[0]?.payload?.transition;
    if (e == null) return null;
    const abs = Math.abs(e);
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg px-4 py-3 text-sm">
            <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
            {transition ? (
                <p className="text-xs text-gray-400">Rapid-scaling tick — excluded from metrics</p>
            ) : (
                <>
                    <p className={`font-bold ${abs <= 1 ? "text-emerald-600" : abs <= 3 ? "text-amber-600" : "text-red-600"}`}>
                        Error: {e > 0 ? "+" : ""}{e} pod{abs !== 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {abs === 0 ? "Exact match" : abs <= 1 ? "Within ±1 pod" : abs <= 3 ? "Minor deviation" : "Significant miss"}
                    </p>
                </>
            )}
        </div>
    );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const PredictionAccuracyChart = () => {
    const { predictionLog = [] } = useMLModel();

    // Use the last 40 predictions so the chart stays readable
    const displayLog = predictionLog.slice(-40);

    // Derive bar colour per error value; fade transition ticks
    const barColor = (error, transition) => {
        if (transition) return "#d1d5db"; // gray — excluded from metrics
        const abs = Math.abs(error);
        if (abs <= 1) return "#10b981"; // emerald
        if (abs <= 3) return "#f59e0b"; // amber
        return "#ef4444";               // red
    };

    // Summary stats — exclude transition ticks
    const stats = useMemo(() => {
        const evaluable = displayLog.filter((d) => !d.transition);
        if (!evaluable.length) return null;
        const errors = evaluable.map((d) => d.error);
        const abs = errors.map(Math.abs);
        const mae = abs.reduce((s, v) => s + v, 0) / abs.length;
        const exact = errors.filter((e) => e === 0).length;
        const within1 = abs.filter((e) => e <= 1).length;
        const n = errors.length;
        const transitionCount = displayLog.length - n;
        return {
            mae: mae.toFixed(2),
            exactPct: ((exact / n) * 100).toFixed(1),
            within1Pct: ((within1 / n) * 100).toFixed(1),
            n,
            transitionCount,
        };
    }, [displayLog]);

    if (!displayLog.length) {
        return (
            <div className="p-6 bg-white border border-gray-200 rounded-xl dark:bg-darkBackground dark:border-gray-700 flex flex-col items-center justify-center h-48 gap-3">
                <Icon icon="mdi:chart-timeline-variant" className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                <p className="text-sm text-gray-400 dark:text-gray-500">Awaiting first inference cycle…</p>
            </div>
        );
    }

    // Y-axis domains
    const allPods = displayLog.flatMap((d) => [d.predicted, d.actualAtT5, d.hpaPods]).filter(Boolean);
    const podMin = Math.max(0, Math.min(...allPods) - 2);
    const podMax = Math.max(...allPods) + 3;

    const allErrors = displayLog.map((d) => d.error);
    const errAbs = Math.max(4, Math.ceil(Math.max(...allErrors.map(Math.abs))) + 1);

    // Download the full prediction log (not just the displayed 40) as a CSV file.
    const exportCsv = () => {
        if (!predictionLog.length) return;
        const headers = ["time", "currentPods", "predicted", "actualAtT5", "error", "hpaPods", "transition"];
        const rows = predictionLog.map((d) => [
            d.time, d.currentPods, d.predicted, d.actualAtT5,
            d.error, d.hpaPods ?? "", d.transition ? "1" : "0",
        ]);
        const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `prediction-log-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-xl dark:bg-darkBackground dark:border-gray-700 space-y-5">

            {/* ── Header ──────────────────────────────────────── */}
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                        <Icon icon="mdi:target-variant" className="w-5 h-5 text-teal-500" />
                        Forecast Accuracy — 5-Minute Horizon
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">
                        Each point compares the AI prediction against what actually happened — both
                        at the <span className="font-medium text-gray-500 dark:text-gray-400">same future moment (T+5)</span>.
                        The prediction was made 5 minutes earlier; the actual value is observed when that moment arrives.
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 flex items-center gap-x-4 flex-wrap">
                        <span className="flex items-center gap-1.5">
                            <span className="inline-block w-4 h-0 border-t-2 border-dashed border-violet-500" />
                            Predicted Demand
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="inline-block w-4 h-0.5 bg-teal-500 rounded" />
                            Actual Demand
                        </span>
                        <span className="text-gray-300 dark:text-gray-600">—</span>
                        <span>Overlapping lines = accurate prediction</span>
                    </p>
                </div>
                <button
                    onClick={exportCsv}
                    disabled={!predictionLog.length}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/60 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                    title="Download full prediction log as CSV"
                >
                    <Icon icon="mdi:download" className="w-3.5 h-3.5" />
                    Export CSV
                </button>
            </div>

            {/* ── Stat cards ──────────────────────────────────── */}
            {stats && (
                <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col gap-0.5 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-500">Mean Abs Error</span>
                        <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.mae}</span>
                        <span className="text-[10px] text-blue-400">pods avg deviation</span>
                    </div>
                    <div className="flex flex-col gap-0.5 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-500">Exact Match</span>
                        <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{stats.exactPct}%</span>
                        <span className="text-[10px] text-emerald-400">error = 0 pods</span>
                    </div>
                    <div className="flex flex-col gap-0.5 px-4 py-3 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/30">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-teal-500">Within ±1 Pod</span>
                        <span className="text-2xl font-bold text-teal-700 dark:text-teal-300">{stats.within1Pct}%</span>
                        <span className="text-[10px] text-teal-400">of {stats.n} evaluable predictions{stats.transitionCount > 0 ? ` (· ${stats.transitionCount} rapid-scaling ticks excluded)` : ""}</span>
                    </div>
                </div>
            )}

            {/* ── TOP chart: Predicted vs Actual ──────────────── */}
            <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1.5 flex-wrap">
                    <span className="inline-block w-5 h-0 border-t-2 border-dashed border-violet-500" />
                    Predicted Demand (what AI forecasted)
                    <span className="inline-block w-5 h-0.5 bg-teal-500 rounded ml-3" />
                    Actual Demand (what really happened)
                    <span className="inline-block w-5 h-0 border-t-2 border-dashed border-orange-400 ml-3" />
                    HPA Reactive
                    <span className="ml-2 text-gray-300 dark:text-gray-600">— both at the same T+5 moment</span>
                </p>
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={displayLog} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gradPred" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.18} />
                                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.01} />
                                </linearGradient>
                                <linearGradient id="gradTruth" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.18} />
                                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.01} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.4} />
                            <XAxis
                                dataKey="time"
                                tick={{ fill: "#9ca3af", fontSize: 10 }}
                                tickLine={false}
                                axisLine={{ stroke: "#e5e7eb" }}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                domain={[podMin, podMax]}
                                tick={{ fill: "#9ca3af", fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                                label={{ value: "Pods", angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "#9ca3af" } }}
                                width={38}
                            />
                            <Tooltip content={<TopTooltip />} />
                            {/* Zero-error reference band is hard to draw; use identical line overlap */}
                            <Area type="monotone" dataKey="predicted" fill="url(#gradPred)" stroke="none" animationDuration={300} />
                            <Area type="monotone" dataKey="actualAtT5" fill="url(#gradTruth)" stroke="none" animationDuration={300} />
                            <Line
                                type="monotone"
                                dataKey="actualAtT5"
                                stroke="#14b8a6"
                                strokeWidth={2.5}
                                name="Actual Demand"
                                dot={{ r: 3, fill: "#14b8a6", stroke: "#fff", strokeWidth: 1.5 }}
                                activeDot={{ r: 6 }}
                                animationDuration={300}
                            />
                            <Line
                                type="monotone"
                                dataKey="predicted"
                                stroke="#8b5cf6"
                                strokeWidth={2.5}
                                strokeDasharray="7 4"
                                name="Predicted Demand"
                                dot={{ r: 3, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 1.5 }}
                                activeDot={{ r: 6 }}
                                animationDuration={300}
                            />
                            <Line
                                type="monotone"
                                dataKey="hpaPods"
                                stroke="#f97316"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                name="HPA Reactive"
                                dot={false}
                                activeDot={{ r: 5, fill: "#f97316", stroke: "#fff", strokeWidth: 2 }}
                                animationDuration={300}
                            />
                            <Legend
                                wrapperStyle={{ paddingTop: 8 }}
                                iconType="plainline"
                                formatter={(value, entry) => (
                                    <span style={{ color: entry.color, fontSize: 11, fontWeight: 500 }}>{value}</span>
                                )}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── BOTTOM chart: Error bars ─────────────────────── */}
            <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-3">
                    Prediction error per inference cycle
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> ≤ 1 pod</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" /> ≤ 3 pods</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-500 inline-block" /> &gt; 3 pods</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-gray-300 inline-block" /> rapid-scaling (excluded)</span>
                </p>
                <div className="h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={displayLog} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barSize={10}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.4} />
                            <XAxis
                                dataKey="time"
                                tick={{ fill: "#9ca3af", fontSize: 10 }}
                                tickLine={false}
                                axisLine={{ stroke: "#e5e7eb" }}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                domain={[-errAbs, errAbs]}
                                tick={{ fill: "#9ca3af", fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                                label={{ value: "Error", angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "#9ca3af" } }}
                                width={38}
                            />
                            <Tooltip content={<BottomTooltip />} />
                            <ReferenceLine y={0} stroke="#6b7280" strokeWidth={1.5} />
                            <ReferenceLine y={1} stroke="#10b981" strokeDasharray="4 3" strokeOpacity={0.5} />
                            <ReferenceLine y={-1} stroke="#10b981" strokeDasharray="4 3" strokeOpacity={0.5} />
                            <Bar dataKey="error" radius={[3, 3, 0, 0]}>
                                {displayLog.map((entry, i) => (
                                    <Cell key={i} fill={barColor(entry.error, entry.transition)} fillOpacity={entry.transition ? 0.4 : 0.85} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                    Bars above zero = forecast exceeded demand (over-provisioned) · Below zero = forecast below demand (under-provisioned) · Dashed lines = ±1 pod tolerance
                </p>
            </div>
        </div>
    );
};

export default PredictionAccuracyChart;
