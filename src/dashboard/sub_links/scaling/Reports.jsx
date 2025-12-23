import React, { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import TitleHeader from "../../../components/common/TitleHeader";
import TabSection from "../../../components/common/TabSection";
import Graph from "../../../components/common/Graph";
import scalingEventsData from "../../../data/scalingEventsData";
import rollbackHistoryData from "../../../data/rollbackHistoryData";
import { downloadDataset } from "../../../data/metricsExport";

const Reports = () => {
    const [activeTab, setActiveTab] = useState("summary");
    const [exporting, setExporting] = useState(false);

    const tabs = [
        { key: "summary", label: "Reporting Summary", icon: "mdi:chart-box-outline" },
        { key: "research", label: "Research Charts", icon: "mdi:chart-areaspline" },
        { key: "exports", label: "Exports", icon: "mdi:file-export-outline" },
    ];

    // Logic for Scaling Summary
    const stats = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const lastWeek = today - 7 * 24 * 60 * 60 * 1000;

        const dailyEvents = scalingEventsData.filter(e => new Date(e.timestamp).getTime() >= today);
        const weeklyEvents = scalingEventsData.filter(e => new Date(e.timestamp).getTime() >= lastWeek);

        const successCount = scalingEventsData.filter(e => e.decision === "SUCCESS").length;
        const failedCount = scalingEventsData.filter(e => e.decision === "FAILED").length;
        const rolledBackCount = scalingEventsData.filter(e => e.decision === "ROLLED_BACK").length;
        const totalCount = scalingEventsData.length;

        return {
            daily: dailyEvents.length,
            weekly: weeklyEvents.length,
            successRate: totalCount > 0 ? ((successCount / (successCount + failedCount)) * 100).toFixed(1) : 0,
            rollbackFreq: totalCount > 0 ? ((rolledBackCount / totalCount) * 100).toFixed(1) : 0,
            total: totalCount
        };
    }, []);

    const handleExport = async (format) => {
        setExporting(true);
        try {
            await downloadDataset(format);
        } catch (error) {
            console.error(`Failed to export ${format}:`, error);
        } finally {
            setExporting(false);
        }
    };

    const renderMetricCard = (title, value, subtitle, icon, colorClass) => (
        <div className="relative p-6 overflow-hidden transition-all duration-300 bg-white border border-gray-100 rounded-2xl dark:bg-darkBackground dark:border-gray-800 group hover:shadow-lg hover:border-primary/20">
            <div className="absolute top-0 right-0 p-4 transition-transform duration-500 transform translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2">
                <Icon icon={icon} className={`w-16 h-16 opacity-10 ${colorClass}`} />
            </div>
            <div className="relative z-10 flex flex-col h-full">
                <div className={`p-2 mb-4 rounded-lg w-fit ${colorClass} bg-opacity-10`}>
                    <Icon icon={icon} className={`w-6 h-6 ${colorClass}`} />
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
                <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {value}
                    </span>
                    <span className="text-sm font-medium text-gray-400">{subtitle}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <TitleHeader
                title="Reports and Exports"
                subtitle="Academic & operational reporting for scaling infrastructure"
            />

            <TabSection tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === "summary" && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {renderMetricCard(
                        "Daily Summary",
                        stats.daily,
                        "events today",
                        "mdi:calendar-today",
                        "text-blue-500"
                    )}
                    {renderMetricCard(
                        "Weekly Summary",
                        stats.weekly,
                        "events this week",
                        "mdi:calendar-week",
                        "text-purple-500"
                    )}
                    {renderMetricCard(
                        "Success Rate",
                        `${stats.successRate}%`,
                        "validation pass",
                        "mdi:check-circle-outline",
                        "text-green-500"
                    )}
                    {renderMetricCard(
                        "Rollback Freq",
                        `${stats.rollbackFreq}%`,
                        "of total events",
                        "mdi:history",
                        "text-red-500"
                    )}
                </div>
            )}

            {activeTab === "research" && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="p-6 bg-white border border-gray-100 rounded-2xl dark:bg-darkBackground dark:border-gray-800">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            Validation Success Rate Over Time
                        </h3>
                        <Graph
                            data={rollbackHistoryData.map(d => ({
                                time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                value: d.metrics.successRate
                            }))}
                            xKey="time"
                            yKey="value"
                            chartType="area"
                            color="#10b981"
                            height={300}
                            showControls={false}
                            showStats={true}
                        />
                    </div>
                    <div className="p-6 bg-white border border-gray-100 rounded-2xl dark:bg-darkBackground dark:border-gray-800">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            Rollback Impact Analysis
                        </h3>
                        <Graph
                            data={rollbackHistoryData.map(d => ({
                                time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                value: d.metrics.trafficRecovery
                            }))}
                            xKey="time"
                            yKey="value"
                            chartType="line"
                            color="#f43f5e"
                            height={300}
                            showControls={false}
                            showStats={true}
                        />
                    </div>
                </div>
            )}

            {activeTab === "exports" && (
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className="p-8 text-center bg-white border border-gray-100 rounded-2xl dark:bg-darkBackground dark:border-gray-800">
                        <div className="flex justify-center mb-4">
                            <div className="p-4 rounded-full bg-primary/10">
                                <Icon icon="mdi:cloud-download-outline" className="w-12 h-12 text-primary" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Export Dataset</h3>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">
                            Generate and download comprehensive scaling & operational reports in your clinical research ready format.
                        </p>
                        <div className="grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2">
                            <button
                                onClick={() => handleExport("csv")}
                                disabled={exporting}
                                className="flex items-center justify-center gap-3 px-6 py-4 text-lg font-semibold text-white transition-all rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 group"
                            >
                                <Icon icon="mdi:file-csv-outline" className="w-6 h-6 transition-transform group-hover:scale-110" />
                                Export CSV
                            </button>
                            <button
                                onClick={() => handleExport("json")}
                                disabled={exporting}
                                className="flex items-center justify-center gap-3 px-6 py-4 text-lg font-semibold text-white transition-all bg-gray-800 rounded-xl hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 group"
                            >
                                <Icon icon="mdi:file-pdf-outline" className="w-6 h-6 transition-transform group-hover:scale-110" />
                                Export PDF
                            </button>
                        </div>
                        <p className="mt-4 text-xs text-gray-400 italic">
                            * PDF export is currently being generated as JSON for research compatibility.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
