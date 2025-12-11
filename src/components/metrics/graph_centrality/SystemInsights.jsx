import React from "react";
import { Icon } from "@iconify/react";

const SystemInsights = ({ insights }) => (
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
    <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
          <Icon
            icon="mdi:alert-circle"
            className="w-6 h-6 text-red-600 dark:text-red-400"
          />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {insights.critical_services}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Critical Services
          </p>
        </div>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-300">
        Services requiring immediate scaling attention
      </p>
    </div>

    <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
          <Icon
            icon="mdi:traffic-cone"
            className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
          />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {insights.bottleneck_services}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Bottleneck Services
          </p>
        </div>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-300">
        Identified through betweenness centrality
      </p>
    </div>

    <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
          <Icon
            icon="mdi:heart-pulse"
            className="w-6 h-6 text-green-600 dark:text-green-400"
          />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {insights.system_health}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            System Health
          </p>
        </div>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-300">
        Overall architecture stability score
      </p>
    </div>
  </div>
);

export default SystemInsights;
