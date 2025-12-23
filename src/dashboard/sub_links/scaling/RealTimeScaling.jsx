import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import realTimeScalingData from "../../../data/realTimeScalingData";

const RealTimeScaling = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const { deployments, recentActivity } = realTimeScalingData;

    // Mock time-series data for graphs
    const [cpuData, setCpuData] = useState([
        { time: "5m", value: 45 },
        { time: "4m", value: 52 },
        { time: "3m", value: 68 },
        { time: "2m", value: 75 },
        { time: "1m", value: 72 },
        { time: "now", value: 68 },
    ]);

    const [replicaData, setReplicaData] = useState([
        { time: "30m", count: 20 },
        { time: "25m", count: 22 },
        { time: "20m", count: 25 },
        { time: "15m", count: 28 },
        { time: "10m", count: 26 },
        { time: "5m", count: 28 },
        { time: "now", count: 28 },
    ]);

    // Live deployment usage percentages
    const [liveUsage, setLiveUsage] = useState(
        deployments.reduce((acc, dep) => {
            acc[dep.name] = {
                cpu: dep.cpuUsage,
                memory: dep.memoryUsage
            };
            return acc;
        }, {})
    );

    // Calculate summary statistics
    const totalDeployments = deployments.length;
    const totalReplicas = deployments.reduce((sum, d) => sum + d.currentReplicas, 0);
    const recentEvents = recentActivity.length;
    const successRate = Math.round(
        (recentActivity.filter((a) => a.decision === "SUCCESS").length / recentActivity.length) * 100
    );

    // Real-time clock update
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);





    // Format timestamp
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const diffMs = currentTime - date;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        return date.toLocaleDateString();
    };

    // Get status badge
    const getStatusBadge = (status) => {
        const badges = {
            healthy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            scaling: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
            error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        };
        return badges[status] || badges.healthy;
    };

    // Get trend icon
    const getTrendIcon = (trend) => {
        const icons = {
            "scaling-up": { icon: "mdi:trending-up", color: "text-green-600 dark:text-green-400" },
            "scaling-down": { icon: "mdi:trending-down", color: "text-orange-600 dark:text-orange-400" },
            stable: { icon: "mdi:minus", color: "text-gray-600 dark:text-gray-400" },
        };
        return icons[trend] || icons.stable;
    };

    // Get decision badge
    const getDecisionBadge = (decision) => {
        const badges = {
            SUCCESS: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            FAILED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
            ROLLED_BACK: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        };
        return badges[decision] || badges.SUCCESS;
    };

    return (
        <div className="flex flex-col h-full">
            {/* Modern Header with Live Indicator */}
            <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                            <Icon icon="mdi:chart-timeline-variant" className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                Real-Time Scaling
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Monitor live autoscaling activity and deployment status
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800">
                        <span className="inline-flex rounded-full h-2.5 w-2.5 bg-green-600"></span>
                        <span className="text-sm font-semibold text-green-800 dark:text-green-200">LIVE</span>
                    </div>
                </div>
            </div>

            {/* Summary Cards with Pulse Animation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border border-primary/20 dark:border-primary/30 rounded-xl p-5 hover:shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10"></div>
                    <div className="flex items-center justify-between mb-3 relative z-10">
                        <div className="p-2.5 bg-primary/20 dark:bg-primary/30 rounded-lg">
                            <Icon icon="mdi:server-network" className="w-6 h-6 text-primary" />
                        </div>
                        <Icon icon="mdi:chevron-right" className="w-5 h-5 text-primary/50" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Active Deployments</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalDeployments}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 hover:shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/20 rounded-full -mr-10 -mt-10"></div>
                    <div className="flex items-center justify-between mb-3 relative z-10">
                        <div className="p-2.5 bg-blue-200 dark:bg-blue-800/50 rounded-lg">
                            <Icon icon="mdi:cube-outline" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <Icon icon="mdi:chevron-right" className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Replicas</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalReplicas}</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/10 dark:to-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-5 hover:shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-orange-200/20 rounded-full -mr-10 -mt-10"></div>
                    <div className="flex items-center justify-between mb-3 relative z-10">
                        <div className="p-2.5 bg-orange-200 dark:bg-orange-800/50 rounded-lg">
                            <Icon icon="mdi:clock-fast" className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <Icon icon="mdi:chevron-right" className="w-5 h-5 text-orange-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Recent Events</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{recentEvents}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5 hover:shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/20 rounded-full -mr-10 -mt-10"></div>
                    <div className="flex items-center justify-between mb-3 relative z-10">
                        <div className="p-2.5 bg-green-200 dark:bg-green-800/50 rounded-lg">
                            <Icon icon="mdi:check-circle" className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <Icon icon="mdi:chevron-right" className="w-5 h-5 text-green-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Success Rate</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{successRate}%</p>
                </div>
            </div>

            {/* Live Graphs Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* CPU Usage Trend */}
                <div className="bg-white dark:bg-darkBackground border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Icon icon="mdi:cpu-64-bit" className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">CPU Usage Trend</h3>
                        <div className="ml-auto flex items-center gap-1.5 px-2 py-1 bg-primary/10 rounded-full">
                            <span className="inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                            <span className="text-xs font-semibold text-primary">Live</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={cpuData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#84006A"
                                strokeWidth={3}
                                dot={{ fill: '#84006A', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Replica Count Trend */}
                <div className="bg-white dark:bg-darkBackground border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Icon icon="mdi:cube-outline" className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Replica Count Trend</h3>
                        <div className="ml-auto flex items-center gap-1.5 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                            <span className="inline-flex rounded-full h-1.5 w-1.5 bg-blue-600"></span>
                            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Live</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={replicaData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="#2563eb"
                                strokeWidth={2}
                                fill="url(#colorReplica)"
                            />
                            <defs>
                                <linearGradient id="colorReplica" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Deployment Status Cards */}
                <div className="lg:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <Icon icon="mdi:server" className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Deployment Status
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {deployments.map((deployment) => {
                            const trend = getTrendIcon(deployment.trend);
                            return (
                                <div
                                    key={deployment.name}
                                    className="bg-white dark:bg-darkBackground border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-primary dark:hover:border-primary hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                            <Icon icon="mdi:application" className="w-4 h-4 text-gray-500" />
                                            {deployment.name}
                                        </h4>
                                        <span
                                            className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                                                deployment.status
                                            )}`}
                                        >
                                            {deployment.status}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <Icon icon="mdi:cube-outline" className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                {deployment.currentReplicas}
                                            </span>
                                            {deployment.currentReplicas !== deployment.desiredReplicas && (
                                                <>
                                                    <Icon icon="mdi:arrow-right" className="w-4 h-4 text-gray-400" />
                                                    <span className="text-xl font-semibold text-gray-600 dark:text-gray-400">
                                                        {deployment.desiredReplicas}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        <Icon icon={trend.icon} className={`w-6 h-6 ml-auto ${trend.color}`} />
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex items-center justify-between text-xs mb-1.5">
                                                <span className="font-medium text-gray-600 dark:text-gray-400">CPU Usage</span>
                                                <span className="font-bold text-gray-900 dark:text-gray-100">
                                                    {liveUsage[deployment.name]?.cpu || deployment.cpuUsage}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full transition-all duration-1000 ease-in-out"
                                                    style={{ width: `${liveUsage[deployment.name]?.cpu || deployment.cpuUsage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between text-xs mb-1.5">
                                                <span className="font-medium text-gray-600 dark:text-gray-400">Memory Usage</span>
                                                <span className="font-bold text-gray-900 dark:text-gray-100">
                                                    {liveUsage[deployment.name]?.memory || deployment.memoryUsage}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-in-out"
                                                    style={{ width: `${liveUsage[deployment.name]?.memory || deployment.memoryUsage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs">
                                        <span className="font-medium text-gray-600 dark:text-gray-400">
                                            {deployment.lastAction}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-500">
                                            {formatTime(deployment.lastScalingTime)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="lg:col-span-1">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                <Icon icon="mdi:history" className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Recent Activity
                            </h3>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/10 rounded-full border border-blue-200 dark:border-blue-800">
                            <div className="inline-flex rounded-full h-2 w-2 bg-blue-600"></div>
                            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">LIVE</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-darkBackground border border-gray-200 dark:border-gray-700 rounded-xl p-4 max-h-[500px] overflow-y-auto">
                        <div className="space-y-3">
                            {recentActivity.map((activity, index) => {
                                const isVeryRecent = new Date(currentTime - new Date(activity.timestamp)) < 5 * 60 * 1000;
                                return (
                                    <div
                                        key={index}
                                        className={`p-3 rounded-lg border ${isVeryRecent
                                            ? "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                                            : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            {isVeryRecent && (
                                                <span className="inline-flex rounded-full h-1.5 w-1.5 bg-blue-600"></span>
                                            )}
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                {formatTime(activity.timestamp)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                                {activity.deployment}
                                            </span>
                                            <span
                                                className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getDecisionBadge(
                                                    activity.decision
                                                )}`}
                                            >
                                                {activity.decision}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 mb-2">
                                            <Icon icon="mdi:swap-horizontal" className="w-4 h-4 text-gray-400" />
                                            <span className="text-xs text-gray-600 dark:text-gray-400">{activity.action}:</span>
                                            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                                {activity.from} → {activity.to}
                                            </span>
                                        </div>

                                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {activity.reason}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RealTimeScaling;