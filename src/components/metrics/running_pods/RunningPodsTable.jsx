import React from "react";
import Table from "../../common/Table";
import StatusBadge from "./StatusBadge.jsx";
import ReadyBadge from "./ReadyBadge.jsx";

const columns = [
  { key: "name", label: "Name", bold: true },
  { key: "ready", label: "Ready", icon: "fluent:leaf-two-24-regular" }, // Add leaf icon here
  { key: "status", label: "Status" },
  { key: "restarts", label: "Restarts" },
  { key: "age", label: "Age" },
  { key: "ip", label: "IP" },
  { key: "node", label: "Node" },
];

const RunningPodsTable = ({ pods, loading, empty }) => {
  // Prepare data with custom cell rendering for badges
  const tableData = pods.map((pod) => ({
    ...pod,
    ready: <ReadyBadge ready={pod.ready} />,
    status: <StatusBadge status={pod.status} />,
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
            Loading pods...
          </span>
        ) : (
          empty || "No pods found"
        )
      }
    />
  );
};

export default RunningPodsTable;
