import React, { useState } from "react";
import { Icon } from "@iconify/react";
import TitleHeader from "../../../components/common/TitleHeader";
import PerformanceGraph from "../../../components/metrics/performance/PerformanceGraph";
import FilterDropdown from "../../../components/common/FilterDropdown";
import performanceData from "../../../data/performanceData";

const Performance = () => {
    const [selectedResource, setSelectedResource] = useState("cpu");
    const [selectedClusterId, setSelectedClusterId] = useState(performanceData.clusters[0].id);

    // Get current cluster data
    const currentCluster = performanceData.clusters.find(c => c.id === selectedClusterId);

    // Prepare cluster options for dropdown
    const clusterOptions = performanceData.clusters.map(cluster => ({
        value: cluster.id,
        label: cluster.name,
    }));

    // Resource configurations
    const resourceConfig = {
        cpu: {
            title: "CPU",
            subtitle: "% Utilization",
            color: "#0EA5E9",
            data: currentCluster.cpu.history,
            metrics: [
                { label: "Utilization", value: `${currentCluster.cpu.utilization}%` },
                { label: "Speed", value: `${currentCluster.cpu.speed} GHz` },
                { label: "Processes", value: currentCluster.systemInfo.processes },
                { label: "Threads", value: currentCluster.systemInfo.threads },
                { label: "Cores", value: currentCluster.cpu.cores },
                { label: "Logical processors", value: currentCluster.cpu.threads },
                { label: "Handles", value: currentCluster.systemInfo.handles.toLocaleString() },
                { label: "Up time", value: currentCluster.systemInfo.uptime },
            ],
        },
        memory: {
            title: "Memory",
            subtitle: "GB In Use",
            color: "#10B981",
            data: currentCluster.memory.history,
            metrics: [
                { label: "In Use", value: `${currentCluster.memory.used} GB (${currentCluster.memory.percentage}%)` },
                { label: "Available", value: `${currentCluster.memory.available} GB` },
                { label: "Total", value: `${currentCluster.memory.total} GB` },
                { label: "Cached", value: `${currentCluster.memory.cached} GB` },
                { label: "Committed", value: `${currentCluster.memory.used}/${currentCluster.memory.total} GB` },
                { label: "Paged pool", value: "N/A" },
                { label: "Non-paged pool", value: "N/A" },
                { label: "Speed", value: "3200 MHz" },
            ],
        },
        disk: {
            title: "Disk (PVC)",
            subtitle: "% Active Time",
            color: "#8B5CF6",
            data: [],
            metrics: [
                { label: "Active Time", value: `${currentCluster.disk.activeTime}%` },
                { label: "Read Speed", value: `${currentCluster.disk.readSpeed} MB/s` },
                { label: "Write Speed", value: `${currentCluster.disk.writeSpeed} MB/s` },
                { label: "Total Capacity", value: `${currentCluster.disk.totalCapacity} GB` },
                { label: "Used", value: `${currentCluster.disk.used} GB` },
                { label: "Available", value: `${currentCluster.disk.totalCapacity - currentCluster.disk.used} GB` },
                { label: "Type", value: "Persistent Volume Claims" },
                { label: "Storage Class", value: "managed-premium" },
            ],
        },
        network: {
            title: "Network",
            subtitle: "Cluster Network Traffic",
            color: "#F59E0B",
            data: [],
            metrics: [
                { label: "Send", value: `${currentCluster.network.send} Kbps` },
                { label: "Receive", value: `${currentCluster.network.receive} Kbps` },
                { label: "Total Throughput", value: `${currentCluster.network.send + currentCluster.network.receive} Kbps` },
                { label: "Connections", value: currentCluster.network.connections },
                { label: "Network Type", value: "Virtual Network" },
                { label: "Adapter", value: "Azure Virtual Network" },
                { label: "Link Speed", value: "10 Gbps" },
                { label: "Status", value: "Connected" },
            ],
        },
    };

    const currentConfig = resourceConfig[selectedResource];

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <TitleHeader
                    title="Performance"
                    subtitle="Real-time cluster and resource monitoring"
                />
                
                {/* Cluster Selector */}
                <FilterDropdown
                    value={selectedClusterId}
                    onChange={setSelectedClusterId}
                    options={clusterOptions}
                    placeholder="Select Cluster"
                />
            </div>

            <div className="flex h-full gap-4">
                {/* Left Panel - Resource Cards */}
                <div className="flex flex-col w-1/3 space-y-3">
                    {/* CPU Card */}
                    <div
                        onClick={() => setSelectedResource("cpu")}
                        className={`flex items-center gap-3 p-3 bg-white border rounded-lg cursor-pointer dark:bg-darkBackground transition-all ${selectedResource === "cpu"
                                ? "border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-darkBackgroundVery"
                            }`}
                    >
                        <div className="w-16 h-16">
                            <PerformanceGraph
                                data={currentCluster.cpu.history}
                                color="#3B82F6"
                                height={64}
                            />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                CPU
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {currentCluster.cpu.utilization}% {currentCluster.cpu.speed} GHz
                            </div>
                        </div>
                    </div>

                    {/* Memory Card */}
                    <div
                        onClick={() => setSelectedResource("memory")}
                        className={`flex items-center gap-3 p-3 bg-white border rounded-lg cursor-pointer dark:bg-darkBackground transition-all ${selectedResource === "memory"
                                ? "border-green-500 dark:border-green-500 bg-green-50 dark:bg-green-900/20"
                                : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-darkBackgroundVery"
                            }`}
                    >
                        <div className="w-16 h-16">
                            <PerformanceGraph
                                data={currentCluster.memory.history}
                                color="#10B981"
                                height={64}
                            />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                Memory
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {currentCluster.memory.used}/{currentCluster.memory.total} GB ({currentCluster.memory.percentage}%)
                            </div>
                        </div>
                    </div>

                    {/* Disk Card */}
                    <div
                        onClick={() => setSelectedResource("disk")}
                        className={`flex items-center gap-3 p-3 bg-white border rounded-lg cursor-pointer dark:bg-darkBackground transition-all ${selectedResource === "disk"
                                ? "border-purple-500 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                                : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-darkBackgroundVery"
                            }`}
                    >
                        <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded dark:bg-darkBackgroundVery">
                            <Icon icon="mdi:harddisk" className="w-8 h-8 text-purple-500" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                Disk (PVC)
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {currentCluster.disk.activeTime}%
                            </div>
                        </div>
                    </div>

                    {/* Network Card */}
                    <div
                        onClick={() => setSelectedResource("network")}
                        className={`flex items-center gap-3 p-3 bg-white border rounded-lg cursor-pointer dark:bg-darkBackground transition-all ${selectedResource === "network"
                                ? "border-orange-500 dark:border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                                : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-darkBackgroundVery"
                            }`}
                    >
                        <div className="w-16 h-16">
                            <div className="flex items-center justify-center w-full h-full">
                                <Icon icon="mdi:wifi" className="w-8 h-8 text-orange-500" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                Network
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                S: {currentCluster.network.send} R: {currentCluster.network.receive} Kbps
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Detailed View */}
                <div className="flex-1 p-6 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {currentConfig.title}
                            </h2>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {currentCluster.name}
                            </div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            {currentConfig.subtitle}
                        </div>
                    </div>

                    {/* Large Graph - Show only for CPU and Memory */}
                    {currentConfig.data.length > 0 && (
                        <div className="mb-6" style={{ height: "280px" }}>
                            <PerformanceGraph
                                data={currentConfig.data}
                                color={currentConfig.color}
                                height={280}
                            />
                        </div>
                    )}

                    {/* No Graph Message for Disk and Network */}
                    {currentConfig.data.length === 0 && (
                        <div className="flex items-center justify-center mb-6" style={{ height: "280px" }}>
                            <div className="text-center">
                                <Icon
                                    icon="mdi:chart-timeline-variant"
                                    className="w-16 h-16 mx-auto mb-3 text-gray-300 dark:text-gray-600"
                                />
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Real-time graph available for CPU and Memory only
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 mb-6 gap-x-8 gap-y-3">
                        {currentConfig.metrics.map((metric, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">
                                    {metric.label}
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {metric.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Info Grid */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div>
                            <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                                Total Nodes
                            </div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {currentCluster.totalNodes}
                            </div>
                        </div>
                        <div>
                            <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                                Total Pods
                            </div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {currentCluster.totalPods}
                            </div>
                        </div>
                        <div>
                            <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                                Total Memory
                            </div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {currentCluster.totalMemory} GB
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Performance;
