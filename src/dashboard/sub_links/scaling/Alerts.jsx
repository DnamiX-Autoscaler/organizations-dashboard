import React, { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { rollbackHistoryData } from "../../../data";
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
  const alertsData = useAlertsSSE([]);
  const [activeTab, setActiveTab] = useState("active");
  const [selectedService, setSelectedService] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const serviceOptions = useMemo(
    () => [...new Set(alertsData.map((item) => item.service))].map((service) => ({ value: service, label: service })),
    [alertsData]
  );

  const severityOptions = useMemo(
    () => [...new Set(alertsData.map((item) => item.severity))].map((severity) => ({ value: severity, label: severity })),
    [alertsData]
  );

  const statusOptions = useMemo(
    () => [...new Set(alertsData.map((item) => item.status))].map((status) => ({ value: status, label: status })),
    [alertsData]
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

  // Find rollback history for an alert
  const getRollbackHistory = (alert) => {
    const isRollbackRelated = 
      alert.action?.toLowerCase().includes("rollback") || 
      alert.status === "ROLLED_BACK" ||
      alert.description?.toLowerCase().includes("rollback") ||
      alert.rollback; // Check for API rollback data
    
    if (!isRollbackRelated) return null;

    // If alert has rollback data from API, return it
    if (alert.rollback) {
      return {
        hasApiRollback: true,
        apiData: alert.rollback,
        validation: alert.validation,
        details: alert.details
      };
    }

    // Otherwise, find matching rollback history entries from static data
    const matchingRollbacks = rollbackHistoryData.filter(rb => {
      const serviceMatch = alert.service?.toLowerCase().includes(rb.deployment?.replace(/-/g, ' ')) ||
                          rb.deployment?.toLowerCase().includes(alert.service?.toLowerCase().split(' ')[0]);
      const projectMatch = alert.project?.toLowerCase().replace(/\s+/g, '-') === rb.project?.toLowerCase();
      
      return serviceMatch || projectMatch;
    }).slice(0, 2); // Show max 2 rollback entries

    return matchingRollbacks.length > 0 ? { hasApiRollback: false, staticData: matchingRollbacks } : null;
  };

  const filteredData = useMemo(
    () =>
      alertsData.filter((item) => {
        if (selectedService && item.service !== selectedService) return false;
        if (selectedSeverity && item.severity !== selectedSeverity) return false;
        if (selectedStatus && item.status !== selectedStatus) return false;
        return true;
      }),
    [alertsData, selectedService, selectedSeverity, selectedStatus]
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
              {item.environment ? item.environment.toUpperCase() : 'N/A'} • {item.node}
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
        <div className="p-4 border-2 rounded-lg bg-white dark:bg-gray-900 border-rose-300 dark:border-rose-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Open</p>
            <Icon icon="mdi:alert-circle" className="w-5 h-5 text-rose-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.open}</p>
        </div>
        <div className="p-4 border-2 rounded-lg bg-white dark:bg-gray-900 border-indigo-300 dark:border-indigo-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Acknowledged</p>
            <Icon icon="mdi:eye-check" className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.acknowledged}</p>
        </div>
        <div className="p-4 border-2 rounded-lg bg-white dark:bg-gray-900 border-emerald-300 dark:border-emerald-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Resolved</p>
            <Icon icon="mdi:check-circle" className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.resolved}</p>
        </div>
        <div className="p-4 border-2 rounded-lg bg-white dark:bg-gray-900 border-red-300 dark:border-red-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Critical</p>
            <Icon icon="mdi:fire" className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.critical}</p>
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
                key={item.id || item._id}
                className={`p-4 border rounded-lg bg-white dark:bg-gray-900 ${
                  item.severity === 'critical' 
                    ? 'border-red-400' 
                    : item.severity === 'high'
                    ? 'border-orange-400'
                    : 'border-gray-300 dark:border-gray-700'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${severityStyles[item.severity]}`}>
                      {item.severity}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusStyles[item.status]}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{formatRelative(item.lastSeen || item.triggeredAt)}</span>
                </div>

                {/* Service & Project */}
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {item.service}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{item.project}</p>

                {/* Alert Description */}
                {item.description && (
                  <p className="text-xs text-gray-700 dark:text-gray-300 mb-3">
                    {item.description}
                  </p>
                )}

               

                {/* Metrics */}
                <div className="flex items-center justify-between text-xs border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Current:</span>
                    <span className="font-bold ml-1 text-gray-900 dark:text-gray-100">
                      {item.currentValue}{extractUnit(item.threshold)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Target:</span>
                    <span className="font-bold ml-1 text-gray-900 dark:text-gray-100">{item.threshold}</span>
                  </div>
                  <div>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">{item.action}</span>
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
