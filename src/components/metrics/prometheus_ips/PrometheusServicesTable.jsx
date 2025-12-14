import React from "react";
import Table from "../../common/Table";
import CategoryBadge from "./CategoryBadge.jsx";
import { getServiceCategory } from "../../../data/runningPrometheusIPs";

const columns = [
  { key: "name", label: "Service Name", bold: true },
  { key: "category", label: "Category", icon: "mdi:tag" },
  { key: "type", label: "Type" },
  { key: "clusterIP", label: "Cluster-IP" },
  { key: "ports", label: "Port(s)" },
  { key: "age", label: "Age" },
];

const PrometheusServicesTable = ({ services, loading, empty }) => {
  const tableData = services.map((service) => ({
    ...service,
    category: <CategoryBadge category={getServiceCategory(service.name)} />,
  }));

  return (
    <Table
      columns={columns}
      data={loading ? [] : tableData}
      empty={
        loading ? (
          <span>
            <span className="inline-block mr-2 align-middle animate-spin">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            </span>
            Loading Prometheus services...
          </span>
        ) : (
          empty || "No Prometheus services found"
        )
      }
    />
  );
};

export default PrometheusServicesTable;
