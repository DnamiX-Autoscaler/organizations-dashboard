import React, { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import TitleHeader from "../../../components/common/TitleHeader";
import TabSection from "../../../components/common/TabSection";
import Graph from "../../../components/common/Graph";
import scalingEventsData from "../../../data/scalingEventsData";
import rollbackHistoryData from "../../../data/rollbackHistoryData";
import { downloadDataset } from "../../../data/metricsExport";
import ProjectReportCard from "./ProjectReportCard";
import FilterDropdown from "../../../components/common/FilterDropdown";
import ClearFilterButton from "../../../components/common/ClearFilterButton";

const Reports = () => {
    const [activeTab, setActiveTab] = useState("project-reports");
    const [selectedProject, setSelectedProject] = useState("");
    const [exporting, setExporting] = useState(false);

    const uniqueProjects = useMemo(
        () => [...new Set(scalingEventsData.map((item) => item.project).filter(Boolean))],
        []
    );
    const projectOptions = uniqueProjects.map((project) => ({ value: project, label: project }));

    const tabs = [
        { key: "project-reports", label: "Project Reports", icon: "mdi:chart-tree" },
        { key: "summary", label: "General Summary", icon: "mdi:chart-box-outline" },
        { key: "research", label: "Research Charts", icon: "mdi:chart-areaspline" },
        { key: "exports", label: "Exports", icon: "mdi:file-export-outline" },
    ];

    // Hierarchical Data for Reporting
    const hierarchicalReports = useMemo(() => {
        const grouped = {};

        // Combine scaling events and metrics
        rollbackHistoryData.forEach(item => {
            const proj = item.project || "Unassigned";
            const serv = item.deployment;

            if (!grouped[proj]) grouped[proj] = {};
            if (!grouped[proj][serv]) grouped[proj][serv] = item.metrics;
        });

        return grouped;
    }, []);

    const filteredEvents = useMemo(() => {
        if (!selectedProject) return scalingEventsData;
        return scalingEventsData.filter(e => e.project === selectedProject);
    }, [selectedProject]);

    // Logic for Scaling Summary
    const stats = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const lastWeek = today - 7 * 24 * 60 * 60 * 1000;

        const dailyEvents = filteredEvents.filter(e => new Date(e.timestamp).getTime() >= today);
        const weeklyEvents = filteredEvents.filter(e => new Date(e.timestamp).getTime() >= lastWeek);

        const successCount = filteredEvents.filter(e => e.decision === "SUCCESS").length;
        const failedCount = filteredEvents.filter(e => e.decision === "FAILED").length;
        const rolledBackCount = filteredEvents.filter(e => e.decision === "ROLLED_BACK").length;
        const totalCount = filteredEvents.length;

        return {
            daily: dailyEvents.length,
            weekly: weeklyEvents.length,
            successRate: totalCount > 0 ? ((successCount / (successCount + failedCount)) * 100).toFixed(1) : 0,
            rollbackFreq: totalCount > 0 ? ((rolledBackCount / totalCount) * 100).toFixed(1) : 0,
            total: totalCount
        };
    }, [filteredEvents]);

    const handleExport = async (format) => {
        setExporting(true);
        try {
            await downloadDataset(format, {
                projectName: selectedProject,
                data: rollbackHistoryData.filter(d => !selectedProject || d.project === selectedProject)
            });
        } catch (error) {
            console.error(`Failed to export ${format}:`, error);
        } finally {
            setExporting(false);
        }
    };

    const renderMetricCard = (title, value, subtitle, icon, colorClass) => (
        <div className="relative p-5 sm:p-6 overflow-hidden transition-all duration-300 bg-white border border-gray-100 rounded-2xl dark:bg-darkBackground dark:border-gray-800 group hover:shadow-lg hover:border-primary/20">
            <div className="absolute top-0 right-0 p-4 transition-transform duration-500 transform translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2">
                <Icon icon={icon} className={`w-12 h-12 sm:w-16 sm:h-16 opacity-10 ${colorClass}`} />
            </div>
            <div className="relative z-10 flex flex-col h-full">
                <div className={`p-2 mb-3 sm:mb-4 rounded-lg w-fit ${colorClass} bg-opacity-10`}>
                    <Icon icon={icon} className={`w-5 h-5 sm:w-6 sm:h-6 ${colorClass}`} />
                </div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
                <div className="flex items-baseline gap-2 mt-1 sm:mt-2">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        {value}
                    </span>
                    <span className="text-[10px] sm:text-sm font-medium text-gray-400">{subtitle}</span>
                </div>
            </div>
        </div>
    );

    const handleProjectDownload = async (projectName) => {
        setExporting(true);
        try {
            await downloadDataset("pdf", {
                projectName: projectName,
                data: rollbackHistoryData.filter(d => d.project === projectName)
            });
        } catch (error) {
            console.error(`Failed to export PDF for ${projectName}:`, error);
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="space-y-6">
            <TitleHeader
                title="Operational Reports"
                subtitle="High-level insights across multi-project infrastructure"
            />

            <TabSection tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="flex flex-wrap items-center gap-3 mb-2">
                <FilterDropdown
                    value={selectedProject}
                    onChange={setSelectedProject}
                    options={projectOptions}
                    placeholder="Filter by Project"
                />
                {selectedProject && (
                    <ClearFilterButton onClick={() => setSelectedProject("")} />
                )}
                {selectedProject && (
                    <div className="ml-auto flex items-center gap-2 text-sm">
                        <span className="p-1 px-2 bg-primary/10 text-primary rounded-md font-bold text-xs uppercase">
                            Focus: {selectedProject}
                        </span>
                    </div>
                )}
            </div>

            {activeTab === "project-reports" && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {Object.entries(hierarchicalReports)
                        .filter(([proj]) => !selectedProject || proj === selectedProject)
                        .map(([projectName, servicesData]) => (
                            <ProjectReportCard
                                key={projectName}
                                projectName={projectName}
                                servicesData={servicesData}
                                onDownload={handleProjectDownload}
                            />
                        ))}
                </div>
            )}

            {activeTab === "summary" && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {renderMetricCard(
                        "Daily Events",
                        stats.daily,
                        selectedProject ? `for ${selectedProject}` : "cluster-wide",
                        "mdi:calendar-today",
                        "text-blue-500"
                    )}
                    {renderMetricCard(
                        "Weekly Events",
                        stats.weekly,
                        selectedProject ? `for ${selectedProject}` : "cluster-wide",
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
                        "Total Recorded",
                        stats.total,
                        "events archived",
                        "mdi:database",
                        "text-amber-500"
                    )}
                </div>
            )}

            {activeTab === "research" && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="p-6 bg-white border border-gray-100 rounded-2xl dark:bg-darkBackground dark:border-gray-800">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            Success Rate Trends
                        </h3>
                        <Graph
                            data={rollbackHistoryData
                                .filter(d => !selectedProject || d.project === selectedProject)
                                .map(d => ({
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
                            Traffic Recovery Impact
                        </h3>
                        <Graph
                            data={rollbackHistoryData
                                .filter(d => !selectedProject || d.project === selectedProject)
                                .map(d => ({
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
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Export Insight Data</h3>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">
                            Download comprehensive infrastructure logs and scaling metrics in structured formats.
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;

