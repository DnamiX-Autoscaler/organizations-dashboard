import React, { useState } from "react";
import ServiceMetricsGroup from "./ServiceMetricsGroup";
import { Icon } from "@iconify/react";

const ProjectMetricsAccordion = ({ projectName, servicesData }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="mb-4 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-darkBackground sombra-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-darkBackgroundVery hover:bg-gray-100 dark:hover:bg-darkBackground transition-colors duration-200"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 bg-opacity-10 text-blue-500 rounded-lg">
                        <Icon icon="mdi:office-building-outline" width="20" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">
                            {projectName}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {Object.keys(servicesData).length} Services monitored
                        </p>
                    </div>
                </div>
                <Icon
                    icon="mdi:chevron-down"
                    className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                    width="24"
                />
            </button>

            {isOpen && (
                <div className="p-4 bg-white dark:bg-darkBackground">
                    {Object.entries(servicesData)
                        .sort(([serviceA], [serviceB]) => {
                            // Priority services at the top
                            const priorityServices = ['order', 'product'];
                            const aIsPriority = priorityServices.some(p => serviceA.toLowerCase().includes(p));
                            const bIsPriority = priorityServices.some(p => serviceB.toLowerCase().includes(p));
                            
                            if (aIsPriority && !bIsPriority) return -1;
                            if (!aIsPriority && bIsPriority) return 1;
                            
                            // Among priority services, order comes before product
                            if (aIsPriority && bIsPriority) {
                                if (serviceA.toLowerCase().includes('order')) return -1;
                                if (serviceB.toLowerCase().includes('order')) return 1;
                            }
                            
                            // Alphabetically sort the rest
                            return serviceA.localeCompare(serviceB);
                        })
                        .map(([serviceName, metrics]) => (
                            <ServiceMetricsGroup
                                key={serviceName}
                                serviceName={serviceName}
                                metrics={metrics}
                            />
                        ))}
                </div>
            )}
        </div>
    );
};

export default ProjectMetricsAccordion;
