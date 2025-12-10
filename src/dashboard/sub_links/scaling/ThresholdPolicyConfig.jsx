import React, { useState } from "react";
import { Icon } from "@iconify/react";
import TitleHeader from "../../../components/common/TitleHeader";

const ThresholdPolicyConfig = () => {
  const [thresholds, setThresholds] = useState({
    cpu: {
      name: "CPU Threshold",
      icon: "mdi:cpu-64-bit",
      scaleUpThreshold: 75,
      scaleDownThreshold: 30,
      cooldownPeriod: 300,
      enabled: true,
      unit: "%",
    },
    memory: {
      name: "Memory Threshold",
      icon: "mdi:memory",
      scaleUpThreshold: 80,
      scaleDownThreshold: 35,
      cooldownPeriod: 300,
      enabled: true,
      unit: "%",
    },
    latency: {
      name: "Latency Threshold",
      icon: "mdi:speedometer",
      scaleUpThreshold: 500,
      scaleDownThreshold: 200,
      cooldownPeriod: 600,
      enabled: true,
      unit: "ms",
    },
    requestRate: {
      name: "Request Threshold",
      icon: "mdi:chart-line",
      scaleUpThreshold: 1000,
      scaleDownThreshold: 500,
      cooldownPeriod: 300,
      enabled: true,
      unit: "req/s",
    },
  });

  const [selectedThreshold, setSelectedThreshold] = useState(null);
  const [editValues, setEditValues] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCardClick = (key) => {
    setSelectedThreshold(key);
    setEditValues({ ...thresholds[key] });
  };

  const handleCloseModal = () => {
    setSelectedThreshold(null);
    setEditValues(null);
  };

  const handleInputChange = (field, value) => {
    setEditValues({
      ...editValues,
      [field]: field === "enabled" ? value : parseFloat(value) || 0,
    });
  };

  const handleSave = () => {
    setThresholds({
      ...thresholds,
      [selectedThreshold]: editValues,
    });
    setSaveSuccess(true);
    handleCloseModal();
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const ThresholdCard = ({ thresholdKey, data }) => (
    <div
      onClick={() => handleCardClick(thresholdKey)}
      className="bg-white dark:bg-darkBackground border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 cursor-pointer hover:border-primary dark:hover:border-primary"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg bg-primary/10 dark:bg-primary/20">
          <Icon icon={data.icon} className="w-8 h-8 text-primary" />
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold ${data.enabled
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
            }`}
        >
          {data.enabled ? "Enabled" : "Disabled"}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {data.name}
      </h3>

      {/* Threshold Values */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Icon icon="mdi:arrow-up-bold" className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Scale Up</span>
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {data.scaleUpThreshold} {data.unit}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Icon icon="mdi:arrow-down-bold" className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Scale Down</span>
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {data.scaleDownThreshold} {data.unit}
          </span>
        </div>
      </div>

      {/* Click Indicator */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <Icon icon="mdi:cursor-default-click" className="w-4 h-4" />
        <span>Click to edit</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <TitleHeader
        title="Threshold Policy Configuration"
        subtitle="Configure scaling thresholds and policies"
      />

      {/* Success Message */}
      {saveSuccess && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-2">
          <Icon icon="mdi:check-circle" className="text-green-600 dark:text-green-400 w-5 h-5" />
          <p className="text-sm text-green-700 dark:text-green-300">Configuration saved successfully!</p>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {Object.entries(thresholds).map(([key, data]) => (
          <ThresholdCard key={key} thresholdKey={key} data={data} />
        ))}
      </div>

      {/* Modal */}
      {selectedThreshold && editValues && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-primary p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Icon icon={editValues.icon} className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">{editValues.name}</h2>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-white/20 rounded-lg"
                >
                  <Icon icon="mdi:close" className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Scale Up Threshold */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Scale Up Threshold
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={editValues.scaleUpThreshold}
                    onChange={(e) => handleInputChange("scaleUpThreshold", e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary font-semibold text-lg"
                  />
                  <span className="text-gray-600 dark:text-gray-400 font-medium min-w-[60px]">
                    {editValues.unit}
                  </span>
                </div>
              </div>

              {/* Scale Down Threshold */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Scale Down Threshold
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={editValues.scaleDownThreshold}
                    onChange={(e) => handleInputChange("scaleDownThreshold", e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary font-semibold text-lg"
                  />
                  <span className="text-gray-600 dark:text-gray-400 font-medium min-w-[60px]">
                    {editValues.unit}
                  </span>
                </div>
              </div>

              {/* Enable/Disable Toggle */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={editValues.enabled}
                      onChange={(e) => handleInputChange("enabled", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:bg-primary"></div>
                    <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full peer-checked:translate-x-7 shadow-md"></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Enable threshold monitoring
                  </span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold shadow-lg"
              >
                <Icon icon="mdi:check-bold" className="w-5 h-5" />
                Save Changes
              </button>
              <button
                onClick={handleCloseModal}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-semibold"
              >
                <Icon icon="mdi:close" className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThresholdPolicyConfig;
