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
    const pred  = payload.find((p) => p.dataKey === "predicted");
    const truth = payload.find((p) => p.dataKey === "actualAtT5");
    const err   = (pred?.value != null && truth?.value != null)
        ? pred.value - truth.value : null;
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg px-4 py-3 text-sm min-w-[180px]">
            <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">{label}</p>
            {pred?.value != null && (
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-0 border-t-2 border-dashed border-violet-500" />
                        <span className="text-gray-500 dark:text-gray-400">Predicted</span>
                    </div>
                    <span className="font-bold text-violet-600 dark:text-violet-300">{pred.value} pods</span>
                </div>
            )}
            {truth?.value != null && (
                <div className="flex items-center justify-between gap-4 mt-1">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-0.5 bg-teal-500 rounded" />
                        <span className="text-gray-500 dark:text-gray-400">Actual (T+5)</span>
                    </div>
                    <span className="font-bold text-teal-600 dark:text-teal-300">{truth.value} pods</span>
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
    if (e == null) return null;
    const abs = Math.abs(e);
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg px-4 py-3 text-sm">
            <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
            <p className={`font-bold ${abs <= 1 ? "text-emerald-600" : abs <= 3 ? "text-amber-600" : "text-red-600"}`}>
                Error: {e > 0 ? "+" : ""}{e} pod{abs !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
                {abs === 0 ? "Exact match" : abs <= 1 ? "Within ±1 pod" : abs <= 3 ? "Minor miss" : "Large miss"}
            </p>
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

    // Derive bar colour per error value
    const barColor = (error) => {
        const abs = Math.abs(error);
        if (abs <= 1) return "#10b981"; // emerald
        if (abs <= 3) return "#f59e0b"; // amber
        return "#ef4444";               // red
    };

    // Summary stats
    const stats = useMemo(() => {
        if (!displayLog.length) return null;
        const errors = displayLog.map((d) => d.error);
        const abs    = errors.map(Math.abs);
        const mae    = abs.reduce((s, v) => s + v, 0) / abs.length;
        const exact  = errors.filter((e) => e === 0).length;
        const within1 = abs.filter((e) => e <= 1).length;
        const n = errors.length;
        return {
            mae: mae.toFixed(2),
            exactPct: ((exact  / n) * 100).toFixed(1),
            within1Pct: ((within1 / n) * 100).toFixed(1),
            n,
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
    const allPods = displayLog.flatMap((d) => [d.predicted, d.actualAtT5]).filter(Boolean);
    const podMin  = Math.max(0, Math.min(...allPods) - 2);
    const podMax  = Math.max(...allPods) + 3;

    const allErrors = displayLog.map((d) => d.error);
    const errAbs    = Math.max(4, Math.ceil(Math.max(...allErrors.map(Math.abs))) + 1);

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-xl dark:bg-darkBackground dark:border-gray-700 space-y-5">

            {/* ── Header ──────────────────────────────────────── */}
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                        <Icon icon="mdi:target-variant" className="w-5 h-5 text-teal-500" />
                        Forecast Accuracy — T+5 min Horizon
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        Purple line = model forecast · Teal line = observed value at T+5 · Convergence indicates accurate prediction
                    </p>
                </div>
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
                        <span className="text-[10px] text-teal-400">of {stats.n} predictions</span>
                    </div>
                </div>
            )}

            {/* ── TOP chart: Predicted vs Actual ──────────────── */}
            <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1.5">
                    <span className="inline-block w-5 h-0.5 bg-violet-500 rounded" />
                    Model forecast
                    <span className="inline-block w-5 h-0.5 bg-teal-500 rounded ml-3" />
                    Observed at T+5
                    <span className="ml-2 text-gray-300 dark:text-gray-600">— line convergence = accurate prediction</span>
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
                                name="Actual (T+5)"
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
                                name="Predicted"
                                dot={{ r: 3, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 1.5 }}
                                activeDot={{ r: 6 }}
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
                    Prediction error per tick (predicted − actual)
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> ≤ 1 pod</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" /> ≤ 3 pods</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-500 inline-block" /> &gt; 3 pods</span>
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
                            <ReferenceLine y={1}  stroke="#10b981" strokeDasharray="4 3" strokeOpacity={0.5} />
                            <ReferenceLine y={-1} stroke="#10b981" strokeDasharray="4 3" strokeOpacity={0.5} />
                            <Bar dataKey="error" radius={[3, 3, 0, 0]}>
                                {displayLog.map((entry, i) => (
                                    <Cell key={i} fill={barColor(entry.error)} fillOpacity={0.85} />
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
