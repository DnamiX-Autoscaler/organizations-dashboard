import React from "react";
import { Icon } from "@iconify/react";

const MLBenefitsExplanation = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="p-6 border rounded-lg border-blue-500/50 bg-blue-50 dark:bg-blue-900/20">
        <Icon
          icon="mdi:graph-outline"
          className="w-8 h-8 mb-3 text-blue-600 dark:text-blue-400"
        />
        <h4 className="mb-2 text-sm font-semibold text-blue-900 dark:text-blue-200">
          Degree → Load Exposure
        </h4>
        <p className="text-xs text-blue-700 dark:text-blue-300">
          ML learns which high-dependency services need early scaling before CPU
          spikes occur.
        </p>
      </div>

      <div className="p-6 border rounded-lg border-green-500/50 bg-green-50 dark:bg-green-900/20">
        <Icon
          icon="mdi:transit-connection-variant"
          className="w-8 h-8 mb-3 text-green-600 dark:text-green-400"
        />
        <h4 className="mb-2 text-sm font-semibold text-green-900 dark:text-green-200">
          Betweenness → Bottlenecks
        </h4>
        <p className="text-xs text-green-700 dark:text-green-300">
          Predicts cascade failures by identifying critical path services that
          service-mesh logs cannot detect.
        </p>
      </div>

      <div className="p-6 border rounded-lg border-orange-500/50 bg-orange-50 dark:bg-orange-900/20">
        <Icon
          icon="mdi:network-strength-4"
          className="w-8 h-8 mb-3 text-orange-600 dark:text-orange-400"
        />
        <h4 className="mb-2 text-sm font-semibold text-orange-900 dark:text-orange-200">
          Closeness → Propagation
        </h4>
        <p className="text-xs text-orange-700 dark:text-orange-300">
          Forecasts latency spread speed across the system—impossible with
          traditional metrics alone.
        </p>
      </div>

      <div className="p-6 border rounded-lg border-purple-500/50 bg-purple-50 dark:bg-purple-900/20">
        <Icon
          icon="mdi:vector-circle"
          className="w-8 h-8 mb-3 text-purple-600 dark:text-purple-400"
        />
        <h4 className="mb-2 text-sm font-semibold text-purple-900 dark:text-purple-200">
          Eigenvector → Influence
        </h4>
        <p className="text-xs text-purple-700 dark:text-purple-300">
          Identifies "silent influencers" for prioritized scaling—a dimension
          raw logs cannot provide.
        </p>
      </div>
    </div>
  );
};

export default MLBenefitsExplanation;
