import React from "react";
import { Icon } from "@iconify/react";

const PressureBar = ({ value, color }) => (
  <div className="flex items-center gap-2">
    <div className="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700">
      <div
        className={`h-2 rounded-full ${color}`}
        style={{ width: `${value * 100}%` }}
      />
    </div>
    <span className="text-xs font-medium text-gray-900 dark:text-white">
      {(value * 100).toFixed(0)}%
    </span>
  </div>
);

const ScaleDirectionBadge = ({ direction, current, recommended }) => {
  const config = {
    up: {
      icon: "mdi:arrow-up-bold",
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-300",
      border: "border-red-300 dark:border-red-700",
    },
    down: {
      icon: "mdi:arrow-down-bold",
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-300",
      border: "border-green-300 dark:border-green-700",
    },
    stable: {
      icon: "mdi:minus",
      bg: "bg-gray-100 dark:bg-gray-700",
      text: "text-gray-700 dark:text-gray-300",
      border: "border-gray-300 dark:border-gray-600",
    },
  };

  const style = config[direction];

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center gap-1 px-2 py-1 text-xs font-medium border rounded ${style.bg} ${style.text} ${style.border}`}
      >
        <Icon icon={style.icon} className="w-3 h-3" />
        <span>
          {current} → {recommended}
        </span>
      </div>
    </div>
  );
};

const IndexesTable = ({ services }) => {
  const getPressureColor = (value) => {
    if (value >= 0.8) return "bg-red-500";
    if (value >= 0.6) return "bg-orange-500";
    if (value >= 0.4) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-darkBackgroundVery">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                Service
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                Namespace
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                Timestamp
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                CPU Pressure
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                Memory Pressure
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                I/O Pressure
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                Stress Index
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                Scaling
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-darkBackground dark:divide-gray-700">
            {services.map((service) => (
              <tr
                key={service.id ?? service.service_name}
                className="transition-colors hover:bg-gray-50 dark:hover:bg-darkBackgroundVery"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {service.name ?? service.service_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {service.service_name}
                  </p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap dark:text-gray-300">
                  {service.namespace ?? "-"}
                </td>
                <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap dark:text-gray-400">
                  {service.timestamp ? new Date(service.timestamp).toLocaleString() : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <PressureBar
                    value={service.cpu_pressure_index}
                    color={getPressureColor(service.cpu_pressure_index)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <PressureBar
                    value={service.memory_pressure_index}
                    color={getPressureColor(service.memory_pressure_index)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <PressureBar
                    value={service.io_pressure_index}
                    color={getPressureColor(service.io_pressure_index)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <PressureBar
                    value={service.stress_index}
                    color={getPressureColor(service.stress_index)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ScaleDirectionBadge
                    direction={service.scale_direction}
                    current={service.current_replicas}
                    recommended={service.recommended_replicas}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IndexesTable;
