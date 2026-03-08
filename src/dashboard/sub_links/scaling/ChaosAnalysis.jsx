import React, { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import TitleHeader from "../../../components/common/TitleHeader";
import { useChaosSSE } from "../../../hooks/useChaosSSE";

const ChaosAnalysis = () => {
    const chaosResults = useChaosSSE([]);

    // Summary Statistics
    const stats = useMemo(() => {
        if (chaosResults.length === 0) return {
            total: 0, avgRecovery: 0, avgResilience: 0, failureRate: 0,
            avgErrorRate: 0, avgAvailability: 0, passCount: 0, failCount: 0
        };
        const total = chaosResults.length;
        const avgRecovery = chaosResults.reduce((sum, r) => sum + (r.recoveryTimeSeconds || 0), 0) / total;
        const avgResilience = chaosResults.reduce((sum, r) => sum + (r.resilienceScore || 0), 0) / total;
        const avgErrorRate = chaosResults.reduce((sum, r) => sum + ((r.errorRateDuring || 0) * 100), 0) / total;
        const avgAvailability = chaosResults.reduce((sum, r) => sum + ((r.availabilityDuringChaos || 0) * 100), 0) / total;
        const failures = chaosResults.filter(r => r.result === "FAIL").length;
        const passes = chaosResults.filter(r => r.result === "PASS").length;
        return {
            total, passCount: passes, failCount: failures,
            avgRecovery: avgRecovery.toFixed(1),
            avgResilience: avgResilience.toFixed(2),
            failureRate: ((failures / total) * 100).toFixed(1),
            avgErrorRate: avgErrorRate.toFixed(2),
            avgAvailability: avgAvailability.toFixed(1),
        };
    }, [chaosResults]);

    const recoveryTrendData = useMemo(() => {
        return [...chaosResults].reverse().slice(0, 20).map((r, i) => ({
            name: `Exp ${chaosResults.length - i}`,
            recoveryTime: r.recoveryTimeSeconds,
            resilience: r.resilienceScore * 100
        }));
    }, [chaosResults]);

    const latestResult = chaosResults[0] || {};

    const fmt = (date) => date ? new Date(date).toLocaleString([], {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    }) : 'N/A';

    const fmtShort = (date) => date ? new Date(date).toLocaleString([], {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }) : 'N/A';

    return (
        <div className="flex flex-col h-full space-y-6">
            <TitleHeader
                title="Chaos Experiment & Recovery Analysis"
                subtitle="Real-time resilience validation during scaling events"
            />

            {/* ── ROW 1: Summary Cards (6 cards, 3-col grid) ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                    {
                        icon: "mdi:flask-outline", color: "purple",
                        label: "Total Experiments", value: stats.total,
                        sub: <span className="flex gap-2 text-xs mt-1">
                            <span className="text-green-600 dark:text-green-400">✓ {stats.passCount} Pass</span>
                            <span className="text-red-600 dark:text-red-400">✗ {stats.failCount} Fail</span>
                        </span>
                    },
                    { icon: "mdi:timer-sand", color: "blue", label: "Avg Recovery Time", value: `${stats.avgRecovery}s` },
                    {
                        icon: "mdi:shield-check-outline", color: "green", label: "Avg Resilience Score",
                        value: stats.avgResilience,
                        bar: { value: parseFloat(stats.avgResilience), color: parseFloat(stats.avgResilience) >= 0.8 ? 'bg-green-500' : parseFloat(stats.avgResilience) >= 0.6 ? 'bg-yellow-500' : 'bg-red-500' }
                    },
                    { icon: "mdi:alert-outline", color: "amber", label: "Avg Error Rate", value: `${stats.avgErrorRate}%` },
                    { icon: "mdi:check-circle-outline", color: "cyan", label: "Avg Availability", value: `${stats.avgAvailability}%` },
                    { icon: "mdi:alert-circle-outline", color: "red", label: "Failure Rate", value: `${stats.failureRate}%` },
                ].map((card, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 bg-${card.color}-100 dark:bg-${card.color}-900/30 rounded-lg`}>
                                <Icon icon={card.icon} className={`w-6 h-6 text-${card.color}-600 dark:text-${card.color}-400`} />
                            </div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.label}</span>
                        </div>
                        {card.bar ? (
                            <div className="flex items-center gap-3">
                                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{card.value}</div>
                                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className={`h-full ${card.bar.color}`} style={{ width: `${card.bar.value * 100}%` }} />
                                </div>
                            </div>
                        ) : (
                            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{card.value}</div>
                        )}
                        {card.sub}
                    </div>
                ))}
            </div>

            {/* ── ROW 2: Chart (left) + Latest Experiment Details (right) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

                {/* Recovery Trend Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 shrink-0">
                        <Icon icon="mdi:chart-line" className="text-purple-600 dark:text-purple-400" />
                        Recovery Time Trend (Last 20)
                    </h3>
                    <div className="flex-1 min-h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={recoveryTrendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                                <YAxis stroke="#9CA3AF" label={{ value: 'Seconds', angle: -90, position: 'insideLeft', fill: '#9CA3AF', fontSize: 11 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} itemStyle={{ color: '#F3F4F6' }} />
                                <Line type="monotone" dataKey="recoveryTime" stroke="#84006A" strokeWidth={3} dot={{ fill: '#84006A', r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Latest Experiment Details */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 shrink-0">
                        <Icon icon="mdi:gauge" className="text-blue-600 dark:text-blue-400" />
                        Latest Experiment Details
                    </h3>
                    {chaosResults.length > 0 ? (
                        <div className="flex flex-col gap-4 flex-1 overflow-y-auto min-h-0">
                            <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg shrink-0">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Experiment Name</p>
                                <p className="text-base font-bold text-purple-700 dark:text-purple-300">{latestResult.experimentName || latestResult.experimentId}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 shrink-0">
                                {[
                                    { label: "Service", value: latestResult.service },
                                    { label: "Namespace", value: latestResult.namespace },
                                    { label: "Fault Type", value: latestResult.faultType, mono: true },
                                    { label: "Duration", value: `${latestResult.durationSeconds}s` },
                                ].map((item, i) => (
                                    <div key={i} className="p-2.5 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.label}</p>
                                        <p className={`font-semibold text-sm text-gray-900 dark:text-gray-100 ${item.mono ? 'font-mono' : ''}`}>{item.value}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-3 gap-3 shrink-0">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Recovery</p>
                                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                        {latestResult.recoveryTimeSeconds != null ? `${latestResult.recoveryTimeSeconds}s` : (!latestResult.endTime ? '...' : 'N/A')}
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Resilience</p>
                                    <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                                        {latestResult.resilienceScore != null ? latestResult.resilienceScore : (!latestResult.endTime ? '...' : 'N/A')}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-lg border ${latestResult.result === 'PASS' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : latestResult.result === 'FAIL' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700'}`}>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Result</p>
                                    <p className={`text-xl font-bold ${latestResult.result === 'PASS' ? 'text-green-600 dark:text-green-400' : latestResult.result === 'FAIL' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                        {latestResult.result || (!latestResult.endTime ? 'Running' : 'N/A')}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-700 mt-auto shrink-0">
                                <p className="text-xs text-gray-500 dark:text-gray-400">{fmt(latestResult.createdAt)}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 italic">No experiments recorded yet</div>
                    )}
                </div>
            </div>

            {/* ── ROW 3: Latest Experiment Data Details Table (full width) ── */}
            {chaosResults.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <Icon icon="mdi:database-outline" className="text-purple-600 dark:text-purple-400" />
                            Latest Experiment Data Details
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {[
                                    ["Experiment ID", <span className="font-mono text-xs">{latestResult.experimentId}</span>, "Experiment Name", latestResult.experimentName],
                                    ["Service", latestResult.service, "Namespace",
                                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-semibold">{latestResult.namespace}</span>],
                                    ["Fault Type",
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded text-xs font-mono">{latestResult.faultType}</span>,
                                        "Duration", <span className="font-semibold">{latestResult.durationSeconds ? `${latestResult.durationSeconds}s` : (!latestResult.endTime ? 'In Progress' : 'N/A')}</span>],
                                    ["Start Time", <span className="text-xs">{fmt(latestResult.startTime)}</span>, "End Time", <span className="text-xs">{latestResult.endTime ? fmt(latestResult.endTime) : 'In Progress'}</span>],
                                    ["Recovery Time", <span className="text-blue-600 dark:text-blue-400 font-bold">{latestResult.recoveryTimeSeconds != null ? `${latestResult.recoveryTimeSeconds}s` : (!latestResult.endTime ? 'Calculating...' : 'N/A')}</span>,
                                        "Resilience Score", <span className="text-purple-600 dark:text-purple-400 font-bold">{latestResult.resilienceScore != null ? latestResult.resilienceScore : (!latestResult.endTime ? 'Calculating...' : 'N/A')}</span>],
                                    ["Availability During Chaos",
                                        <span className="text-green-600 dark:text-green-400 font-bold">{latestResult.availabilityDuringChaos != null ? `${((latestResult.availabilityDuringChaos) * 100).toFixed(1)}%` : (!latestResult.endTime ? 'Monitoring...' : 'N/A')}</span>,
                                        "Error Rate During", <span className="text-red-600 dark:text-red-400 font-bold">{latestResult.errorRateDuring != null ? `${((latestResult.errorRateDuring) * 100).toFixed(1)}%` : (!latestResult.endTime ? 'Monitoring...' : 'N/A')}</span>],
                                    ["Latency Before", `${latestResult.latencyBefore || 0}ms`, "Latency During", latestResult.latencyDuring != null ? `${latestResult.latencyDuring}ms` : (!latestResult.endTime ? 'Measuring...' : 'N/A')],
                                    ["Latency After", latestResult.latencyAfter != null ? `${latestResult.latencyAfter}ms` : (!latestResult.endTime ? 'Pending' : 'N/A'), "Error Rate Before", `${((latestResult.errorRateBefore || 0) * 100).toFixed(1)}%`],
                                    ["Error Rate After", latestResult.errorRateAfter != null ? `${((latestResult.errorRateAfter) * 100).toFixed(1)}%` : (!latestResult.endTime ? 'Pending' : 'N/A'), "Affected Pods", <span className="font-semibold">{latestResult.affectedPodsCount || 0}</span>],
                                    ["Restart Count", <span className="font-semibold">{latestResult.restartCount || 0}</span>, "Result",
                                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${latestResult.result === "PASS" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800" : latestResult.result === "FAIL" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800"}`}>{latestResult.result || (!latestResult.endTime ? 'Running' : 'N/A')}</span>],
                                ].map(([l1, v1, l2, v2], i) => (
                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                        <td className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 w-1/4">{l1}</td>
                                        <td className="px-6 py-3 text-gray-900 dark:text-gray-100">{v1}</td>
                                        <td className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 w-1/4">{l2}</td>
                                        <td className="px-6 py-3 text-gray-900 dark:text-gray-100">{v2}</td>
                                    </tr>
                                ))}
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                    <td className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50">Created At</td>
                                    <td className="px-6 py-3 text-gray-900 dark:text-gray-100 text-xs" colSpan="3">
                                        {new Date(latestResult.createdAt).toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── ROW 4: Recent Chaos Events Log + Experiment Log side by side ── */}
            <div className="grid grid-cols-1 xl:grid-cols-1 gap-6">

                {/* Chaos Experiment Log */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 shrink-0 flex justify-between items-center">
                        <h3 className="text-base font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                            <Icon icon="mdi:clipboard-list-outline" className="text-gray-500 dark:text-gray-400" />
                            Chaos Experiment Log ({chaosResults.length})
                        </h3>
                    </div>
                    <div className="overflow-auto max-h-[480px]">
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-gray-50 dark:bg-gray-900/90 text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold z-10">
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="px-4 py-3 text-left">Experiment</th>
                                    <th className="px-4 py-3 text-left">Service</th>
                                    <th className="px-4 py-3 text-left">Fault</th>
                                    <th className="px-4 py-3 text-left">Dur</th>
                                    <th className="px-4 py-3 text-left">Err%</th>
                                    <th className="px-4 py-3 text-left">Rec</th>
                                    <th className="px-4 py-3 text-left">Score</th>
                                    <th className="px-4 py-3 text-left">Result</th>
                                    <th className="px-4 py-3 text-left">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {chaosResults.length > 0 ? chaosResults.map((exp) => (
                                    <tr key={exp.experimentId || exp._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-900 dark:text-gray-100 text-xs">{exp.experimentName}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{exp.experimentId}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 text-xs">{exp.service}</td>
                                        <td className="px-4 py-3">
                                            <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-gray-900 dark:text-gray-100">{exp.faultType}</span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">
                                            {exp.durationSeconds != null ? `${exp.durationSeconds}s` : (!exp.endTime ? '...' : 'N/A')}
                                        </td>
                                        <td className="px-4 py-3 text-xs">
                                            {exp.errorRateDuring != null ? (
                                                <span className={`font-semibold ${(exp.errorRateDuring * 100) > 10 ? 'text-red-600 dark:text-red-400' : (exp.errorRateDuring * 100) > 5 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
                                                    {(exp.errorRateDuring * 100).toFixed(1)}%
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 dark:text-gray-500 italic text-xs">
                                                    {!exp.endTime ? '...' : 'N/A'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-xs">
                                            {exp.recoveryTimeSeconds != null ? (
                                                <span className="font-semibold text-blue-600 dark:text-blue-400">{exp.recoveryTimeSeconds}s</span>
                                            ) : (
                                                <span className="text-gray-400 dark:text-gray-500 italic">
                                                    {!exp.endTime ? '...' : 'N/A'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {exp.resilienceScore != null ? (
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-bold text-gray-900 dark:text-gray-100 text-xs">{exp.resilienceScore}</span>
                                                    <div className="w-10 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full ${exp.resilienceScore >= 0.8 ? 'bg-green-500' : exp.resilienceScore >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                            style={{ width: `${exp.resilienceScore * 100}%` }} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 dark:text-gray-500 italic text-xs">
                                                    {!exp.endTime ? '...' : 'N/A'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {exp.result ? (
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${exp.result === "PASS" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800" : exp.result === "FAIL" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800" : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-200 dark:border-gray-800"}`}>
                                                    {exp.result}
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
                                                    {!exp.endTime ? 'Running' : 'N/A'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">{fmtShort(exp.createdAt)}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 italic">Waiting for chaos experiment data…</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChaosAnalysis;