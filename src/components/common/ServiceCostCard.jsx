import React from "react";
import { Icon } from "@iconify/react";

const ServiceCostCard = ({ service }) => {
    const getTrendColor = (trend) => {
        switch (trend) {
            case "stable": return "text-green-600 dark:text-green-400";
            case "increasing": return "text-amber-600 dark:text-amber-400";
            case "critical": return "text-red-600 dark:text-red-400";
            default: return "text-gray-600 dark:text-gray-400";
        }
    };

    const getTrendBg = (trend) => {
        switch (trend) {
            case "stable": return "bg-green-100 dark:bg-green-900/30";
            case "increasing": return "bg-amber-100 dark:bg-amber-900/30";
            case "critical": return "bg-red-100 dark:bg-red-900/30";
            default: return "bg-gray-100 dark:bg-gray-800";
        }
    };

    const getTrendIcon = (trend) => {
        switch (trend) {
            case "stable": return "mdi:trending-neutral";
            case "increasing": return "mdi:trending-up";
            case "critical": return "mdi:alert-circle";
            default: return "mdi:minus";
        }
    };

    const getEfficiencyColor = (efficiency) => {
        if (efficiency >= 75) return "text-green-600 dark:text-green-400";
        if (efficiency >= 60) return "text-amber-600 dark:text-amber-400";
        return "text-red-600 dark:text-red-400";
    };

    return (
        <div className="p-5 bg-white border border-gray-100 rounded-xl dark:bg-darkBackground dark:border-gray-700 hover:shadow-lg transition-all duration-300">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg bg-opacity-10">
                        <Icon icon="mdi:server" className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                        <h4 className="text-base font-bold text-gray-900 dark:text-white">
                            {service.serviceName}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {service.replicas} replicas • {service.avgRequestsPerDay.toLocaleString()} req/day
                        </p>
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${getTrendBg(service.trend)} ${getTrendColor(service.trend)}`}>
                    <Icon icon={getTrendIcon(service.trend)} className="w-4 h-4" />
                    {service.trend}
                </div>
            </div>

            {/* Cost Overview */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-1">
                        Monthly Cost
                    </p>
                    <p className="text-2xl font-black text-purple-700 dark:text-purple-300">
                        ${service.monthlyCost.toFixed(2)}
                    </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">
                        Resource Units
                    </p>
                    <p className="text-2xl font-black text-blue-700 dark:text-blue-300">
                        {service.resourceUnits} RU
                    </p>
                </div>
            </div>

            {/* Cost Breakdown */}
            <div className="mb-4">
                <h5 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Cost Breakdown
                </h5>
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-darkBackgroundVery rounded-lg">
                        <div className="flex items-center gap-2">
                            <Icon icon="mdi:cpu-64-bit" className="w-4 h-4 text-blue-500" />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">CPU</span>
                        </div>
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                            ${service.cpuCost.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-darkBackgroundVery rounded-lg">
                        <div className="flex items-center gap-2">
                            <Icon icon="mdi:memory" className="w-4 h-4 text-purple-500" />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Memory</span>
                        </div>
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                            ${service.memoryCost.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-darkBackgroundVery rounded-lg">
                        <div className="flex items-center gap-2">
                            <Icon icon="mdi:harddisk" className="w-4 h-4 text-green-500" />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Storage</span>
                        </div>
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                            ${service.storageCost.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-darkBackgroundVery rounded-lg">
                        <div className="flex items-center gap-2">
                            <Icon icon="mdi:network" className="w-4 h-4 text-amber-500" />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Network</span>
                        </div>
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                            ${service.networkCost.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Usage Metrics */}
            <div className="mb-4">
                <h5 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Resource Usage
                </h5>
                <div className="space-y-2">
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-xs text-gray-600 dark:text-gray-400">CPU</span>
                            <span className="text-xs font-bold text-gray-900 dark:text-white">{service.cpuUsage}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                                style={{ width: `${service.cpuUsage}%` }}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-xs text-gray-600 dark:text-gray-400">Memory</span>
                            <span className="text-xs font-bold text-gray-900 dark:text-white">{service.memoryUsage}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                                style={{ width: `${service.memoryUsage}%` }}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-xs text-gray-600 dark:text-gray-400">Storage</span>
                            <span className="text-xs font-bold text-gray-900 dark:text-white">{service.storageUsage}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                                style={{ width: `${service.storageUsage}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Metrics */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Cost/Request</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                        ${service.costPerRequest.toFixed(3)}
                    </p>
                </div>
                <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
                <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Efficiency</p>
                    <p className={`text-sm font-bold ${getEfficiencyColor(service.efficiency)}`}>
                        {service.efficiency}%
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ServiceCostCard;
