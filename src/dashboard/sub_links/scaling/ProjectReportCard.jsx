import React from "react";
import { Icon } from "@iconify/react";

const ProjectReportCard = ({ projectName, servicesData, onDownload }) => {
    // Aggregate stats for the project
    const serviceEntries = Object.entries(servicesData);
    const totalServices = serviceEntries.length;

    const avgSuccessRate = serviceEntries.reduce((acc, [_, metrics]) => acc + (metrics.successRate || 0), 0) / totalServices;
    const avgErrorRate = serviceEntries.reduce((acc, [_, metrics]) => acc + (metrics.errorRate || 0), 0) / totalServices;

    return (
        <div className="bg-white dark:bg-darkBackground border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
            <div className="p-4 sm:p-5 bg-gray-50 dark:bg-darkBackgroundVery border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-xl shrink-0">
                        <Icon icon="mdi:office-building" width="20" className="sm:w-6" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight truncate">
                            {projectName}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium truncate">
                            {totalServices} services
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-[10px] sm:text-xs font-bold border border-green-500/20 shrink-0">
                    <Icon icon="mdi:check-circle" width="12" className="sm:w-3.5" />
                    {avgSuccessRate.toFixed(0)}%
                </div>
            </div>

            <div className="p-4 sm:p-5 flex-grow">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
                    <div className="p-2 sm:p-3 bg-gray-50/50 dark:bg-darkBackgroundVery/50 rounded-xl border border-gray-100 dark:border-gray-800">
                        <p className="text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold mb-0.5 sm:mb-1">Total Events</p>
                        <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">24</p>
                    </div>
                    <div className="p-2 sm:p-3 bg-gray-50/50 dark:bg-darkBackgroundVery/50 rounded-xl border border-gray-100 dark:border-gray-800">
                        <p className="text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold mb-0.5 sm:mb-1">Avg Error</p>
                        <p className="text-lg sm:text-xl font-bold text-red-500">{avgErrorRate.toFixed(1)}%</p>
                    </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                    <h4 className="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Services Breakdown</h4>
                    <div className="space-y-1.5 sm:space-y-2">
                        {serviceEntries.map(([serviceName, metrics]) => (
                            <div key={serviceName} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 sm:p-3 rounded-xl border border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-darkBackgroundVery transition-colors duration-200">
                                <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 animate-pulse"></div>
                                    <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">{serviceName}</span>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-3 px-1 sm:px-0">
                                    <div className="flex items-center gap-2 sm:block text-left sm:text-right">
                                        <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium sm:hidden">Latency:</p>
                                        <p className="text-[10px] sm:text-xs font-bold text-gray-800 dark:text-gray-100">{metrics.p95LatencyAfter}ms</p>
                                    </div>
                                    <div className="h-4 w-px bg-gray-100 dark:bg-gray-800 hidden sm:block"></div>
                                    <div className="flex items-center gap-2 sm:block text-left sm:text-right">
                                        <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium sm:hidden">CPU:</p>
                                        <p className="text-[10px] sm:text-xs font-bold text-gray-800 dark:text-gray-100">{metrics.cpuPercent}%</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-5 py-3 bg-gray-50/30 dark:bg-darkBackgroundVery/30 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 mt-auto">
                <button
                    onClick={() => onDownload(projectName)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-[10px] sm:text-xs font-bold transition-all duration-200 group"
                >
                    <Icon icon="mdi:file-pdf-outline" className="w-4 h-4 transition-transform group-hover:scale-110" />
                    Download PDF
                </button>
                <button className="text-[10px] sm:text-xs font-bold text-gray-400 hover:text-primary transition-colors flex items-center gap-1">
                    Details
                    <Icon icon="mdi:arrow-right" />
                </button>
            </div>
        </div>
    );
};

export default ProjectReportCard;
