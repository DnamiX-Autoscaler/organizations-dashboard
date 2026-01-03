import React, { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import TitleHeader from "../../../components/common/TitleHeader";
import TabSection from "../../../components/common/TabSection";
import Graph from "../../../components/common/Graph";
import rollbackHistoryData from "../../../data/rollbackHistoryData";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// Constants for Research Calculation (Resource Units)
const CPU_RU_PER_CORE_HOUR = 40; // 40 Units per core-hour
const MEMORY_RU_PER_GB_HOUR = 10; // 10 Units per GB-hour
const CPU_CORES_PER_POD = 0.5; // Research Baseline
const MEMORY_GB_PER_POD = 1.0; // Research Baseline

const CostResourceImpact = () => {
    const [activeTab, setActiveTab] = useState("overview");

    const tabs = [
        { key: "overview", label: "Consumption Overview", icon: "mdi:finance" },
        { key: "efficiency", label: "Resource Efficiency", icon: "mdi:gauge" },
        { key: "wasted", label: "Wasted Capacity", icon: "mdi:trash-can-outline" },
    ];

    // Data Derivation Logic
    const derivedData = useMemo(() => {
        return rollbackHistoryData.map(item => {
            const beforeReplicas = item.previousReplicas;
            const afterReplicas = item.appliedReplicas;

            // Usage from metrics (assuming these reflect % of requested resources)
            const cpuUsedPct = item.metrics.cpuPercent;
            const memUsedPct = item.metrics.memPercent;

            // Hourly Resource-Time Consumption (Resource Units - RU)
            const beforeCpuRU = beforeReplicas * CPU_CORES_PER_POD * CPU_RU_PER_CORE_HOUR;
            const beforeMemRU = beforeReplicas * MEMORY_GB_PER_POD * MEMORY_RU_PER_GB_HOUR;
            const beforeTotal = beforeCpuRU + beforeMemRU;

            const afterCpuRU = afterReplicas * CPU_CORES_PER_POD * CPU_RU_PER_CORE_HOUR;
            const afterMemRU = afterReplicas * MEMORY_GB_PER_POD * MEMORY_RU_PER_GB_HOUR;
            const afterTotal = afterCpuRU + afterMemRU;

            // Efficiency and Wasted
            const cpuEfficiency = cpuUsedPct; // Given as %
            const memEfficiency = memUsedPct;
            const wastedPct = 100 - ((cpuUsedPct + memUsedPct) / 2);

            // Mock RPS for Units per Request
            const rps = (Math.random() * 500 + 100);
            const totalRequestsHour = rps * 3600;
            const ruPerRequest = afterTotal / totalRequestsHour;

            // Rollback Savings (If it was rolled back, we saved the delta)
            let savings = 0;
            if (item.decision === "ROLLED_BACK") {
                savings = Math.max(0, afterTotal - beforeTotal); // Savings per hour
            }

            return {
                ...item,
                consumption: {
                    before: { cpu: beforeCpuRU, mem: beforeMemRU, total: beforeTotal },
                    after: { cpu: afterCpuRU, mem: afterMemRU, total: afterTotal }
                },
                efficiency: { cpu: cpuEfficiency, mem: memEfficiency },
                wasted: wastedPct,
                ruPerRequest: ruPerRequest,
                savings: savings,
                time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
        });
    }, []);

    const totals = useMemo(() => {
        const avgBefore = derivedData.reduce((acc, curr) => acc + curr.consumption.before.total, 0) / derivedData.length;
        const avgAfter = derivedData.reduce((acc, curr) => acc + curr.consumption.after.total, 0) / derivedData.length;
        const totalSavings = derivedData.reduce((acc, curr) => acc + curr.savings, 0);
        const avgCpuEff = derivedData.reduce((acc, curr) => acc + curr.efficiency.cpu, 0) / derivedData.length;
        const avgMemEff = derivedData.reduce((acc, curr) => acc + curr.efficiency.mem, 0) / derivedData.length;
        const avgRUPerReq = derivedData.reduce((acc, curr) => acc + curr.ruPerRequest, 0) / derivedData.length;

        return {
            before: avgBefore,
            after: avgAfter,
            savings: totalSavings,
            cpuEff: avgCpuEff,
            memEff: avgMemEff,
            ruPerReq: avgRUPerReq,
            wasted: 100 - ((avgCpuEff + avgMemEff) / 2)
        };
    }, [derivedData]);

    const renderGauge = (value, label, color) => {
        const data = [
            { name: "used", value: value },
            { name: "unused", value: 100 - value },
        ];

        // Determine status
        let status = "Optimal";
        let statusColor = "text-green-500";
        if (value < 50) {
            status = "Over-provisioned";
            statusColor = "text-amber-500";
        } else if (value > 80) {
            status = "Risky";
            statusColor = "text-red-500";
        }

        return (
            <div className="flex flex-col items-center p-6 bg-white border border-gray-100 rounded-2xl dark:bg-darkBackground dark:border-gray-800">
                <div className="relative w-40 h-24">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="100%"
                                startAngle={180}
                                endAngle={0}
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={0}
                                dataKey="value"
                            >
                                <Cell key="cell-0" fill={color} />
                                <Cell key="cell-1" fill="rgba(156, 163, 175, 0.1)" />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                        <span className="text-2xl font-bold dark:text-white">{Math.round(value)}%</span>
                        <span className="text-[10px] uppercase text-gray-500">{label}</span>
                    </div>
                </div>
                <div className={`mt-4 text-sm font-semibold ${statusColor}`}>{status}</div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <TitleHeader
                title="Consumption & Resource Impact"
                subtitle="Deriving research-ready resource units from auto-scaling efficiency & rollbacks"
            />

            <TabSection tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Summary Highlights */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="p-6 bg-white border border-gray-100 rounded-2xl dark:bg-darkBackground dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-500 rounded-lg bg-opacity-10">
                            <Icon icon="mdi:server-network" className="w-6 h-6 text-blue-500" />
                        </div>
                        <span className="text-xs font-semibold text-gray-400">AVG UNIT CONSUMPTION</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div>
                            <p className="text-xs text-gray-500">Before Scale</p>
                            <p className="text-xl font-bold dark:text-gray-300">{totals.before.toFixed(1)} RU</p>
                        </div>
                        <Icon icon="mdi:arrow-right" className="text-gray-300" />
                        <div>
                            <p className="text-xs text-gray-500">After Scale</p>
                            <p className="text-xl font-bold dark:text-white">{totals.after.toFixed(1)} RU</p>
                        </div>
                        <div className={`ml-auto flex items-center gap-1 text-sm ${totals.after > totals.before ? 'text-red-500' : 'text-green-500'}`}>
                            <Icon icon={totals.after > totals.before ? 'mdi:trending-up' : 'mdi:trending-down'} />
                            {(((totals.after - totals.before) / totals.before) * 100).toFixed(0)}%
                        </div>
                    </div>
                </div>

                <div className="p-6 border border-green-200 border-dashed bg-green-50/50 rounded-2xl dark:bg-green-900/10 dark:border-green-800">
                    <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-green-500 rounded-lg bg-opacity-20">
                            <Icon icon="mdi:shield-check" className="w-6 h-6 text-green-500" />
                        </div>
                        <span className="px-2 py-0.5 text-[10px] font-bold text-green-700 bg-green-100 rounded-full dark:bg-green-900/40 dark:text-green-400">NOVELTY SAVINGS</span>
                    </div>
                    <div>
                        <p className="text-xs text-green-600 dark:text-green-400/80">Rollback Resource Savings</p>
                        <p className="text-3xl font-black text-green-600 dark:text-green-400">
                            {totals.savings.toFixed(1)} RU
                            <span className="ml-2 text-sm font-medium">/ total runtime avoided</span>
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-white border border-gray-100 rounded-2xl dark:bg-darkBackground dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-amber-500 rounded-lg bg-opacity-10">
                            <Icon icon="mdi:gauge" className="w-6 h-6 text-amber-500" />
                        </div>
                        <span className="text-xs font-semibold text-gray-400">RESEARCH KPI</span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Resource Consumption per Request</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {totals.ruPerReq.toFixed(4)} RU
                        </p>
                    </div>
                </div>
            </div>

            {activeTab === "overview" && (
                <div className="p-6 bg-white border border-gray-100 rounded-2xl dark:bg-darkBackground dark:border-gray-800">
                    <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Consumption per Request Trend</h3>
                    <Graph
                        data={derivedData}
                        xKey="time"
                        yKey="ruPerRequest"
                        chartType="line"
                        color="#3b82f6"
                        height={350}
                        showStats={true}
                    />
                </div>
            )}

            {activeTab === "efficiency" && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {renderGauge(totals.cpuEff, "CPU Efficiency", "#3b82f6")}
                    {renderGauge(totals.memEff, "Memory Efficiency", "#8b5cf6")}

                    <div className="p-6 bg-white border border-gray-100 rounded-2xl dark:bg-darkBackground dark:border-gray-800 lg:col-span-2">
                        <h3 className="mb-4 text-sm font-semibold text-gray-500">Component Validation Performance</h3>
                        <div className="space-y-4">
                            {derivedData.slice(0, 5).map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 transition-colors border border-gray-50 rounded-xl hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-darkBackgroundVery">
                                    <div className={`p-2 rounded-lg ${item.decision === 'ROLLED_BACK' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                        <Icon icon={item.decision === 'ROLLED_BACK' ? 'mdi:undo-variant' : 'mdi:check'} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-bold dark:text-gray-200">{item.deployment}</span>
                                            <span className="text-xs text-gray-400">{item.time}</span>
                                        </div>
                                        <div className="mt-1 flex gap-4">
                                            <span className="text-[10px] text-gray-500">CPU: {item.efficiency.cpu}%</span>
                                            <span className="text-[10px] text-gray-500">MEM: {item.efficiency.mem}%</span>
                                        </div>
                                    </div>
                                    <div className="text-right sm:border-l sm:pl-4 sm:dark:border-gray-700">
                                        <div className="text-sm font-bold text-green-600">
                                            {item.savings > 0 ? `Saved ${item.savings.toFixed(1)} RU` : '--'}
                                        </div>
                                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">Avoided Impact</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "wasted" && (
                <div className="space-y-6">
                    <div className="p-6 bg-white border border-gray-100 rounded-2xl dark:bg-darkBackground dark:border-gray-800">
                        <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Wasted Capacity Analysis</h3>
                        <div className="space-y-8">
                            {derivedData.slice(0, 3).map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium dark:text-gray-300">{item.deployment} - {item.time}</span>
                                        <span className="text-sm font-bold text-amber-500">{item.wasted.toFixed(1)}% Wasted</span>
                                    </div>
                                    <div className="relative h-6 overflow-hidden bg-gray-100 rounded-full dark:bg-darkBackgroundVery text-[0px]">
                                        <div
                                            className="h-full bg-blue-500 transition-all duration-1000"
                                            style={{ width: `${100 - item.wasted}%` }}
                                        >
                                            <span className="flex items-center h-full px-3 text-[10px] font-bold text-white uppercase whitespace-nowrap">Used Capacity</span>
                                        </div>
                                        <div className="absolute top-0 right-0 flex items-center h-full px-3 text-[10px] font-bold text-gray-400 uppercase">Idle</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CostResourceImpact;
