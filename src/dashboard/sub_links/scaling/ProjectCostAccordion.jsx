import React, { useState } from "react";
import { Icon } from "@iconify/react";
import ServiceCostCard from "../../../components/common/ServiceCostCard";

const ProjectCostAccordion = ({ project }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="mb-6 overflow-hidden border border-gray-200 rounded-2xl dark:border-gray-700 bg-white dark:bg-darkBackground shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Accordion Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-darkBackgroundVery dark:to-darkBackground hover:from-gray-100 hover:to-gray-200 dark:hover:from-darkBackground dark:hover:to-gray-800 transition-all duration-200"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-lg">
                        <Icon icon="mdi:office-building" className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {project.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {project.services.length} Services • {project.totalResourceUnits} RU
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Total Cost Display */}
                    <div className="text-right">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Monthly Cost
                        </p>
                        <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
                            ${project.totalMonthlyCost.toFixed(2)}
                        </p>
                    </div>

                    {/* Chevron Icon */}
                    <Icon
                        icon="mdi:chevron-down"
                        className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                            }`}
                        width="28"
                    />
                </div>
            </button>

            {/* Accordion Content */}
            {isOpen && (
                <div className="p-6 bg-white dark:bg-darkBackground">
                    {/* Project Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2 mb-2">
                                <Icon icon="mdi:currency-usd" className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                                    Total Cost
                                </p>
                            </div>
                            <p className="text-xl font-black text-blue-700 dark:text-blue-300">
                                ${project.totalMonthlyCost.toFixed(2)}
                            </p>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-800">
                            <div className="flex items-center gap-2 mb-2">
                                <Icon icon="mdi:chart-box" className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">
                                    Resource Units
                                </p>
                            </div>
                            <p className="text-xl font-black text-purple-700 dark:text-purple-300">
                                {project.totalResourceUnits} RU
                            </p>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2 mb-2">
                                <Icon icon="mdi:server-network" className="w-5 h-5 text-green-600 dark:text-green-400" />
                                <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase">
                                    Services
                                </p>
                            </div>
                            <p className="text-xl font-black text-green-700 dark:text-green-300">
                                {project.services.length}
                            </p>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl border border-amber-200 dark:border-amber-800">
                            <div className="flex items-center gap-2 mb-2">
                                <Icon icon="mdi:gauge" className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">
                                    Avg Efficiency
                                </p>
                            </div>
                            <p className="text-xl font-black text-amber-700 dark:text-amber-300">
                                {Math.round(
                                    project.services.reduce((acc, s) => acc + s.efficiency, 0) /
                                    project.services.length
                                )}%
                            </p>
                        </div>
                    </div>

                    {/* Service Cards Grid */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" />
                            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Service Cost Breakdown
                            </h4>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            {project.services.map((service, index) => (
                                <ServiceCostCard key={index} service={service} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectCostAccordion;
