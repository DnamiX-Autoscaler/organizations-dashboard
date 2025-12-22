import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import TitleHeader from "../../../components/common/TitleHeader";
import TabSection from "../../../components/common/TabSection";
import ExportStatistics from "../../../components/metrics/export/ExportStatistics";
import MetricsFieldsTable from "../../../components/metrics/export/MetricsFieldsTable";
import MetricsDataTable from "../../../components/metrics/export/MetricsDataTable";
import {
    fetchExportStatus,
    startMetricsCollection,
    stopMetricsCollection,
    downloadDataset,
    metricsFields,
} from "../../../data/metricsExport";

const MetricsExport = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [downloadingCSV, setDownloadingCSV] = useState(false);
    const [downloadingJSON, setDownloadingJSON] = useState(false);

    const tabs = [
        { key: "overview", label: "Overview", icon: "mdi:view-dashboard" },
        { key: "data", label: "Metrics Data", icon: "mdi:database" },
        { key: "fields", label: "Field Definitions", icon: "mdi:table" },
    ];

    // Fetch status
    const loadStatus = async () => {
        setLoading(true);
        try {
            const data = await fetchExportStatus();
            setStatus(data);
        } catch (error) {
            console.error("Failed to fetch export status:", error);
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        loadStatus();
    }, []);

    // Manual refresh only
    const handleRefresh = async () => {
        await loadStatus();
    };

    // Start collection
    const handleStart = async () => {
        setActionLoading(true);
        try {
            await startMetricsCollection();
            await loadStatus();
        } catch (error) {
            console.error("Failed to start collection:", error);
        } finally {
            setActionLoading(false);
        }
    };

    // Stop collection
    const handleStop = async () => {
        setActionLoading(true);
        try {
            await stopMetricsCollection();
            await loadStatus();
        } catch (error) {
            console.error("Failed to stop collection:", error);
        } finally {
            setActionLoading(false);
        }
    };

    // Download CSV
    const handleDownloadCSV = async () => {
        setDownloadingCSV(true);
        try {
            await downloadDataset("csv");
        } catch (error) {
            console.error("Failed to download CSV:", error);
        } finally {
            setDownloadingCSV(false);
        }
    };

    // Download JSON
    const handleDownloadJSON = async () => {
        setDownloadingJSON(true);
        try {
            await downloadDataset("json");
        } catch (error) {
            console.error("Failed to download JSON:", error);
        } finally {
            setDownloadingJSON(false);
        }
    };

    if (loading || !status) {
        return (
            <div className="flex items-center justify-center py-16">
                <Icon icon="mdi:loading" className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <TitleHeader
                title="Metrics Export Pipeline"
                subtitle="Real-time metrics collection and export for ML model training"
            />

            {/* Status Banner */}
            <div
                className={`flex items-center justify-between p-4 rounded-lg border ${status.isRunning
                        ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                        : "bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-700"
                    }`}
            >
                <div className="flex items-center gap-3">
                    <div
                        className={`w-3 h-3 rounded-full ${status.isRunning ? "bg-green-500 animate-pulse" : "bg-gray-400"
                            }`}
                    />
                    <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            Collection Status: {status.isRunning ? "Running" : "Stopped"}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            {status.isRunning
                                ? "Metrics are being collected in real-time"
                                : "Start the pipeline to begin collecting metrics"}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {!status.isRunning ? (
                        <button
                            onClick={handleStart}
                            disabled={actionLoading}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50"
                        >
                            <Icon
                                icon={actionLoading ? "mdi:loading" : "mdi:play"}
                                className={`w-4 h-4 ${actionLoading ? "animate-spin" : ""}`}
                            />
                            Start Collection
                        </button>
                    ) : (
                        <button
                            onClick={handleStop}
                            disabled={actionLoading}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50"
                        >
                            <Icon
                                icon={actionLoading ? "mdi:loading" : "mdi:stop"}
                                className={`w-4 h-4 ${actionLoading ? "animate-spin" : ""}`}
                            />
                            Stop Collection
                        </button>
                    )}
                </div>
            </div>

            {/* Statistics */}
            <ExportStatistics status={status} />

            {/* Tabs */}
            <TabSection tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Tab Content */}
            {activeTab === "overview" && (
                <div className="space-y-6">
                    {/* Export Paths */}
                    <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            Export Files
                        </h3>
                        <div className="space-y-4">
                            {/* CSV Export */}
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-darkBackgroundVery">
                                <div className="flex items-center gap-3">
                                    <Icon icon="mdi:file-delimited" className="w-8 h-8 text-purple-600" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            CSV Dataset
                                        </p>
                                        <p className="font-mono text-xs text-gray-600 dark:text-gray-400">
                                            {status.exportPath.csv}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleDownloadCSV}
                                    disabled={downloadingCSV}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50"
                                >
                                    <Icon
                                        icon={downloadingCSV ? "mdi:loading" : "mdi:download"}
                                        className={`w-4 h-4 ${downloadingCSV ? "animate-spin" : ""}`}
                                    />
                                    {downloadingCSV ? "Downloading..." : "Download CSV"}
                                </button>
                            </div>

                            {/* JSON Export */}
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-darkBackgroundVery">
                                <div className="flex items-center gap-3">
                                    <Icon icon="mdi:code-json" className="w-8 h-8 text-orange-600" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            JSON Lines Dataset
                                        </p>
                                        <p className="font-mono text-xs text-gray-600 dark:text-gray-400">
                                            {status.exportPath.json}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleDownloadJSON}
                                    disabled={downloadingJSON}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50"
                                >
                                    <Icon
                                        icon={downloadingJSON ? "mdi:loading" : "mdi:download"}
                                        className={`w-4 h-4 ${downloadingJSON ? "animate-spin" : ""}`}
                                    />
                                    {downloadingJSON ? "Downloading..." : "Download JSON"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ML Model Integration Info */}
                    <div className="p-6 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
                        <div className="flex items-start gap-3">
                            <Icon icon="mdi:information" className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                                    Using Datasets for ML Models
                                </h4>
                                <ul className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-200">
                                    <li>• CSV format: Best for pandas, scikit-learn, and traditional ML workflows</li>
                                    <li>• JSON Lines format: Ideal for streaming data and large-scale processing</li>
                                    <li>• Datasets include {metricsFields.length} metrics across 8 categories</li>
                                    <li>• Real-time collection ensures up-to-date training data</li>
                                    <li>• Compatible with TensorFlow, PyTorch, and other ML frameworks</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "data" && <MetricsDataTable />}

            {activeTab === "fields" && <MetricsFieldsTable />}
        </div>
    );
};

export default MetricsExport;
