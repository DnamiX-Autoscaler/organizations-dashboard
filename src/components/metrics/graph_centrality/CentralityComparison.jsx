import React, { useState } from "react";
import { Icon } from "@iconify/react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const CentralityComparison = ({ services }) => {
  const [selectedServices, setSelectedServices] = useState([
    services[0]?.id,
    services[1]?.id,
  ]);

  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"];

  const toggleService = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId));
    } else if (selectedServices.length < 3) {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const getRadarData = () => {
    const metrics = [
      { metric: "Degree", key: "degree_centrality" },
      { metric: "Betweenness", key: "betweenness_centrality" },
      { metric: "Closeness", key: "closeness_centrality" },
      { metric: "Eigenvector", key: "eigenvector_centrality" },
    ];

    return metrics.map((m) => {
      const dataPoint = { metric: m.metric };
      selectedServices.forEach((serviceId) => {
        const service = services.find((s) => s.id === serviceId);
        if (service) {
          dataPoint[service.name] = (service[m.key] * 100).toFixed(1);
        }
      });
      return dataPoint;
    });
  };

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const isDark = document.documentElement.classList.contains("dark");

      return (
        <div
          className="p-3 border rounded-lg"
          style={{
            backgroundColor: isDark
              ? "rgba(0, 0, 0, 0.75)"
              : "rgba(255, 255, 255, 0.95)",
            border: isDark
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "1px solid #E5E7EB",
            backdropFilter: isDark ? "blur(10px)" : "none",
            fontSize: "12px",
          }}
        >
          <p className="mb-2 font-semibold text-gray-900 dark:text-white">
            {payload[0].payload.metric}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Centrality Comparison
      </h3>

      {/* Service Selection */}
      <div className="mb-6">
        <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
          Select up to 3 services to compare (Currently:{" "}
          {selectedServices.length}/3)
        </p>
        <div className="flex flex-wrap gap-2">
          {services.map((service, index) => (
            <button
              key={service.id}
              onClick={() => toggleService(service.id)}
              disabled={
                !selectedServices.includes(service.id) &&
                selectedServices.length >= 3
              }
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                selectedServices.includes(service.id)
                  ? `text-white`
                  : "bg-gray-100 text-gray-700 dark:bg-darkBackgroundVery dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              style={
                selectedServices.includes(service.id)
                  ? {
                      backgroundColor:
                        colors[selectedServices.indexOf(service.id)],
                    }
                  : {}
              }
            >
              {service.name}
            </button>
          ))}
        </div>
      </div>

      {/* Radar Chart */}
      {selectedServices.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={getRadarData()}>
            <PolarGrid stroke="#374151" opacity={0.2} />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: "#9CA3AF", fontSize: 10 }}
            />
            {selectedServices.map((serviceId, index) => {
              const service = services.find((s) => s.id === serviceId);
              return (
                <Radar
                  key={serviceId}
                  name={service?.name}
                  dataKey={service?.name}
                  stroke={colors[index]}
                  fill={colors[index]}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              );
            })}
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }} />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center justify-center h-96">
          <Icon
            icon="mdi:radar"
            className="w-16 h-16 text-gray-300 dark:text-gray-600"
          />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Select at least one service to view comparison
          </p>
        </div>
      )}
    </div>
  );
};

export default CentralityComparison;
