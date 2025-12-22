import React from "react";

// Reusable card component
const CentralityCard = ({ title, services, sortKey, badgeColor }) => (
  <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
      {title}
    </h3>
    <div className="space-y-3">
      {[...services]
        .sort((a, b) => b[sortKey] - a[sortKey])
        .slice(0, 5)
        .map((service, index) => (
          <div key={service.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`flex items-center justify-center w-6 h-6 text-xs font-bold text-white ${badgeColor} rounded-full`}
              >
                {index + 1}
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {service.name}
              </span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {(service[sortKey] * 100).toFixed(1)}%
            </span>
          </div>
        ))}
    </div>
  </div>
);

const AdditionalInsights = ({ services }) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
    <CentralityCard
      title="Top Services by Degree Centrality"
      services={services}
      sortKey="degree_centrality"
      badgeColor="bg-blue-500"
    />
    <CentralityCard
      title="Top Bottleneck Services"
      services={services}
      sortKey="betweenness_centrality"
      badgeColor="bg-green-500"
    />
  </div>
);

export default AdditionalInsights;
