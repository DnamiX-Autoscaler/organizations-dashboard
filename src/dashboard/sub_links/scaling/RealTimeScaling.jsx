import React from "react";
import { Icon } from "@iconify/react";
import TitleHeader from "../../../components/common/TitleHeader";
import realTimeScalingData from "../../../data/realTimeScalingData";

const RealTimeScaling = () => {
    const { deployments, recentActivity } = realTimeScalingData;

    // Calculate summary statistics
    const totalDeployments = deployments.length;
    const totalReplicas = deployments.reduce((sum, d) => sum + d.currentReplicas, 0);
    const recentEvents = recentActivity.length;
    const successRate = Math.round(
        (recentActivity.filter((a) => a.decision === "SUCCESS").length / recentActivity.length) * 100
    );

    // Format timestamp
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
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
            {/* Header */}
            <TitleHeader
                title="Real-Time Scaling"
                subtitle="Monitor live autoscaling activity and deployment status"
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Total Deployments */}
                <div className="bg-white dark:bg-darkBackground border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Deployments</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalDeployments}</p>
                        </div>
                        <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-lg">
                            <Icon icon="mdi:server-network" className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Total Replicas */}
                <div className="bg-white dark:bg-darkBackground border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Replicas</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalReplicas}</p>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <Icon icon="mdi:cube-outline" className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                {/* Recent Events */}
                <div className="bg-white dark:bg-darkBackground border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Recent Events</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{recentEvents}</p>
                        </div>
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                            <Icon icon="mdi:clock-fast" className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                        </div>
                    </div>
                </div>

                {/* Success Rate */}
                <div className="bg-white dark:bg-darkBackground border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Success Rate</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{successRate}%</p>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                            <Icon icon="mdi:check-circle" className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Deployment Status Cards - Takes 2 columns */}
                <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Deployment Status
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {deployments.map((deployment) => {
                            const trend = getTrendIcon(deployment.trend);
                            return (
                                <div
                                    key={deployment.name}
                                    className="bg-white dark:bg-darkBackground border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary dark:hover:border-primary"
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                            {deployment.name}
                                        </h4>
                                        <span
                                            className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                                                deployment.status
                                            )}`}
                                        >
                                            {deployment.status}
                                        </span>
                                    </div>

                                    {/* Replica Count */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <Icon icon="mdi:cube-outline" className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                            {deployment.currentReplicas}
                                        </span>
                                        {deployment.currentReplicas !== deployment.desiredReplicas && (
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                → {deployment.desiredReplicas}
                                            </span>
                                        )}
                                        <Icon icon={trend.icon} className={`w-5 h-5 ml-auto ${trend.color}`} />
                                    </div>

                                    {/* Resource Usage */}
                                    <div className="space-y-2 mb-3">
                                        <div>
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="text-gray-600 dark:text-gray-400">CPU</span>
                                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                    {deployment.cpuUsage}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                                <div
                                                    className="bg-primary h-1.5 rounded-full"
                                                    style={{ width: `${deployment.cpuUsage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="text-gray-600 dark:text-gray-400">Memory</span>
                                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                    {deployment.memoryUsage}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                                <div
                                                    className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full"
                                                    style={{ width: `${deployment.memoryUsage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Last Action */}
                                    <div className="text-xs text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2">
                                        <span className="font-medium">{deployment.lastAction}</span> •{" "}
                                        {formatTime(deployment.lastScalingTime)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Activity Feed - Takes 1 column */}
                <div className="lg:col-span-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Recent Activity
                    </h3>
                    <div className="bg-white dark:bg-darkBackground border border-gray-200 dark:border-gray-700 rounded-lg p-4 max-h-[600px] overflow-y-auto">
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <div
                                    key={index}
                                    className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 last:pb-0"
                                >
                                    {/* Timestamp */}
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                        {formatTime(activity.timestamp)}
                                    </div>

                                    {/* Deployment & Action */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
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

                                    {/* Replica Change */}
                                    <div className="flex items-center gap-2 mb-2 text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">{activity.action}:</span>
                                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                                            {activity.from} → {activity.to}
                                        </span>
                                    </div>

                                    {/* Reason */}
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{activity.reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RealTimeScaling;
