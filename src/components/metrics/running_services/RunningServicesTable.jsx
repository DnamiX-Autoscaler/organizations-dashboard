import React from "react";
import Table from "../../common/Table";
import ServiceTypeBadge from "./ServiceTypeBadge.jsx";

const columns = [
  { key: "name", label: "Name", bold: true },
  { key: "type", label: "Type", icon: "fluent:leaf-two-24-regular" },
  { key: "clusterIP", label: "Cluster-IP" },
  { key: "externalIP", label: "External-IP" },
  { key: "ports", label: "Port(s)" },
  { key: "age", label: "Age" },
];

const RunningServicesTable = ({ services, loading, empty }) => {
  const tableData = services.map((service) => ({
    ...service,
    type: <ServiceTypeBadge type={service.type} />,
  }));

  return (
    <Table
      columns={columns}
      data={loading ? [] : tableData}
      empty={
        loading ? (
          <span>
            <span className="inline-block mr-2 align-middle animate-spin">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            </span>
            Loading services...
          </span>
        ) : (
          empty || "No services found"
        )
      }
    />
  );
};

export default RunningServicesTable;
