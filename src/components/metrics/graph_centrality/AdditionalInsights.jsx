import React from 'react';

const AdditionalInsights = ({ services }) => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Top Services by Degree Centrality
            </h3>
            <div className="space-y-3">
                {[...services]
                    .sort((a, b) => b.degree_centrality - a.degree_centrality)
                    .slice(0, 5)
                    .map((service, index) => (
                        <div key={service.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-500 rounded-full">
                                    {index + 1}
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {service.name}
                                </span>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                {(service.degree_centrality * 100).toFixed(1)}%
                            </span>
                        </div>
                    ))}
            </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Top Bottleneck Services
            </h3>
            <div className="space-y-3">
                {[...services]
                    .sort((a, b) => b.betweenness_centrality - a.betweenness_centrality)
                    .slice(0, 5)
                    .map((service, index) => (
                        <div key={service.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-green-500 rounded-full">
                                    {index + 1}
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {service.name}
                                </span>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                {(service.betweenness_centrality * 100).toFixed(1)}%
                            </span>
                        </div>
                    ))}
            </div>
        </div>
    </div>
);

export default AdditionalInsights;
