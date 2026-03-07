import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import deploymentHealthData from "../../../data/deploymentHealthData";
import ServiceMetricsGroup from "./ServiceMetricsGroup";

import { useDeploymentHealthSSE } from "../../../hooks/useDeploymentHealthSSE";

const DeploymentHealth = () => {
    const healthData = useDeploymentHealthSSE([]);
    const [selectedDeployment, setSelectedDeployment] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Handle array data from API or fallback to single object structure
    const deployments = Array.isArray(healthData) && healthData.length > 0 
        ? healthData 
        : (healthData && !Array.isArray(healthData) ? [healthData] : []);

    const handleViewDetails = (deployment) => {
        setSelectedDeployment(deployment);
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
        setTimeout(() => setSelectedDeployment(null), 300);
    };

    const {
        overallScore = 0,
        podStatus = [],
        restarts = [],
        crashLoopBackOff = [],
        nodePressure = [],
        availability = [],
        serviceAvailabilityBadges = [],
        projects = []
    } = selectedDeployment || {};

    const getStatusColor = (status) => {
        switch (status) {
            case "Healthy": return "text-green-600 dark:text-green-400";
            case "Warning": return "text-yellow-600 dark:text-yellow-400";
            case "Critical":
            case "Unhealthy": return "text-red-600 dark:text-red-400";
            default: return "text-gray-600 dark:text-gray-400";
        }
    };

    const getBgColor = (status) => {
        switch (status) {
            case "Healthy": return "bg-green-100 dark:bg-green-900/30";
            case "Warning": return "bg-yellow-100 dark:bg-yellow-900/30";
            case "Critical":
            case "Unhealthy": return "bg-red-100 dark:bg-red-900/30";
            default: return "bg-gray-100 dark:bg-gray-800";
        }
    };

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon icon="mdi:heart-pulse" className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Deployment Health</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Cluster & workload sanity gatekeeper</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            {deployments.length} Record{deployments.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            </div>

            {/* Deployments Table */}
            <div className="bg-white dark:bg-darkBackground border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase text-[10px] font-bold">
                            <tr>
                                <th className="px-5 py-3">Deployment</th>
                                <th className="px-5 py-3">Namespace</th>
                                <th className="px-5 py-3 text-center">Health Score</th>
                                <th className="px-5 py-3 text-center">Replicas</th>
                                <th className="px-5 py-3 text-center">Ready Pods</th>
                                <th className="px-5 py-3 text-center">Restarts</th>
                                <th className="px-5 py-3 text-center">CrashLoop</th>
                                <th className="px-5 py-3">Last Scaled</th>
                                <th className="px-5 py-3">Record Time</th>
                                <th className="px-5 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {deployments.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                                        <Icon icon="mdi:database-off" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>No deployment health data available</p>
                                    </td>
                                </tr>
                            ) : (
                                deployments.map((deployment, idx) => {
                                    const readyPods = (deployment.podStatus || []).filter(pod => pod.ready).length;
                                    const totalRestarts = (deployment.restarts || []).reduce((sum, r) => sum + (r.count || 0), 0);
                                    const crashLoopCount = (deployment.crashLoopBackOff || []).length;
                                    const healthScore = deployment.overallScore || 0;
                                    
                                    const getHealthColor = (score) => {
                                        if (score >= 90) return "text-green-600 dark:text-green-400";
                                        if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
                                        return "text-red-600 dark:text-red-400";
                                    };

                                    const getHealthBg = (score) => {
                                        if (score >= 90) return "bg-green-100 dark:bg-green-900/30";
                                        if (score >= 70) return "bg-yellow-100 dark:bg-yellow-900/30";
                                        return "bg-red-100 dark:bg-red-900/30";
                                    };

                                    return (
                                        <tr key={deployment._id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                            <td className="px-5 py-4 font-medium text-gray-900 dark:text-gray-200">
                                                <div className="flex items-center gap-2">
                                                    <Icon icon="mdi:kubernetes" className="w-4 h-4 text-blue-500" />
                                                    {deployment.deployment || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-gray-600 dark:text-gray-400">
                                                {deployment.namespace || 'N/A'}
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getHealthBg(healthScore)} ${getHealthColor(healthScore)}`}>
                                                    {healthScore}%
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center font-bold text-gray-900 dark:text-gray-200">
                                                {deployment.replicas || 0}
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <span className="text-gray-900 dark:text-gray-200 font-medium">
                                                    {readyPods}/{(deployment.podStatus || []).length}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <span className={`font-bold ${totalRestarts > 50 ? 'text-red-500' : totalRestarts > 20 ? 'text-yellow-500' : 'text-green-500'}`}>
                                                    {totalRestarts}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                {crashLoopCount > 0 ? (
                                                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-xs font-bold">
                                                        {crashLoopCount}
                                                    </span>
                                                ) : (
                                                    <Icon icon="mdi:check-circle" className="w-5 h-5 mx-auto text-green-500" />
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-gray-500 text-xs">
                                                {deployment.lastScaled ? new Date(deployment.lastScaled).toLocaleString() : 'N/A'}
                                            </td>
                                            <td className="px-5 py-4 text-gray-500 text-xs">
                                                {deployment.createdAt ? new Date(deployment.createdAt).toLocaleString() : 'N/A'}
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <button
                                                    onClick={() => handleViewDetails(deployment)}
                                                    className="p-2 hover:bg-primary/10 rounded-lg transition-colors group"
                                                    title="View Details"
                                                >
                                                    <Icon 
                                                        icon="mdi:eye" 
                                                        className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" 
                                                    />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Right Drawer for Detailed View */}
            {isDrawerOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                        onClick={closeDrawer}
                    />
                    
                    {/* Drawer */}
                    <div className={`fixed top-0 right-0 h-full w-full md:w-3/4 lg:w-2/3 xl:w-1/2 bg-white dark:bg-darkBackground shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                        {/* Drawer Header */}
                        <div className="sticky top-0 bg-white dark:bg-darkBackground border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Icon icon="mdi:kubernetes" className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {selectedDeployment?.deployment || 'Deployment Details'}
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {selectedDeployment?.namespace || 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closeDrawer}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <Icon icon="mdi:close" className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="p-6 space-y-6">
                            {/* Health Score Section */}
                            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                <div className={`w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center`}>
                                    <span className="text-lg font-bold text-primary">{overallScore}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Overall Health Score</p>
                                    <p className="text-2xl font-bold text-primary">{overallScore}%</p>
                                </div>
                            </div>

                            {/* Service Availability Badges */}
                            {serviceAvailabilityBadges.length > 0 && (
                                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-3">Service Availability</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {serviceAvailabilityBadges.map((badge, idx) => (
                                            <div key={idx} className={`px-3 py-2 rounded-lg text-sm font-bold ${getBgColor(badge.status)} ${getStatusColor(badge.status)}`}>
                                                {badge.service}: {badge.percentage}%
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Availability Chart */}
                            {availability.length > 0 && (
                                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Icon icon="mdi:chart-line" className="w-5 h-5 text-primary" />
                                        <h3 className="font-bold text-gray-900 dark:text-white">Service Availability %</h3>
                                    </div>
                                    <div className="h-[200px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={availability}>
                                                <defs>
                                                    <linearGradient id="colorAvail" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#84006A" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#84006A" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                                                <XAxis dataKey="time" />
                                                <YAxis />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                                    itemStyle={{ color: '#FF00E5' }}
                                                />
                                                <Area type="monotone" dataKey="value" stroke="#84006A" fillOpacity={1} fill="url(#colorAvail)" strokeWidth={2} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}

                            {/* Critical Alerts */}
                            {crashLoopBackOff.length > 0 && (
                                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                                    <div className="flex items-center gap-2 mb-4 text-red-600">
                                        <Icon icon="mdi:alert-decagram" className="w-5 h-5" />
                                        <h3 className="font-bold">Critical Alerts</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {crashLoopBackOff.map((crash, idx) => (
                                            <div key={idx} className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-sm font-bold text-red-800 dark:text-red-200">CrashLoopBackOff</span>
                                                    <span className="text-[10px] text-red-600 uppercase font-bold">Immediate Action</span>
                                                </div>
                                                <p className="text-xs text-red-700 dark:text-red-300">Service: {crash.service}</p>
                                                <p className="text-xs text-red-700 dark:text-red-300">Pod: {crash.pod}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Pod Status Table */}
                            {podStatus.length > 0 && (
                                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                                    <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                                        <Icon icon="mdi:kubernetes" className="w-5 h-5 text-blue-500" />
                                        <h3 className="font-bold text-gray-900 dark:text-white">Pod Readiness & Liveness</h3>
                                    </div>
                                    <div className="overflow-x-auto max-h-96">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase text-[10px] font-bold sticky top-0">
                                                <tr>
                                                    <th className="px-5 py-3">Pod Name</th>
                                                    <th className="px-5 py-3 text-center">Ready</th>
                                                    <th className="px-5 py-3 text-center">Liveness</th>
                                                    <th className="px-5 py-3">Age</th>
                                                    <th className="px-5 py-3">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                                {podStatus.map((pod) => (
                                                    <tr key={pod.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                                        <td className="px-5 py-4 font-medium text-gray-900 dark:text-gray-200">{pod.name}</td>
                                                        <td className="px-5 py-4 text-center">
                                                            <Icon icon={pod.ready ? "mdi:check-circle" : "mdi:close-circle"} className={`w-5 h-5 mx-auto ${pod.ready ? "text-green-500" : "text-red-500"}`} />
                                                        </td>
                                                        <td className="px-5 py-4 text-center">
                                                            <Icon icon={pod.liveness ? "mdi:check-circle" : "mdi:close-circle"} className={`w-5 h-5 mx-auto ${pod.liveness ? "text-green-500" : "text-red-500"}`} />
                                                        </td>
                                                        <td className="px-5 py-4 text-gray-500">{pod.age}</td>
                                                        <td className="px-5 py-4">
                                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${getBgColor(pod.status)} ${getStatusColor(pod.status)}`}>
                                                                {pod.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Restart Count */}
                            {restarts.length > 0 && (
                                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Icon icon="mdi:restart" className="w-5 h-5 text-orange-500" />
                                        <h3 className="font-bold text-gray-900 dark:text-white">Restart Count</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {restarts.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-gray-200">{item.service}</p>
                                                    <p className={`text-[10px] uppercase font-bold ${getStatusColor(item.status)}`}>{item.status}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-xl font-black ${getStatusColor(item.status)}`}>{item.count}</p>
                                                    <Icon icon={item.trend === "up" ? "mdi:trending-up" : "mdi:minus"} className={`w-4 h-4 ml-auto ${item.trend === "up" ? "text-red-500" : "text-gray-400"}`} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Node Pressure */}
                            {nodePressure.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="font-bold text-gray-900 dark:text-white">Node Pressure</h3>
                                    {nodePressure.map((node) => (
                                        <div key={node.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Icon icon="mdi:server-network" className="w-5 h-5 text-gray-400" />
                                                    <h4 className="font-bold text-gray-900 dark:text-white">{node.id}</h4>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold ${getBgColor(node.status)} ${getStatusColor(node.status)}`}>
                                                    {node.status} Pressure
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="text-center">
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">CPU</p>
                                                    <p className={`text-lg font-bold ${node.cpu > 80 ? "text-red-500" : "text-gray-900 dark:text-white"}`}>{node.cpu}%</p>
                                                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full mt-1">
                                                        <div className={`h-full rounded-full ${node.cpu > 80 ? "bg-red-500" : "bg-primary"}`} style={{ width: `${node.cpu}%` }}></div>
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Memory</p>
                                                    <p className={`text-lg font-bold ${node.memory > 80 ? "text-red-500" : "text-gray-900 dark:text-white"}`}>{node.memory}%</p>
                                                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full mt-1">
                                                        <div className={`h-full rounded-full ${node.memory > 80 ? "bg-red-500" : "bg-blue-500"}`} style={{ width: `${node.memory}%` }}></div>
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Disk</p>
                                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{node.disk}%</p>
                                                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full mt-1">
                                                        <div className="bg-green-500 h-full rounded-full" style={{ width: `${node.disk}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Project Service Metrics */}
                            {projects && projects.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Icon icon="mdi:server-network" className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Project Service Metrics</h3>
                                    </div>

                                    {projects.map((project, pIndex) => (
                                        <div key={pIndex} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                                            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
                                                <div className="w-1 h-5 bg-primary rounded-full"></div>
                                                <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100">{project.name}</h4>
                                            </div>
                                            {project.services && project.services.map((service, sIndex) => (
                                                <div key={sIndex} className={sIndex !== project.services.length - 1 ? "mb-6 border-b border-dashed border-gray-200 dark:border-gray-700 pb-6" : ""}>
                                                    <ServiceMetricsGroup
                                                        serviceName={service.serviceName}
                                                        metrics={service.metrics}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DeploymentHealth;
