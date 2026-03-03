import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import TitleHeader from "../../../components/common/TitleHeader";
import { getServiceStatistics } from "../../../data/runningServices";
import runningServicesService from "../../../api/services/metrics/running_services";
import ServiceStatisticsCards from "../../../components/metrics/running_services/ServiceStatisticsCards.jsx";
import Search from "../../../components/common/Search.jsx";
import FilterDropdown from "../../../components/common/FilterDropdown.jsx";
import RunningServicesTable from "../../../components/metrics/running_services/RunningServicesTable.jsx";

const RunningServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch services data
  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await runningServicesService.getServices();
      setServices(data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and auto-refresh
  useEffect(() => {
    loadServices();

    if (autoRefresh) {
      const interval = setInterval(() => {
        loadServices();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Filter services
  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "all" ||
      service.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const stats = getServiceStatistics(services);

  // Filter options for type dropdown
  const typeFilterOptions = [
    { value: "all", label: "All Types" },
    { value: "loadbalancer", label: "LoadBalancer" },
    { value: "nodeport", label: "NodePort" },
    { value: "clusterip", label: "ClusterIP" },
    { value: "externalname", label: "ExternalName" },
  ];

  return (
    <div className="space-y-6">
      <TitleHeader
        title="Running Services"
        subtitle="Monitor and manage Kubernetes services running in your cluster"
      />

      {/* Statistics Cards */}
      <ServiceStatisticsCards stats={stats} />

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <Search
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search services..."
          />

          {/* Filter by type */}
          <FilterDropdown
            value={filterType}
            onChange={setFilterType}
            options={typeFilterOptions}
            placeholder="Filter by type"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Auto-refresh toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all ${autoRefresh
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
            onClick={loadServices}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon
              icon="mdi:refresh"
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Services Table */}
      <RunningServicesTable
        services={filteredServices}
        loading={loading}
        empty="No services found"
      />

      {/* Results count */}
      {!loading && filteredServices.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700 dark:text-gray-400">
          <span>
            Showing {filteredServices.length} of {services.length} services
          </span>
          <span className="font-mono text-xs">kubectl get svc -n default</span>
        </div>
      )}
    </div>
  );
};

export default RunningServices;
