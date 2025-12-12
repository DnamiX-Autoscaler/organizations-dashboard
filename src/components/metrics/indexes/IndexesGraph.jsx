import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const IndexesGraph = ({ data }) => {
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
            {new Date(payload[0].payload.timestamp).toLocaleString()}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {(entry.value * 100).toFixed(1)}%
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
        Pressure Trends Over Time
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
          <XAxis
            dataKey="timestamp"
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            tickFormatter={(time) =>
              new Date(time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            }
          />
          <YAxis
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            domain={[0, 1]}
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="cpu_pressure_avg"
            name="CPU Pressure"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="memory_pressure_avg"
            name="Memory Pressure"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="io_pressure_avg"
            name="I/O Pressure"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="stress_avg"
            name="Stress Index"
            stroke="#8B5CF6"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IndexesGraph;
