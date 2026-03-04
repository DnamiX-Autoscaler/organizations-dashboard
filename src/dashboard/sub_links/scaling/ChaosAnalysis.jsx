import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getChaosStream } from "../../../api/config/autoscaling/api";
import TitleHeader from "../../../components/common/TitleHeader";

import { useChaosSSE } from "../../../hooks/useChaosSSE";

const ChaosAnalysis = () => {
    const chaosResults = useChaosSSE([]);

    // Summary Statistics
    const stats = useMemo(() => {
        if (chaosResults.length === 0) return {
            total: 0,
            avgRecovery: 0,
            avgResilience: 0,
            failureRate: 0
        };

        const total = chaosResults.length;
        const avgRecovery = chaosResults.reduce((sum, r) => sum + (r.recoveryTimeSeconds || 0), 0) / total;
        const avgResilience = chaosResults.reduce((sum, r) => sum + (r.resilienceScore || 0), 0) / total;
        const failures = chaosResults.filter(r => r.result === "FAIL").length;
        const failureRate = (failures / total) * 100;

        return {
            total,
            avgRecovery: avgRecovery.toFixed(1),
            avgResilience: avgResilience.toFixed(2),
            failureRate: failureRate.toFixed(1)
        };
    }, [chaosResults]);

    // Graph Data
    const recoveryTrendData = useMemo(() => {
        return [...chaosResults].reverse().map((r, i) => ({
            name: `Exp ${i + 1}`,
            recoveryTime: r.recoveryTimeSeconds,
            resilience: r.resilienceScore * 100
        }));
    }, [chaosResults]);

    const latestResult = chaosResults[0] || {};

    return (
        <div className="flex flex-col h-full space-y-6">
            <TitleHeader
                title="Chaos Experiment & Recovery Analysis"
                subtitle="Real-time resilience validation during scaling events"
            />

            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Icon icon="mdi:flask-outline" className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Experiments</span>
                    </div>
                    <div className="text-3xl font-bold dark:text-white">{stats.total}</div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Icon icon="mdi:timer-sand" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Recovery Time</span>
                    </div>
                    <div className="text-3xl font-bold dark:text-white">{stats.avgRecovery}s</div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <Icon icon="mdi:shield-check-outline" className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Resilience Score</span>
                    </div>
                    <div className="text-3xl font-bold dark:text-white">{stats.avgResilience}</div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                            <Icon icon="mdi:alert-circle-outline" className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Experiment Failure Rate</span>
                    </div>
                    <div className="text-3xl font-bold dark:text-white">{stats.failureRate}%</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recovery Trend Graph */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 dark:text-white">
                        <Icon icon="mdi:chart-line" className="text-primary" />
                        Recovery Time Trend
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={recoveryTrendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                <XAxis dataKey="name" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" label={{ value: 'Seconds', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                                    itemStyle={{ color: '#F3F4F6' }}
                                />
                                <Line type="monotone" dataKey="recoveryTime" stroke="#84006A" strokeWidth={3} dot={{ fill: '#84006A', r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Latency Impact Visualization */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 dark:text-white">
                        <Icon icon="mdi:gauge" className="text-blue-500" />
                        Real-time Latency Impact
                    </h3>
                    {chaosResults.length > 0 ? (
                        <div className="space-y-8 py-4">
                            <div className="flex flex-col items-center">
                                <div className="flex justify-between w-full max-w-md text-sm font-medium text-gray-500 mb-2 px-2">
                                    <span>Before</span>
                                    <span>During</span>
                                    <span>After</span>
                                </div>
                                <div className="flex items-center justify-between w-full max-w-md relative">
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0"></div>
                                    <div className="z-10 bg-white dark:bg-gray-800 p-3 rounded-full border-4 border-green-500 shadow-lg">
                                        <div className="text-center">
                                            <div className="text-lg font-bold dark:text-white">{latestResult.latencyBefore}ms</div>
                                        </div>
                                    </div>
                                    <div className="z-10 bg-white dark:bg-gray-800 p-4 rounded-full border-4 border-red-500 shadow-xl animate-pulse">
                                        <div className="text-center">
                                            <div className="text-xl font-bold dark:text-red-400">{latestResult.latencyDuring}ms</div>
                                        </div>
                                    </div>
                                    <div className="z-10 bg-white dark:bg-gray-800 p-3 rounded-full border-4 border-blue-500 shadow-lg">
                                        <div className="text-center">
                                            <div className="text-lg font-bold dark:text-white">{latestResult.latencyAfter}ms</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-500">Availability During Chaos</span>
                                    <span className="text-sm font-bold text-green-500">{(latestResult.availabilityDuringChaos * 100).toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                    <div
                                        className="bg-green-500 h-3 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${latestResult.availabilityDuringChaos * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500 italic">No experiments recorded yet</div>
                    )}
                </div>
            </div>

            {/* Experiment Log Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold flex items-center gap-2 dark:text-white">
                        <Icon icon="mdi:clipboard-list-outline" className="text-gray-400" />
                        Chaos Experiment Log
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-sm uppercase font-semibold">
                                <th className="px-6 py-4">Service</th>
                                <th className="px-6 py-4">Fault Type</th>
                                <th className="px-6 py-4">Recovery Time</th>
                                <th className="px-6 py-4">Resilience</th>
                                <th className="px-6 py-4">Result</th>
                                <th className="px-6 py-4">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y dark:divide-gray-700">
                            {chaosResults.length > 0 ? chaosResults.map((exp) => (
                                <tr key={exp.experimentId} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4 font-medium dark:text-white">{exp.service}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs font-mono">
                                            {exp.faultType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-primary">{exp.recoveryTimeSeconds}s</td>
                                    <td className="px-6 py-4 font-bold">{exp.resilienceScore}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${exp.result === "PASS"
                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800"
                                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800"
                                            }`}>
                                            {exp.result}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                        {new Date(exp.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 italic">Waiting for chaos experiment data...</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ChaosAnalysis;
