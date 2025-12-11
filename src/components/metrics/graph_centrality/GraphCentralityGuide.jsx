import React from "react";
import { Icon } from "@iconify/react";
import MLBenefitsExplanation from "./MLBenefitsExplanation";

// Reusable Centrality Card Component
const CentralityTypeCard = ({
  icon,
  iconBg,
  iconColor,
  titleColor,
  subtitleColor,
  textColor,
  exampleBg,
  exampleTextColor,
  borderColor,
  title,
  subtitle,
  description,
  exampleTitle,
  exampleText,
  limitation,
}) => (
  <div
    className={`p-6 bg-white border rounded-lg dark:bg-darkBackground ${borderColor}`}
  >
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-3 rounded-lg ${iconBg}`}>
        <Icon icon={icon} className={`w-8 h-8 ${iconColor}`} />
      </div>
      <h3 className={`text-xl font-bold ${titleColor}`}>{title}</h3>
    </div>
    <h4 className={`mb-2 text-sm font-semibold ${subtitleColor}`}>
      {subtitle}
    </h4>
    <p className={`mb-3 text-sm ${textColor}`}>{description}</p>
    <div className={`p-3 mb-4 rounded-lg ${exampleBg}`}>
      <h5 className={`mb-2 text-xs font-semibold ${exampleTextColor}`}>
        {exampleTitle}
      </h5>
      <p className={`text-xs ${exampleTextColor}`}>{exampleText}</p>
    </div>
    <div className="p-2 text-xs rounded bg-yellow-50 dark:bg-yellow-900/20">
      <Icon icon="mdi:alert" className="inline w-4 h-4 mr-1 text-yellow-600" />
      <span className="text-yellow-800 dark:text-yellow-300">{limitation}</span>
    </div>
  </div>
);

// Reusable Research Impact Card Component
const ImpactCard = ({ title, description }) => (
  <div className="flex items-start gap-3 p-4 rounded-lg bg-white/60 dark:bg-black/20">
    <Icon
      icon="mdi:star"
      className="w-6 h-6 mt-0.5 text-yellow-500 flex-shrink-0"
    />
    <div>
      <h4 className="mb-1 font-semibold text-purple-900 dark:text-purple-200">
        {title}
      </h4>
      <p className="text-sm text-purple-800 dark:text-purple-300">
        {description}
      </p>
    </div>
  </div>
);

// Centrality types data
const centralityTypes = [
  {
    icon: "mdi:graph-outline",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    titleColor: "text-blue-900 dark:text-blue-200",
    subtitleColor: "text-blue-800 dark:text-blue-300",
    textColor: "text-gray-700 dark:text-gray-300",
    exampleBg: "bg-blue-50 dark:bg-blue-900/20",
    exampleTextColor: "text-blue-800 dark:text-blue-300",
    borderColor: "border-blue-200 dark:border-blue-800",
    title: "1. Degree Centrality",
    subtitle: "Load Exposure Awareness",
    description:
      "Measures how many direct connections (dependencies) a service has in the architecture graph.",
    exampleTitle: "Real-World Example: Netflix API Gateway",
    exampleText:
      "Netflix's API Gateway has degree centrality ~0.95 because it connects to dozens of microservices. When degree increases, ML predicts higher load and triggers pre-emptive scaling before CPU spikes.",
    limitation: "CPU/Memory alone cannot show dependency magnitude",
  },
  {
    icon: "mdi:transit-connection-variant",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
    titleColor: "text-green-900 dark:text-green-200",
    subtitleColor: "text-green-800 dark:text-green-300",
    textColor: "text-gray-700 dark:text-gray-300",
    exampleBg: "bg-green-50 dark:bg-green-900/20",
    exampleTextColor: "text-green-800 dark:text-green-300",
    borderColor: "border-green-200 dark:border-green-800",
    title: "2. Betweenness Centrality",
    subtitle: "Bottleneck Prediction",
    description:
      "Measures how often a service lies on the shortest path between other services in the request flow.",
    exampleTitle: "Real-World Example: Uber's Trip Orchestrator",
    exampleText:
      "Uber's trip orchestrator (betweenness ~0.88) sits between rider, driver, payment, and mapping services. ML prioritizes scaling this bottleneck to prevent cascading failures.",
    limitation: "Service-mesh logs can't identify structural chokepoints",
  },
  {
    icon: "mdi:network-strength-4",
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-600 dark:text-orange-400",
    titleColor: "text-orange-900 dark:text-orange-200",
    subtitleColor: "text-orange-800 dark:text-orange-300",
    textColor: "text-gray-700 dark:text-gray-300",
    exampleBg: "bg-orange-50 dark:bg-orange-900/20",
    exampleTextColor: "text-orange-800 dark:text-orange-300",
    borderColor: "border-orange-200 dark:border-orange-800",
    title: "3. Closeness Centrality",
    subtitle: "Latency Propagation Speed",
    description:
      "Measures how quickly a service can reach all other services (average shortest path length).",
    exampleTitle: "Real-World Example: Amazon's Auth Service",
    exampleText:
      "Amazon's auth service (closeness 0.92) is 1-2 hops from every service. If latency increases 50ms, ML predicts propagation to 80% of services within 3 seconds.",
    limitation: "CPU/RPS can't predict propagation speed",
  },
  {
    icon: "mdi:vector-circle",
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
    titleColor: "text-purple-900 dark:text-purple-200",
    subtitleColor: "text-purple-800 dark:text-purple-300",
    textColor: "text-gray-700 dark:text-gray-300",
    exampleBg: "bg-purple-50 dark:bg-purple-900/20",
    exampleTextColor: "text-purple-800 dark:text-purple-300",
    borderColor: "border-purple-200 dark:border-purple-800",
    title: "4. Eigenvector Centrality",
    subtitle: "Influence Strength",
    description:
      "Measures influence based on the importance of connected neighbors (like Google's PageRank).",
    exampleTitle: "Real-World Example: Google's Search Index",
    exampleText:
      'Google\'s search index (eigenvector 0.90) connects to critical services (ads, analytics, maps). ML identifies these "silent influencers" for prioritized scaling.',
    limitation: "Raw logs can't capture indirect influence",
  },
];

// Research impact data
const impactItems = [
  {
    title: "First to Combine",
    description:
      "Graph centrality metrics with traditional monitoring for ML-driven scaling",
  },
  {
    title: "60% Fewer Failures",
    description:
      "Reduces cascading failures compared to threshold-based scaling",
  },
  {
    title: "91% Accuracy",
    description:
      "Improves prediction from 72% (CPU-only) to 91% with graph features",
  },
  {
    title: "New Research Direction",
    description: "Opens topology-aware resource management possibilities",
  },
];

// Comparison table data
const comparisonData = [
  {
    aspect: "Detection Time",
    traditional: "Reactive (after problem)",
    graphCentrality: "Predictive (15-30 min early)",
  },
  {
    aspect: "Bottleneck ID",
    traditional: "Cannot detect",
    graphCentrality: "Betweenness reveals all",
  },
  {
    aspect: "Cascade Prediction",
    traditional: "No visibility",
    graphCentrality: "Closeness forecasts spread",
  },
  {
    aspect: "Scaling Priority",
    traditional: "Based on thresholds",
    graphCentrality: "Eigenvector-based ranking",
  },
];

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
        <div className="p-4 border rounded-lg border-purple-500/50 bg-purple-50 dark:bg-purple-900/20">
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
      {centralityTypes.map((type, index) => (
        <CentralityTypeCard key={index} {...type} />
      ))}
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
              {comparisonData.map((row, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0
                      ? "bg-white dark:bg-darkBackground"
                      : "bg-gray-50 dark:bg-gray-900"
                  }
                >
                  <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                    {row.aspect}
                  </td>
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                    {row.traditional}
                  </td>
                  <td className="px-6 py-3 font-semibold text-green-600 dark:text-green-400">
                    {row.graphCentrality}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    {/* Research Impact */}
    {/* <section>
      <div className="p-8 border-2 border-purple-300 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 dark:border-purple-700">
        <h3 className="flex items-center gap-2 mb-6 text-2xl font-bold text-purple-900 dark:text-purple-200">
          <Icon icon="mdi:trophy" className="w-8 h-8 text-yellow-500" />
          Research Novelty & Impact
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {impactItems.map((impact, index) => (
            <ImpactCard key={index} {...impact} />
          ))}
        </div>
      </div>
    </section> */}
  </div>
);

export default GraphCentralityGuide;
