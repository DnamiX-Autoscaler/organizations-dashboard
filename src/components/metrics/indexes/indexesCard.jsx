import React from "react";
import { Icon } from "@iconify/react";

const PressureBar = ({ label, value, color }) => {
  const pct = Math.min(100, Math.max(0, value * 100));
  return (
    <div>
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {label}
        </span>
        <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
          {pct.toFixed(1)}%
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const DirectionBadge = ({ direction, current, recommended }) => {
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
  const style = config[direction] ?? config.stable;
  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border rounded ${style.bg} ${style.text} ${style.border}`}
    >
      <Icon icon={style.icon} className="w-3 h-3" />
      <span>
        {current} → {recommended}
      </span>
    </div>
  );
};

const getPressureColor = (value) => {
  if (value >= 0.8) return "bg-red-500";
  if (value >= 0.6) return "bg-orange-500";
  if (value >= 0.4) return "bg-yellow-500";
  return "bg-green-500";
};

const IndexesCard = ({ services }) => {
  if (!services || services.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-gray-400 dark:text-gray-500">
        <Icon icon="mdi:gauge" className="w-6 h-6 mr-2" />
        No pressure index data available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {services.map((service) => {
        const cpu = parseFloat(service.cpu_pressure_index) || 0;
        const memory = parseFloat(service.memory_pressure_index) || 0;
        const io = parseFloat(service.io_pressure_index) || 0;
        const stress = parseFloat(service.stress_index) || 0;
        const timestamp = service.timestamp
          ? new Date(service.timestamp).toLocaleString()
          : "-";

        const isHighStress = stress >= 0.6;
        const headerGradient = isHighStress
          ? "from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20"
          : "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20";
        const iconBg = isHighStress
          ? "bg-red-100 dark:bg-red-900/40"
          : "bg-blue-100 dark:bg-blue-900/40";
        const iconColor = isHighStress
          ? "text-red-600 dark:text-red-400"
          : "text-blue-600 dark:text-blue-400";

        return (
          <div
            key={service.id ?? service.service_name}
            className="flex flex-col overflow-hidden bg-white border border-gray-200 rounded-xl dark:bg-darkBackground dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {/* Header */}
            <div
              className={`flex items-center gap-3 px-4 py-3 bg-gradient-to-r ${headerGradient} border-b border-gray-200 dark:border-gray-700`}
            >
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${iconBg}`}
              >
                <Icon icon="mdi:gauge" className={`w-5 h-5 ${iconColor}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {service.name ?? service.service_name ?? "-"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {service.namespace ?? "-"} · {service.service_name ?? "-"}
                </p>
              </div>
              {isHighStress && (
                <span title="High stress">
                  <Icon
                    icon="mdi:alert-circle"
                    className="w-5 h-5 text-red-500 shrink-0"
                  />
                </span>
              )}
            </div>

            {/* Body */}
            <div className="flex flex-col gap-3 p-4">
              {/* Pressure bars */}
              <PressureBar
                label="CPU Pressure"
                value={cpu}
                color={getPressureColor(cpu)}
              />
              <PressureBar
                label="Memory Pressure"
                value={memory}
                color={getPressureColor(memory)}
              />
              <PressureBar
                label="I/O Pressure"
                value={io}
                color={getPressureColor(io)}
              />
              <PressureBar
                label="Stress Index"
                value={stress}
                color={getPressureColor(stress)}
              />

              {/* Replicas + Direction */}
              <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-700">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 mb-0.5">
                    Replicas
                  </span>
                  <DirectionBadge
                    direction={service.scale_direction}
                    current={service.current_replicas}
                    recommended={service.recommended_replicas}
                  />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Icon
                    icon="mdi:clock-outline"
                    className="w-3.5 h-3.5 text-gray-400"
                  />
                  <span className="text-[11px] text-gray-400">{timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default IndexesCard;
