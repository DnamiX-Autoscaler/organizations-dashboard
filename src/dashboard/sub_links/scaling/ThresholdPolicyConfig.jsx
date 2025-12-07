import React, { useState } from "react";
import { Icon } from "@iconify/react";
import TitleHeader from "../../../components/common/TitleHeader";
import TabSection from "../../../components/common/TabSection";

const ThresholdPolicyConfig = () => {
  const [activeTab, setActiveTab] = useState("cpu");
  const [savedConfigs, setSavedConfigs] = useState({
    cpu: {
      scaleUpThreshold: 75,
      scaleDownThreshold: 30,
      cooldownPeriod: 300,
      enabled: true,
    },
    memory: {
      scaleUpThreshold: 80,
      scaleDownThreshold: 35,
      cooldownPeriod: 300,
      enabled: true,
    },
    latency: {
      scaleUpThreshold: 500,
      scaleDownThreshold: 200,
      cooldownPeriod: 600,
      enabled: true,
    },
    requestRate: {
      scaleUpThreshold: 1000,
      scaleDownThreshold: 500,
      cooldownPeriod: 300,
      enabled: true,
    },
  });

  const [editConfigs, setEditConfigs] = useState(JSON.parse(JSON.stringify(savedConfigs)));
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const tabs = [
    { key: "cpu", label: "CPU Threshold", icon: "mdi:cpu-64-bit" },
    { key: "memory", label: "Memory Threshold", icon: "mdi:memory" },
    { key: "latency", label: "Latency Threshold", icon: "mdi:speedometer" },
    { key: "requestRate", label: "Request Rate Threshold", icon: "mdi:chart-line" },
  ];

  const getMetricLabel = (tab) => {
    const labels = {
      cpu: "CPU Utilization (%)",
      memory: "Memory Utilization (%)",
      latency: "P95 Latency (ms)",
      requestRate: "Requests per second",
    };
    return labels[tab];
  };

  const handleInputChange = (field, value) => {
    setEditConfigs({
      ...editConfigs,
      [activeTab]: {
        ...editConfigs[activeTab],
        [field]: isNaN(value) ? value : parseFloat(value),
      },
    });
  };

  const handleSave = () => {
    setSavedConfigs(JSON.parse(JSON.stringify(editConfigs)));
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancel = () => {
    setEditConfigs(JSON.parse(JSON.stringify(savedConfigs)));
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const renderThresholdCard = (label, value, unit, type, onChange) => (
    <div className={`p-4 border rounded-lg transition-all ${
      isEditing
        ? "bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 border-slate-700 dark:border-slate-600"
        : "bg-white dark:bg-darkBackground border-gray-200 dark:border-gray-700"
    }`}>
      <label className={`block text-sm font-medium mb-2 ${
        isEditing ? "text-slate-200 dark:text-slate-300" : "text-gray-700 dark:text-gray-300"
      }`}>
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!isEditing}
          className={`flex-1 px-3 py-2 border rounded-md text-sm font-semibold transition-all ${
            isEditing
              ? "border-slate-600 dark:border-slate-500 bg-slate-700 dark:bg-slate-800 text-white dark:text-slate-50 shadow-sm focus:ring-2 focus:ring-slate-400 focus:border-slate-600"
              : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-darkBackgroundVery text-gray-600 dark:text-gray-300 cursor-not-allowed"
          }`}
        />
        <span className={`text-sm font-medium min-w-[50px] ${
          isEditing ? "text-slate-300 dark:text-slate-400" : "text-gray-600 dark:text-gray-400"
        }`}>
          {unit}
        </span>
      </div>
    </div>
  );

  const currentConfig = editConfigs[activeTab];
  const metricLabel = getMetricLabel(activeTab);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <TitleHeader
        title="Threshold Policy Configuration"
        subtitle="Configure scaling thresholds and policies"
      />

      {/* Tabs */}
      <TabSection tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Success Message */}
      {saveSuccess && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-2">
          <Icon icon="mdi:check-circle" className="text-green-600 dark:text-green-400 w-5 h-5" />
          <p className="text-sm text-green-700 dark:text-green-300">Configuration saved successfully!</p>
        </div>
      )}

      {/* Configuration Section */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Current Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {metricLabel}
            </h3>
            <div className="flex items-center gap-2">
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  currentConfig.enabled
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                }`}
              >
                {currentConfig.enabled ? "Enabled" : "Disabled"}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {renderThresholdCard(
              "Scale Up Threshold",
              currentConfig.scaleUpThreshold,
              activeTab === "latency" ? "ms" : "%",
              "scaleUpThreshold",
              (value) => handleInputChange("scaleUpThreshold", value)
            )}
            {renderThresholdCard(
              "Scale Down Threshold",
              currentConfig.scaleDownThreshold,
              activeTab === "latency" ? "ms" : "%",
              "scaleDownThreshold",
              (value) => handleInputChange("scaleDownThreshold", value)
            )}
            {renderThresholdCard(
              "Cooldown Period (seconds)",
              currentConfig.cooldownPeriod,
              "s",
              "cooldownPeriod",
              (value) => handleInputChange("cooldownPeriod", value)
            )}
          </div>

          {/* Status Toggle */}
          <div className={`p-4 border rounded-lg transition-all ${
            isEditing
              ? "bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 border-slate-700 dark:border-slate-600"
              : "bg-white dark:bg-darkBackground border-gray-200 dark:border-gray-700"
          }`}>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={currentConfig.enabled}
                onChange={(e) => handleInputChange("enabled", e.target.checked)}
                disabled={!isEditing}
                className="w-4 h-4 accent-emerald-500"
              />
              <span className={`text-sm font-medium ${
                isEditing ? "text-slate-200 dark:text-slate-300" : "text-gray-700 dark:text-gray-300"
              }`}>
                Enable threshold monitoring
              </span>
            </label>
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3 mb-4">
            <Icon icon="mdi:information-outline" className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Configuration Guidelines
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                {activeTab === "cpu" && (
                  <>
                    <li>• <strong>Scale Up:</strong> Trigger scaling when CPU exceeds threshold</li>
                    <li>• <strong>Scale Down:</strong> Reduce replicas when CPU is below this</li>
                    <li>• <strong>Typical Range:</strong> Up: 70-85%, Down: 20-40%</li>
                    <li>• Higher cooldown = fewer scaling operations (less flapping)</li>
                  </>
                )}
                {activeTab === "memory" && (
                  <>
                    <li>• <strong>Scale Up:</strong> Add replicas when memory hits threshold</li>
                    <li>• <strong>Scale Down:</strong> Remove replicas when memory usage drops</li>
                    <li>• <strong>Typical Range:</strong> Up: 75-85%, Down: 30-40%</li>
                    <li>• Monitor OOM kills; adjust down threshold carefully</li>
                  </>
                )}
                {activeTab === "latency" && (
                  <>
                    <li>• <strong>Scale Up:</strong> Reduce latency by adding capacity</li>
                    <li>• <strong>Scale Down:</strong> Decrease load when latency is healthy</li>
                    <li>• <strong>Typical Range:</strong> Up: 400-800ms, Down: 100-300ms</li>
                    <li>• SLO targets should drive these values</li>
                  </>
                )}
                {activeTab === "requestRate" && (
                  <>
                    <li>• <strong>Scale Up:</strong> Add capacity when traffic spike occurs</li>
                    <li>• <strong>Scale Down:</strong> Release capacity during low-traffic periods</li>
                    <li>• <strong>Typical Range:</strong> Up: 800-2000 req/s, Down: 200-600 req/s</li>
                    <li>• Consider time-based patterns for predictable spikes</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        {!isEditing ? (
          <>
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-lg transition-colors font-medium shadow-sm"
            >
              <Icon icon="mdi:pencil" className="w-4 h-4" />
              Edit Configuration
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium shadow-sm"
            >
              <Icon icon="mdi:check" className="w-4 h-4" />
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 dark:bg-slate-700 hover:bg-slate-500 dark:hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
            >
              <Icon icon="mdi:close" className="w-4 h-4" />
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ThresholdPolicyConfig;
