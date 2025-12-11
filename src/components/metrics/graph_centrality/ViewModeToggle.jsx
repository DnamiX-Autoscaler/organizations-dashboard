import React from "react";
import { Icon } from "@iconify/react";

const modes = [
  { key: "overview", label: "Overview", icon: "mdi:view-dashboard" },
  { key: "table", label: "Table", icon: "mdi:table" },
    { key: "comparison", label: "Comparison", icon: "fluent-mdl2:compare-uneven" },
  { key: "guide", label: "Guide", icon: "mdi:book-open-variant" },
];

const ViewModeToggle = ({ viewMode, setViewMode }) => (
  <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg dark:bg-darkBackgroundVery">
    {modes.map((mode) => (
      <button
        key={mode.key}
        onClick={() => setViewMode(mode.key)}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
          viewMode === mode.key
            ? mode.key === "guide"
              ? "bg-primary text-white"
              : "bg-white dark:bg-darkBackground text-primary shadow-sm"
            : mode.key === "guide"
            ? "bg-black text-white hover:bg-black/80"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        }`}
      >
        <Icon icon={mode.icon} className="w-4 h-4" />
        {mode.label}
      </button>
    ))}
  </div>
);

export default ViewModeToggle;
