import React, { useState } from "react";
import { Icon } from "@iconify/react";

const ServiceCentralityTable = ({ services }) => {
    const [sortBy, setSortBy] = useState("degree_centrality");
    const [sortOrder, setSortOrder] = useState("desc");

    const sortedServices = [...services].sort((a, b) => {
        const multiplier = sortOrder === "asc" ? 1 : -1;
        return (a[sortBy] - b[sortBy]) * multiplier;
    });

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortOrder("desc");
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
            healthy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        };
        return colors[status] || colors.healthy;
    };

    const getRiskColor = (risk) => {
        const colors = {
            high: "text-red-600 dark:text-red-400",
            medium: "text-yellow-600 dark:text-yellow-400",
            low: "text-green-600 dark:text-green-400",
        };
        return colors[risk] || colors.low;
    };

    const SortIcon = ({ column }) => {
        if (sortBy !== column) return <Icon icon="mdi:unfold-more-horizontal" className="w-4 h-4 text-gray-400" />;
        return (
            <Icon
                icon={sortOrder === "asc" ? "mdi:arrow-up" : "mdi:arrow-down"}
                className="w-4 h-4 text-primary"
            />
        );
    };

    return (
        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-darkBackgroundVery">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                                Service
                            </th>
                            <th
                                onClick={() => handleSort("degree_centrality")}
                                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            >
                                <div className="flex items-center gap-2">
                                    <Icon icon="fluent:leaf-two-24-regular" className="w-4 h-4 text-green-400" />
                                    Degree
                                    <SortIcon column="degree_centrality" />
                                </div>
                            </th>
                            <th
                                onClick={() => handleSort("betweenness_centrality")}
                                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            >
                                <div className="flex items-center gap-2">
                                    <Icon icon="fluent:leaf-two-24-regular" className="w-4 h-4 text-green-400" />
                                    Betweenness
                                    <SortIcon column="betweenness_centrality" />
                                </div>
                            </th>
                            <th
                                onClick={() => handleSort("closeness_centrality")}
                                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            >
                                <div className="flex items-center gap-2">
                                    <Icon icon="fluent:leaf-two-24-regular" className="w-4 h-4 text-green-400" />
                                    Closeness
                                    <SortIcon column="closeness_centrality" />
                                </div>
                            </th>
                            <th
                                onClick={() => handleSort("eigenvector_centrality")}
                                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            >
                                <div className="flex items-center gap-2">
                                    <Icon icon="fluent:leaf-two-24-regular" className="w-4 h-4 text-green-400" />
                                    Eigenvector
                                    <SortIcon column="eigenvector_centrality" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                                Dependencies
                            </th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                                Risk Level
                            </th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-darkBackground dark:divide-gray-700">
                        {sortedServices.map((service) => (
                            <tr
                                key={service.id}
                                className="transition-colors hover:bg-gray-50 dark:hover:bg-darkBackgroundVery"
                            >
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-gray-200">
                                    {service.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap dark:text-gray-300">
                                    {(service.degree_centrality * 100).toFixed(1)}%
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap dark:text-gray-300">
                                    {(service.betweenness_centrality * 100).toFixed(1)}%
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap dark:text-gray-300">
                                    {(service.closeness_centrality * 100).toFixed(1)}%
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap dark:text-gray-300">
                                    {(service.eigenvector_centrality * 100).toFixed(1)}%
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap dark:text-gray-300">
                                    {service.dependencies}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                    <span className={getRiskColor(service.risk_level)}>
                                        {service.risk_level.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(service.status)}`}>
                                        {service.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ServiceCentralityTable;
