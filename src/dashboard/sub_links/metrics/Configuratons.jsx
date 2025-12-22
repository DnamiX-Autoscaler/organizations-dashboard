import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import TitleHeader from "../../../components/common/TitleHeader";
import TabSection from "../../../components/common/TabSection";
import Search from "../../../components/common/Search";
import FilterDropdown from "../../../components/common/FilterDropdown";
import ClearFilterButton from "../../../components/common/ClearFilterButton";
import ConfigurationCard from "../../../components/metrics/configurations/ConfigurationCard";
import ConfigurationStatistics from "../../../components/metrics/configurations/ConfigurationStatistics";
import {
  fetchConfigurations,
  getConfigurationStatistics,
} from "../../../data/configurations";

const Configuratons = () => {
  const [activeLevel, setActiveLevel] = useState("node");
  const [configurations, setConfigurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(false);

  const levels = [
    { key: "node", label: "Node Level", icon: "mdi:server" },
    { key: "pod", label: "Pod Level", icon: "mdi:cube-outline" },
    { key: "app", label: "App Level", icon: "mdi:application" },
    { key: "service", label: "Service Level", icon: "mdi:server-network" },
  ];

  // Fetch configurations
  const loadConfigurations = async () => {
    setLoading(true);
    try {
      const data = await fetchConfigurations(activeLevel);
      setConfigurations(data);
    } catch (error) {
      console.error("Failed to fetch configurations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load configurations on level change
  useEffect(() => {
    loadConfigurations();
  }, [activeLevel]);

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadConfigurations();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, activeLevel]);

  // Filter configurations
  const filteredConfigs = configurations.filter((config) => {
    const matchesSearch = config.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || config.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = getConfigurationStatistics(configurations);

  // Filter options
  const statusFilterOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
  };

  const hasActiveFilters = searchTerm !== "" || filterStatus !== "all";

  // Handle toggle configuration
  const handleToggle = (id) => {
    setConfigurations(
      configurations.map((config) =>
        config.id === id ? { ...config, enabled: !config.enabled } : config
      )
    );
  };

  // Handle edit configuration
  const handleEdit = (config) => {
    console.log("Edit configuration:", config);
    // TODO: Open edit modal
  };

  return (
    <div className="space-y-6">
      <TitleHeader
        title="Metrics Configuration"
        subtitle="Configure metric collection at different levels: Node, Pod, App, and Service"
      />

      {/* Level Tabs */}
      <TabSection
        tabs={levels}
        activeTab={activeLevel}
        onTabChange={setActiveLevel}
      />

      {/* Statistics */}
      <ConfigurationStatistics stats={stats} />

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <Search
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={`Search ${activeLevel} configurations...`}
          />

          {/* Filter by status */}
          <FilterDropdown
            value={filterStatus}
            onChange={setFilterStatus}
            options={statusFilterOptions}
            placeholder="Filter by status"
          />

          {/* Clear Filter Button */}
          {hasActiveFilters && <ClearFilterButton onClick={clearFilters} />}
        </div>

        <div className="flex items-center gap-3">
          {/* Auto-refresh toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all ${
              autoRefresh
                ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                : "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800"
            }`}
          >
            <Icon
              icon={autoRefresh ? "mdi:refresh" : "mdi:refresh-off"}
              className={`w-4 h-4 ${autoRefresh ? "animate-spin" : ""}`}
            />
            {autoRefresh ? "Auto-refresh On" : "Auto-refresh Off"}
          </button>

          {/* Refresh button */}
          <button
            onClick={loadConfigurations}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon
              icon="mdi:refresh"
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>

          {/* Add New Configuration */}
          <button
            onClick={() => console.log("Add new configuration")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all rounded-lg bg-primary hover:bg-primary/90"
          >
            <Icon icon="mdi:plus" className="w-4 h-4" />
            Add Configuration
          </button>
        </div>
      </div>

      {/* Configurations List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Icon
            icon="mdi:loading"
            className="w-8 h-8 text-primary animate-spin"
          />
        </div>
      ) : filteredConfigs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
          <Icon
            icon="mdi:cog-off-outline"
            className="w-16 h-16 text-gray-300 dark:text-gray-600"
          />
          <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-400">
            No configurations found
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            {hasActiveFilters
              ? "Try adjusting your filters"
              : `Add a new ${activeLevel} configuration to get started`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredConfigs.map((config) => (
            <ConfigurationCard
              key={config.id}
              config={config}
              level={activeLevel}
              onEdit={handleEdit}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      {/* Results count */}
      {!loading && filteredConfigs.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700 dark:text-gray-400">
          <span>
            Showing {filteredConfigs.length} of {configurations.length}{" "}
            configurations
          </span>
          <span className="text-xs font-medium text-primary">
            Level: {activeLevel.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
};

export default Configuratons;
