import React, { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { alertsData as staticAlertsData } from "../../../data";
import TitleHeader from "../../../components/common/TitleHeader";
import TabSection from "../../../components/common/TabSection";
import FilterDropdown from "../../../components/common/FilterDropdown";
import ClearFilterButton from "../../../components/common/ClearFilterButton";
import Table from "../../../components/common/Table";
import { useAlertsSSE } from "../../../hooks/useAlertsSSE";

const severityStyles = {
  critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  info: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
};

const statusStyles = {
  open: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
  acknowledged: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  resolved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  SUCCESS_VALIDATED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  ROLLED_BACK: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
};

const Alerts = () => {
  const alertsData = useAlertsSSE(staticAlertsData);
  const [activeTab, setActiveTab] = useState("active");
  const [selectedService, setSelectedService] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const serviceOptions = useMemo(
    () => [...new Set(alertsData.map((item) => item.service))].map((service) => ({ value: service, label: service })),
    []
  );

  const severityOptions = useMemo(
    () => [...new Set(alertsData.map((item) => item.severity))].map((severity) => ({ value: severity, label: severity })),
    []
  );

  const statusOptions = useMemo(
    () => [...new Set(alertsData.map((item) => item.status))].map((status) => ({ value: status, label: status })),
    []
  );

  const extractUnit = (threshold) => {
    if (typeof threshold !== "string") return "";
    const match = threshold.match(/[a-z%]+/i);
    return match ? match[0] : "";
  };

  const formatTimestamp = (timestamp) =>
    new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

  const formatRelative = (timestamp) => {
    const now = Date.now();
    const diffMs = now - new Date(timestamp).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const filteredData = useMemo(
    () =>
      alertsData.filter((item) => {
        if (selectedService && item.service !== selectedService) return false;
        if (selectedSeverity && item.severity !== selectedSeverity) return false;
        if (selectedStatus && item.status !== selectedStatus) return false;
        return true;
      }),
    [selectedService, selectedSeverity, selectedStatus]
  );

  const viewData = useMemo(
    () =>
      activeTab === "active"
        ? filteredData.filter((item) => item.status !== "resolved")
        : filteredData,
    [activeTab, filteredData]
  );

  const stats = useMemo(() => {
    const open = filteredData.filter((item) => item.status === "open").length;
    const acknowledged = filteredData.filter((item) => item.status === "acknowledged").length;
    const resolved = filteredData.filter((item) => item.status === "resolved").length;
    const critical = filteredData.filter((item) => item.severity === "critical").length;

    return { total: filteredData.length, open, acknowledged, resolved, critical };
  }, [filteredData]);

  const handleClearFilter = () => {
    setSelectedService("");
    setSelectedSeverity("");
    setSelectedStatus("");
  };

  const tabs = [
    { key: "active", label: "Active", icon: "mdi:alert-decagram" },
    { key: "history", label: "History", icon: "mdi:history" },
  ];

  const columns = [
    { key: "triggeredAt", label: "Triggered", icon: "mdi:clock-outline" },
    { key: "project", label: "Project", icon: "mdi:office-building", bold: true },
    { key: "service", label: "Service", icon: "mdi:server", bold: true },
    { key: "severity", label: "Severity", icon: "mdi:alert" },
    { key: "status", label: "Status", icon: "mdi:check-decagram" },
    { key: "rule", label: "Rule", icon: "mdi:script-text-outline" },
    { key: "current", label: "Current", icon: "mdi:chart-areaspline" },
    { key: "threshold", label: "Threshold", icon: "mdi:axis-arrow" },
    { key: "source", label: "Source", icon: "mdi:radar" },
  ];

  const tableData = viewData.map((item) => {
    const unit = extractUnit(item.threshold);
    const currentValue = `${item.currentValue}${unit ? ` ${unit}` : ""}`;

    // Project color coding for table
    const projectColors = {
      "Hotel Management": "text-purple-700 dark:text-purple-300",
      "Hospital Management": "text-blue-700 dark:text-blue-300",
      "Online Bookstore": "text-green-700 dark:text-green-300"
    };

    return {
      triggeredAt: formatTimestamp(item.lastSeen || item.triggeredAt),
      project: (
        <span className={`font-semibold ${projectColors[item.project] || "text-gray-900 dark:text-gray-100"}`}>
          {item.project}
        </span>
      ),
      service: item.service,
      severity: (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${severityStyles[item.severity] || "bg-gray-100 text-gray-800"}`}>
          {item.severity}
        </span>
      ),
      status: (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[item.status] || "bg-gray-100 text-gray-800"}`}>
          {item.status}
        </span>
      ),
      rule: (
        <div className="flex items-center gap-2">
          <Icon icon="mdi:shield-alert" className="w-4 h-4 text-primary" />
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 dark:text-gray-100">{item.rule}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {item.environment.toUpperCase()} • {item.node}
            </span>
          </div>
        </div>
      ),
      current: currentValue,
      threshold: item.threshold,
      source: item.source,
    };
  });

  return (
    <div className="flex flex-col h-full">
      <TitleHeader title="Scaling Alerts" subtitle="Active signals affecting autoscaling" />

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
          </span>
          <span className="text-xs font-semibold text-rose-700 dark:text-rose-200">Live signals</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>Critical
          <span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span>High
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>Medium
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>Low
        </div>
      </div>

      <TabSection tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <FilterDropdown
          value={selectedService}
          onChange={setSelectedService}
          options={serviceOptions}
          placeholder="Filter by service"
        />
        <FilterDropdown
          value={selectedSeverity}
          onChange={setSelectedSeverity}
          options={severityOptions}
          placeholder="Filter by severity"
        />
        <FilterDropdown
          value={selectedStatus}
          onChange={setSelectedStatus}
          options={statusOptions}
          placeholder="Filter by status"
        />
        {(selectedService || selectedSeverity || selectedStatus) && (
          <ClearFilterButton onClick={handleClearFilter} />
        )}
        <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold">{viewData.length}</span> of {" "}
          <span className="font-semibold">{alertsData.length}</span> alerts
        </div>
      </div>

      <div className="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 border rounded-xl bg-gradient-to-br from-rose-50 to-white dark:from-rose-900/20 dark:to-darkBackground border-rose-100 dark:border-rose-800">
          <p className="text-xs text-rose-600 dark:text-rose-200">Open</p>
          <p className="mt-1 text-3xl font-bold text-rose-700 dark:text-rose-100">{stats.open}</p>
          <p className="text-xs text-rose-500 dark:text-rose-300">Require immediate action</p>
        </div>
        <div className="p-4 border rounded-xl bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-darkBackground border-indigo-100 dark:border-indigo-800">
          <p className="text-xs text-indigo-600 dark:text-indigo-200">Acknowledged</p>
          <p className="mt-1 text-3xl font-bold text-indigo-700 dark:text-indigo-100">{stats.acknowledged}</p>
          <p className="text-xs text-indigo-500 dark:text-indigo-300">Being handled</p>
        </div>
        <div className="p-4 border rounded-xl bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-darkBackground border-emerald-100 dark:border-emerald-800">
          <p className="text-xs text-emerald-600 dark:text-emerald-200">Resolved</p>
          <p className="mt-1 text-3xl font-bold text-emerald-700 dark:text-emerald-100">{stats.resolved}</p>
          <p className="text-xs text-emerald-500 dark:text-emerald-300">Cleared in the last window</p>
        </div>
        <div className="p-4 border rounded-xl bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-darkBackground border-red-100 dark:border-red-800">
          <p className="text-xs text-red-600 dark:text-red-200">Critical</p>
          <p className="mt-1 text-3xl font-bold text-red-700 dark:text-red-100">{stats.critical}</p>
          <p className="text-xs text-red-500 dark:text-red-300">Highest severity signals</p>
        </div>
      </div>

      {activeTab === "active" && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {viewData.length === 0 && (
            <div className="sm:col-span-2 xl:col-span-3">
              <Table columns={columns} data={[]} empty="No active alerts match the filters" />
            </div>
          )}
          {viewData.map((item) => {
            // Project color coding
            const projectColors = {
              "Hotel Management": {
                bg: "bg-purple-50 dark:bg-purple-900/20",
                border: "border-purple-200 dark:border-purple-800",
                text: "text-purple-700 dark:text-purple-300",
                icon: "mdi:hotel"
              },
              "Hospital Management": {
                bg: "bg-blue-50 dark:bg-blue-900/20",
                border: "border-blue-200 dark:border-blue-800",
                text: "text-blue-700 dark:text-blue-300",
                icon: "mdi:hospital-building"
              },
              "Online Bookstore": {
                bg: "bg-green-50 dark:bg-green-900/20",
                border: "border-green-200 dark:border-green-800",
                text: "text-green-700 dark:text-green-300",
                icon: "mdi:book-open-page-variant"
              }
            };

            const projectStyle = projectColors[item.project] || {
              bg: "bg-gray-50 dark:bg-gray-900/20",
              border: "border-gray-200 dark:border-gray-800",
              text: "text-gray-700 dark:text-gray-300",
              icon: "mdi:folder"
            };

            return (
              <div
                key={item.id}
                className="p-5 border rounded-xl bg-white dark:bg-darkBackground border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* Header with Alert Icon and Badges */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <Icon icon="mdi:alert-decagram" className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.rule}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-1 rounded-full text-[11px] font-semibold uppercase ${severityStyles[item.severity]}`}>
                        {item.severity}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-[11px] font-semibold capitalize ${statusStyles[item.status]}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Project and Service Info */}
                <div className="mb-4 space-y-2">
                  <div className={`flex items-center gap-2 p-2 rounded-lg ${projectStyle.bg} ${projectStyle.border} border`}>
                    <Icon icon={projectStyle.icon} className={`w-4 h-4 ${projectStyle.text}`} />
                    <div className="flex-1">
                      <p className={`text-xs font-bold ${projectStyle.text}`}>{item.project}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-darkBackgroundVery">
                    <Icon icon="mdi:server" className="w-4 h-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{item.service}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">{item.source} • {item.environment.toUpperCase()}</p>
                    </div>
                  </div>
                </div>

                {/* Alert Description */}
                {item.description && (
                  <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                      <Icon icon="mdi:information-outline" className="inline w-3.5 h-3.5 mr-1" />
                      {item.description}
                    </p>
                  </div>
                )}

                {/* Metrics */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-darkBackgroundVery text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:chart-areaspline" className="w-4 h-4 text-primary" />
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Current</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {item.currentValue}
                        {extractUnit(item.threshold) ? ` ${extractUnit(item.threshold)}` : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:axis-arrow" className="w-4 h-4 text-gray-500" />
                    <div className="flex flex-col text-right">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Threshold</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{item.threshold}</span>
                    </div>
                  </div>
                </div>

                {/* Footer with Time and Action */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:clock-outline" className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {formatRelative(item.lastSeen || item.triggeredAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    <Icon icon="mdi:cog" className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300">{item.action}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "history" && (
        <Table columns={columns} data={tableData} empty="No alerts match the filters" />
      )}
    </div>
  );
};

export default Alerts;
