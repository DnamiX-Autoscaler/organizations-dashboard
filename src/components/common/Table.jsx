import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

const Table = ({ columns, data, empty, itemsPerPage = 10, showPagination = true }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(itemsPerPage);

  // Reset to page 1 when data length changes (e.g., filters applied)
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  // Calculate pagination
  const totalPages = Math.ceil(data.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedData = showPagination ? data.slice(startIndex, endIndex) : data;

  // Handle page changes
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle items per page change
  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
  <div className="flex flex-col flex-1 overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-darkBackgroundVery">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400"
              >
                <div className="flex items-center space-x-1">
                  <span>{col.label}</span>
                  {col.icon && (
                    <Icon icon={col.icon} className="w-4 h-4 text-green-400" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-darkBackground dark:divide-gray-700">
          {paginatedData.map((row, idx) => (
            <tr
              key={idx}
              className="transition-colors hover:bg-gray-50 dark:hover:bg-darkBackgroundVery"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-6 py-4 text-sm whitespace-nowrap ${col.bold
                      ? "font-medium text-gray-900 dark:text-gray-200"
                      : "text-gray-600 dark:text-gray-300"
                    }`}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {data.length === 0 && (
      <div className="flex flex-col items-center justify-center py-12">
        <Icon
          icon="mdi:database-off-outline"
          className="w-16 h-16 text-gray-300 dark:text-gray-600"
        />
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          {empty || "No data found"}
        </p>
      </div>
    )}

    {/* Pagination Controls */}
    {showPagination && data.length > 0 && (
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        {/* Items per page selector */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Rows per page:
          </label>
          <select
            value={perPage}
            onChange={handlePerPageChange}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md dark:border-gray-600 dark:bg-darkBackgroundVery dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Page info */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
        </div>

        {/* Page navigation */}
        <div className="flex items-center space-x-1">
          {/* Previous button */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-600 transition-colors rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-darkBackgroundVery disabled:opacity-50 disabled:cursor-not-allowed"
            title="Previous page"
          >
            <Icon icon="mdi:chevron-left" className="w-5 h-5" />
          </button>

          {/* Page numbers */}
          {getPageNumbers().map((page, idx) => (
            page === '...' ? (
              <span key={`ellipsis-${idx}`} className="px-3 py-1 text-gray-600 dark:text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  currentPage === page
                    ? 'bg-green-500 text-white font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-darkBackgroundVery'
                }`}
              >
                {page}
              </button>
            )
          ))}

          {/* Next button */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-600 transition-colors rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-darkBackgroundVery disabled:opacity-50 disabled:cursor-not-allowed"
            title="Next page"
          >
            <Icon icon="mdi:chevron-right" className="w-5 h-5" />
          </button>
        </div>
      </div>
    )}
  </div>
  );
};

export default Table;
