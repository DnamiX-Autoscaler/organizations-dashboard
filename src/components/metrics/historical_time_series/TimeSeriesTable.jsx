import React, { useState } from "react";
import { Icon } from "@iconify/react";

const formatTimestamp = (ts) => {
  if (!ts) return "—";
  return new Date(ts).toLocaleString();
};

const TimeSeriesTable = ({ data, serviceName }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(15);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
        <Icon
          icon="mdi:table-off"
          className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600"
        />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          No data points for this service
        </p>
      </div>
    );
  }

  // Show newest first
  const sortedData = [...data].reverse();
  const totalPages = Math.max(1, Math.ceil(sortedData.length / recordsPerPage));
  const startIdx = (currentPage - 1) * recordsPerPage;
  const pageRecords = sortedData.slice(startIdx, startIdx + recordsPerPage);

  // Exclude time encoding columns for cleaner display
  const excludeKeys = [
    "time_sin_1",
    "time_cos_1",
    "time_sin_2",
    "time_cos_2",
    "namespace",
    "service_name",
  ];
  const columns = Object.keys(data[0]).filter((k) => !excludeKeys.includes(k));

  return (
    <div className="space-y-4">
      {/* Record count header */}
      <div className="flex items-center justify-between px-4 py-2 text-sm font-medium text-indigo-700 border border-indigo-200 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-400">
        <div className="flex items-center gap-2">
          <Icon icon="mdi:database-outline" className="w-4 h-4" />
          {serviceName} — {data.length.toLocaleString()} data points (newest
          first)
        </div>
        <span className="font-mono text-xs">Step: 5 min intervals</span>
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
        <div className="overflow-x-auto max-h-[550px]">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-darkBackgroundVery">
              <tr>
                <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap">
                  #
                </th>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap"
                  >
                    {col === "timestamp" ? "Timestamp" : col.replace(/_/g, " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-darkBackground dark:divide-gray-700">
              {pageRecords.map((record, idx) => (
                <tr
                  key={idx}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-darkBackgroundVery"
                >
                  <td className="px-3 py-2 font-mono text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                    {sortedData.length - startIdx - idx}
                  </td>
                  {columns.map((col) => (
                    <td
                      key={col}
                      className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap"
                    >
                      {col === "timestamp"
                        ? formatTimestamp(record[col])
                        : typeof record[col] === "number"
                          ? record[col] % 1 !== 0
                            ? record[col].toFixed(4)
                            : record[col].toLocaleString()
                          : (record[col] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {startIdx + 1} to{" "}
          {Math.min(startIdx + recordsPerPage, sortedData.length)} of{" "}
          {sortedData.length} records
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-2 py-1 text-xs text-gray-600 border border-gray-200 rounded dark:border-gray-700 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300"
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm text-gray-600 border border-gray-200 rounded dark:border-gray-700 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-gray-700 dark:text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm text-gray-600 border border-gray-200 rounded dark:border-gray-700 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300"
          >
            Next
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-xs text-gray-600 border border-gray-200 rounded dark:border-gray-700 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeSeriesTable;
