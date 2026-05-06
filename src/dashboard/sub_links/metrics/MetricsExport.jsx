import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import TitleHeader from "../../../components/common/TitleHeader";
import TabSection from "../../../components/common/TabSection";
import ExportStatistics from "../../../components/metrics/export/ExportStatistics";
import MetricsFieldsTable from "../../../components/metrics/export/MetricsFieldsTable";
import MetricsDataTable from "../../../components/metrics/export/MetricsDataTable";
import { downloadDataset, metricsFields } from "../../../data/metricsExport";
import exporterService from "../../../api/services/metrics/exporter";

const MetricsExport = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [collectedRecords, setCollectedRecords] = useState([]);
  const [isCollecting, setIsCollecting] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [downloadingCSV, setDownloadingCSV] = useState(false);
  const [downloadingJSON, setDownloadingJSON] = useState(false);

  const abortRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const tabs = [
    { key: "overview", label: "Overview", icon: "mdi:view-dashboard" },
    { key: "data", label: "Metrics Data", icon: "mdi:database" },
    { key: "fields", label: "Field Definitions", icon: "mdi:table" },
  ];

  // Computed stats derived from accumulated records — same shape ExportStatistics expects
  const computedStatus = {
    isRunning: isCollecting,
    totalRecords: collectedRecords.length,
    exportPath: {
      csv: "output/dataset/metrics_dataset.csv",
      json: "output/dataset/metrics_dataset.jsonl",
    },
    stats: {
      recordsPerSecond:
        elapsedSeconds > 0
          ? +(collectedRecords.length / elapsedSeconds).toFixed(1)
          : 0,
      // ~500 bytes/record for CSV, ~620 bytes/record for JSON
      totalSize: {
        csv: +((collectedRecords.length * 500) / (1024 * 1024)).toFixed(3),
        json: +((collectedRecords.length * 620) / (1024 * 1024)).toFixed(3),
      },
      duration: elapsedSeconds,
    },
  };

  // Clean up SSE + timer on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Start SSE collection — clears previous session data first
  const handleStart = () => {
    setCollectedRecords([]);
    setElapsedSeconds(0);
    setIsCollecting(true);
    setActiveTab("data"); // auto-switch to show live table

    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    abortRef.current = new AbortController();

    exporterService.connectStream({
      signal: abortRef.current.signal,
      onOpen: () => console.log("Metrics stream connected"),
      onMessage: (batch) => {
        // batch = { "namespace/service": { ...metrics }, ... }
        // Append each new service record independently (no replacement)
        const records = Object.values(batch);
        if (records.length > 0) {
          setCollectedRecords((prev) => [...prev, ...records]);
        }
      },
      onError: (err) => {
        console.error("Metrics stream error:", err);
        handleStop();
      },
    });
  };

  // Stop collection and SSE stream
  const handleStop = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsCollecting(false);
  };

  // Export collected records as CSV
  const handleDownloadCSV = async () => {
    if (collectedRecords.length === 0) return;
    setDownloadingCSV(true);
    try {
      await downloadDataset("csv", { data: collectedRecords });
    } catch (error) {
      console.error("Failed to download CSV:", error);
    } finally {
      setDownloadingCSV(false);
    }
  };

  // Export collected records as JSON Lines
  const handleDownloadJSON = async () => {
    if (collectedRecords.length === 0) return;
    setDownloadingJSON(true);
    try {
      await downloadDataset("json", { data: collectedRecords });
    } catch (error) {
      console.error("Failed to download JSON:", error);
    } finally {
      setDownloadingJSON(false);
    }
  };

  return (
    <div className="space-y-6">
      <TitleHeader
        title="Metrics Export Pipeline"
        subtitle="Real-time metrics collection and export for ML model training"
      />

      {/* Status Banner */}
      <div
        className={`flex items-center justify-between p-4 rounded-lg border ${
          isCollecting
            ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
            : "bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-700"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              isCollecting ? "bg-green-500 animate-pulse" : "bg-gray-400"
            }`}
          />
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Collection Status: {isCollecting ? "Running" : "Stopped"}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {isCollecting
                ? `Collecting from live stream — ${collectedRecords.length.toLocaleString()} records accumulated (${elapsedSeconds}s)`
                : collectedRecords.length > 0
                  ? `Collection stopped — ${collectedRecords.length.toLocaleString()} records ready for export`
                  : "Start the pipeline to begin collecting metrics"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {!isCollecting ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all rounded-lg bg-primary hover:bg-primary/90"
            >
              <Icon icon="mdi:play" className="w-4 h-4" />
              Start Collection
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all bg-red-500 rounded-lg hover:bg-red-600"
            >
              <Icon icon="mdi:stop" className="w-4 h-4" />
              Stop Collection
            </button>
          )}
        </div>
      </div>

      {/* Live Statistics */}
      <ExportStatistics status={computedStatus} />

      {/* Tabs */}
      <TabSection
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Export Paths */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Export Files
            </h3>
            <div className="space-y-4">
              {/* CSV Export */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-darkBackgroundVery">
                <div className="flex items-center gap-3">
                  <Icon
                    icon="mdi:file-delimited"
                    className="w-8 h-8 text-purple-600"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      CSV Dataset
                    </p>
                    <p className="font-mono text-xs text-gray-600 dark:text-gray-400">
                      {computedStatus.exportPath.csv}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadCSV}
                  disabled={downloadingCSV || collectedRecords.length === 0}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon
                    icon={downloadingCSV ? "mdi:loading" : "mdi:download"}
                    className={`w-4 h-4 ${downloadingCSV ? "animate-spin" : ""}`}
                  />
                  {downloadingCSV ? "Downloading..." : "Download CSV"}
                </button>
              </div>

              {/* JSON Export */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-darkBackgroundVery">
                <div className="flex items-center gap-3">
                  <Icon
                    icon="mdi:code-json"
                    className="w-8 h-8 text-orange-600"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      JSON Lines Dataset
                    </p>
                    <p className="font-mono text-xs text-gray-600 dark:text-gray-400">
                      {computedStatus.exportPath.json}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadJSON}
                  disabled={downloadingJSON || collectedRecords.length === 0}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon
                    icon={downloadingJSON ? "mdi:loading" : "mdi:download"}
                    className={`w-4 h-4 ${downloadingJSON ? "animate-spin" : ""}`}
                  />
                  {downloadingJSON ? "Downloading..." : "Download JSON"}
                </button>
              </div>
            </div>
          </div>

          {/* ML Model Integration Info */}
          <div className="p-6 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Icon
                icon="mdi:information"
                className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
              />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                  Using Datasets for ML Models
                </h4>
                <ul className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>
                    • CSV format: Best for pandas, scikit-learn, and traditional
                    ML workflows
                  </li>
                  <li>
                    • JSON Lines format: Ideal for streaming data and
                    large-scale processing
                  </li>
                  <li>
                    • Datasets include {metricsFields.length} metrics across 8
                    categories
                  </li>
                  <li>
                    • Real-time collection ensures up-to-date training data
                  </li>
                  <li>
                    • Compatible with TensorFlow, PyTorch, and other ML
                    frameworks
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "data" && (
        <MetricsDataTable data={collectedRecords} isCollecting={isCollecting} />
      )}

      {activeTab === "fields" && <MetricsFieldsTable />}
    </div>
  );
};

export default MetricsExport;
