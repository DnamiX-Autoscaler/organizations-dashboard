import React from "react";
import { Icon } from "@iconify/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import deploymentHealthData from "../../../data/deploymentHealthData";
import ServiceMetricsGroup from "./ServiceMetricsGroup";

const DeploymentHealth = () => {
    const {
        overallScore,
        podStatus,
        restarts,
        crashLoopBackOff,
        nodePressure,
        availability,
        serviceAvailabilityBadges,
        projects
    } = deploymentHealthData;

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
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Overall Health Score</p>
                        <p className="text-2xl font-bold text-primary">{overallScore}%</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full border-4 border-primary flex items-center justify-center`}>
                        <span className="text-xs font-bold text-primary">{overallScore}</span>
                    </div>
                </div>
            </div>

            {/* Top Row: CrashLoopBackOff & Availability */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white dark:bg-darkBackground border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-red-600">
                        <Icon icon="mdi:alert-decagram" className="w-5 h-5" />
                        <h3 className="font-bold">Critical Alerts</h3>
                    </div>
                    <div className="space-y-4">
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

                <div className="lg:col-span-2 bg-white dark:bg-darkBackground border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Icon icon="mdi:chart-line" className="w-5 h-5 text-primary" />
                            <h3 className="font-bold text-gray-900 dark:text-white">Service Availability %</h3>
                        </div>
                        <div className="flex gap-2">
                            {serviceAvailabilityBadges.map((badge, idx) => (
                                <div key={idx} className={`px-2 py-1 rounded text-[10px] font-bold ${getBgColor(badge.status)} ${getStatusColor(badge.status)}`}>
                                    {badge.service}: {badge.percentage}%
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="h-[150px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={availability}>
                                <defs>
                                    <linearGradient id="colorAvail" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#84006A" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#84006A" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                                <XAxis dataKey="time" hide />
                                <YAxis domain={[95, 100]} hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#FF00E5' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#84006A" fillOpacity={1} fill="url(#colorAvail)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Middle Row: Pod Status Table & Restarts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-darkBackground border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                        <Icon icon="mdi:kubernetes" className="w-5 h-5 text-blue-500" />
                        <h3 className="font-bold text-gray-900 dark:text-white">Pod Readiness & Liveness</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase text-[10px] font-bold">
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

                <div className="lg:col-span-1 bg-white dark:bg-darkBackground border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Icon icon="mdi:restart" className="w-5 h-5 text-orange-500" />
                        <h3 className="font-bold text-gray-900 dark:text-white">Restart Count (5m)</h3>
                    </div>
                    <div className="space-y-4">
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
            </div>

            {/* Bottom Row: Node Pressure Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {nodePressure.map((node) => (
                    <div key={node.id} className="bg-white dark:bg-darkBackground border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <Icon icon="mdi:server-network" className="w-5 h-5 text-gray-400" />
                                <h3 className="font-bold text-gray-900 dark:text-white">{node.id}</h3>
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
            {/* Project Service Renewal Metrics */}
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <Icon icon="mdi:server-network" className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Project Service Metrics</h3>
                </div>

                {projects && projects.map((project, pIndex) => (
                    <div key={pIndex} className="bg-white dark:bg-darkBackground border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
                            <div className="w-1 h-5 bg-primary rounded-full"></div>
                            <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100">{project.name}</h4>
                        </div>
                        {project.services.map((service, sIndex) => (
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
        </div>
    );
};

export default DeploymentHealth;
