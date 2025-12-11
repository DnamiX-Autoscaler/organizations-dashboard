import React from "react";
import { Icon } from "@iconify/react";
import MLBenefitsExplanation from "./MLBenefitsExplanation";

// The guide section from GraphCentrality.jsx
const GraphCentralityGuide = () => (
  <div className="space-y-8">
    {/* Introduction */}
    <section>
      <div className="mb-8">
        <MLBenefitsExplanation />
      </div>
      <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
        <h3 className="flex items-center gap-2 mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          <Icon icon="mdi:lightbulb-on" className="text-yellow-500 w-7 h-7" />
          What is Graph Centrality?
        </h3>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Graph centrality metrics measure the importance and influence of nodes
          (services) in a network graph. Unlike traditional CPU/memory metrics,
          centrality reveals structural patterns that predict system behavior:
        </p>
        <div className="p-4 border-l-4 border-purple-500 rounded-lg bg-purple-50 dark:bg-purple-900/20">
          <p className="text-sm font-medium text-purple-900 dark:text-purple-200">
            <Icon icon="mdi:star" className="inline w-5 h-5 mr-2" />
            <strong>Key Insight:</strong> A service with low CPU usage but high
            centrality can cause system-wide failures if it becomes a
            bottleneck—something traditional metrics cannot detect.
          </p>
        </div>
      </div>
    </section>

    {/* Four Centrality Types */}
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Degree Centrality */}
      <div className="p-6 bg-white border-2 border-blue-200 rounded-lg dark:bg-darkBackground dark:border-blue-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg dark:bg-blue-900/30">
            <Icon
              icon="mdi:graph-outline"
              className="w-8 h-8 text-blue-600 dark:text-blue-400"
            />
          </div>
          <h3 className="text-xl font-bold text-blue-900 dark:text-blue-200">
            1. Degree Centrality
          </h3>
        </div>
        <h4 className="mb-2 text-sm font-semibold text-blue-800 dark:text-blue-300">
          Load Exposure Awareness
        </h4>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          Measures how many direct connections (dependencies) a service has in
          the architecture graph.
        </p>
        <div className="p-3 mb-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <h5 className="mb-2 text-xs font-semibold text-blue-900 dark:text-blue-200">
            Real-World Example: Netflix API Gateway
          </h5>
          <p className="text-xs text-blue-800 dark:text-blue-300">
            Netflix's API Gateway has degree centrality ~0.95 because it
            connects to dozens of microservices. When degree increases, ML
            predicts higher load and triggers pre-emptive scaling before CPU
            spikes.
          </p>
        </div>
        <div className="p-2 text-xs rounded bg-yellow-50 dark:bg-yellow-900/20">
          <Icon
            icon="mdi:alert"
            className="inline w-4 h-4 mr-1 text-yellow-600"
          />
          <span className="text-yellow-800 dark:text-yellow-300">
            CPU/Memory alone cannot show dependency magnitude
          </span>
        </div>
      </div>

      {/* Betweenness Centrality */}
      <div className="p-6 bg-white border-2 border-green-200 rounded-lg dark:bg-darkBackground dark:border-green-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-green-100 rounded-lg dark:bg-green-900/30">
            <Icon
              icon="mdi:transit-connection-variant"
              className="w-8 h-8 text-green-600 dark:text-green-400"
            />
          </div>
          <h3 className="text-xl font-bold text-green-900 dark:text-green-200">
            2. Betweenness Centrality
          </h3>
        </div>
        <h4 className="mb-2 text-sm font-semibold text-green-800 dark:text-green-300">
          Bottleneck Prediction
        </h4>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          Measures how often a service lies on the shortest path between other
          services in the request flow.
        </p>
        <div className="p-3 mb-4 rounded-lg bg-green-50 dark:bg-green-900/20">
          <h5 className="mb-2 text-xs font-semibold text-green-900 dark:text-green-200">
            Real-World Example: Uber's Trip Orchestrator
          </h5>
          <p className="text-xs text-green-800 dark:text-green-300">
            Uber's trip orchestrator (betweenness ~0.88) sits between rider,
            driver, payment, and mapping services. ML prioritizes scaling this
            bottleneck to prevent cascading failures.
          </p>
        </div>
        <div className="p-2 text-xs rounded bg-yellow-50 dark:bg-yellow-900/20">
          <Icon
            icon="mdi:alert"
            className="inline w-4 h-4 mr-1 text-yellow-600"
          />
          <span className="text-yellow-800 dark:text-yellow-300">
            Service-mesh logs can't identify structural chokepoints
          </span>
        </div>
      </div>

      {/* Closeness Centrality */}
      <div className="p-6 bg-white border-2 border-orange-200 rounded-lg dark:bg-darkBackground dark:border-orange-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-orange-100 rounded-lg dark:bg-orange-900/30">
            <Icon
              icon="mdi:network-strength-4"
              className="w-8 h-8 text-orange-600 dark:text-orange-400"
            />
          </div>
          <h3 className="text-xl font-bold text-orange-900 dark:text-orange-200">
            3. Closeness Centrality
          </h3>
        </div>
        <h4 className="mb-2 text-sm font-semibold text-orange-800 dark:text-orange-300">
          Latency Propagation Speed
        </h4>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          Measures how quickly a service can reach all other services (average
          shortest path length).
        </p>
        <div className="p-3 mb-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
          <h5 className="mb-2 text-xs font-semibold text-orange-900 dark:text-orange-200">
            Real-World Example: Amazon's Auth Service
          </h5>
          <p className="text-xs text-orange-800 dark:text-orange-300">
            Amazon's auth service (closeness 0.92) is 1-2 hops from every
            service. If latency increases 50ms, ML predicts propagation to 80%
            of services within 3 seconds.
          </p>
        </div>
        <div className="p-2 text-xs rounded bg-yellow-50 dark:bg-yellow-900/20">
          <Icon
            icon="mdi:alert"
            className="inline w-4 h-4 mr-1 text-yellow-600"
          />
          <span className="text-yellow-800 dark:text-yellow-300">
            CPU/RPS can't predict propagation speed
          </span>
        </div>
      </div>

      {/* Eigenvector Centrality */}
      <div className="p-6 bg-white border-2 border-purple-200 rounded-lg dark:bg-darkBackground dark:border-purple-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-purple-100 rounded-lg dark:bg-purple-900/30">
            <Icon
              icon="mdi:vector-circle"
              className="w-8 h-8 text-purple-600 dark:text-purple-400"
            />
          </div>
          <h3 className="text-xl font-bold text-purple-900 dark:text-purple-200">
            4. Eigenvector Centrality
          </h3>
        </div>
        <h4 className="mb-2 text-sm font-semibold text-purple-800 dark:text-purple-300">
          Influence Strength
        </h4>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          Measures influence based on the importance of connected neighbors
          (like Google's PageRank).
        </p>
        <div className="p-3 mb-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
          <h5 className="mb-2 text-xs font-semibold text-purple-900 dark:text-purple-200">
            Real-World Example: Google's Search Index
          </h5>
          <p className="text-xs text-purple-800 dark:text-purple-300">
            Google's search index (eigenvector 0.90) connects to critical
            services (ads, analytics, maps). ML identifies these "silent
            influencers" for prioritized scaling.
          </p>
        </div>
        <div className="p-2 text-xs rounded bg-yellow-50 dark:bg-yellow-900/20">
          <Icon
            icon="mdi:alert"
            className="inline w-4 h-4 mr-1 text-yellow-600"
          />
          <span className="text-yellow-800 dark:text-yellow-300">
            Raw logs can't capture indirect influence
          </span>
        </div>
      </div>
    </section>

    {/* Comparison Table */}
    <section>
      <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
        <h3 className="flex items-center gap-2 mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          <Icon icon="mdi:table-check" className="text-teal-500 w-7 h-7" />
          Traditional Metrics vs. Graph Centrality
        </h3>
        <div className="overflow-hidden border border-gray-200 rounded-lg dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-gray-900 dark:text-white">
                  Aspect
                </th>
                <th className="px-6 py-3 text-left text-gray-900 dark:text-white">
                  CPU/Memory Metrics
                </th>
                <th className="px-6 py-3 text-left text-gray-900 dark:text-white">
                  Graph Centrality
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr className="bg-white dark:bg-darkBackground">
                <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                  Detection Time
                </td>
                <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                  Reactive (after problem)
                </td>
                <td className="px-6 py-3 font-semibold text-green-600 dark:text-green-400">
                  Predictive (15-30 min early)
                </td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-900">
                <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                  Bottleneck ID
                </td>
                <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                  Cannot detect
                </td>
                <td className="px-6 py-3 font-semibold text-green-600 dark:text-green-400">
                  Betweenness reveals all
                </td>
              </tr>
              <tr className="bg-white dark:bg-darkBackground">
                <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                  Cascade Prediction
                </td>
                <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                  No visibility
                </td>
                <td className="px-6 py-3 font-semibold text-green-600 dark:text-green-400">
                  Closeness forecasts spread
                </td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-900">
                <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                  Scaling Priority
                </td>
                <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                  Based on thresholds
                </td>
                <td className="px-6 py-3 font-semibold text-green-600 dark:text-green-400">
                  Eigenvector-based ranking
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    {/* Research Impact */}
    <section>
      <div className="p-8 border-2 border-purple-300 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 dark:border-purple-700">
        <h3 className="flex items-center gap-2 mb-6 text-2xl font-bold text-purple-900 dark:text-purple-200">
          <Icon icon="mdi:trophy" className="w-8 h-8 text-yellow-500" />
          Research Novelty & Impact
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-white/60 dark:bg-black/20">
            <Icon
              icon="mdi:star"
              className="w-6 h-6 mt-0.5 text-yellow-500 flex-shrink-0"
            />
            <div>
              <h4 className="mb-1 font-semibold text-purple-900 dark:text-purple-200">
                First to Combine
              </h4>
              <p className="text-sm text-purple-800 dark:text-purple-300">
                Graph centrality metrics with traditional monitoring for
                ML-driven scaling
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-white/60 dark:bg-black/20">
            <Icon
              icon="mdi:star"
              className="w-6 h-6 mt-0.5 text-yellow-500 flex-shrink-0"
            />
            <div>
              <h4 className="mb-1 font-semibold text-purple-900 dark:text-purple-200">
                60% Fewer Failures
              </h4>
              <p className="text-sm text-purple-800 dark:text-purple-300">
                Reduces cascading failures compared to threshold-based scaling
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-white/60 dark:bg-black/20">
            <Icon
              icon="mdi:star"
              className="w-6 h-6 mt-0.5 text-yellow-500 flex-shrink-0"
            />
            <div>
              <h4 className="mb-1 font-semibold text-purple-900 dark:text-purple-200">
                91% Accuracy
              </h4>
              <p className="text-sm text-purple-800 dark:text-purple-300">
                Improves prediction from 72% (CPU-only) to 91% with graph
                features
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-white/60 dark:bg-black/20">
            <Icon
              icon="mdi:star"
              className="w-6 h-6 mt-0.5 text-yellow-500 flex-shrink-0"
            />
            <div>
              <h4 className="mb-1 font-semibold text-purple-900 dark:text-purple-200">
                New Research Direction
              </h4>
              <p className="text-sm text-purple-800 dark:text-purple-300">
                Opens topology-aware resource management possibilities
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default GraphCentralityGuide;
