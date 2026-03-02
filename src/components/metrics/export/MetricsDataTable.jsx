import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

const MetricsDataTable = ({ data = [], isCollecting = false }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);

    // While collecting, newest records are at the end — reverse for display
    // so page 1 always shows the latest batch without the user having to paginate
    const displayData = isCollecting ? [...data].reverse() : data;

    // Reset to page 1 whenever new records arrive during collection
    useEffect(() => {
        if (isCollecting) {
            setCurrentPage(1);
        }
    }, [data.length, isCollecting]);

    // Calculate pagination
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = displayData.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.max(1, Math.ceil(displayData.length / recordsPerPage));

    // Empty state
    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
                <Icon icon="mdi:database-off" className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600" />
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No records collected yet</p>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Start Collection to begin capturing live metrics</p>
            </div>
        );
    }

    // Get column headers from first record
    const columns = currentRecords.length > 0 ? Object.keys(currentRecords[0]) : [];

    return (
        <div className="space-y-4">
            {/* Live indicator header */}
            {isCollecting && (
                <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Live — collecting metrics. Newest records shown first. Total: {data.length.toLocaleString()} records
                </div>
            )}

            {/* Table */}
            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
                <div className="overflow-x-auto max-h-[600px]">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="sticky top-0 bg-gray-50 dark:bg-darkBackgroundVery">
                            <tr>
                                {columns.map((col) => (
                                    <th
                                        key={col}
                                        className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap"
                                    >
                                        {col.replace(/_/g, " ")}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-darkBackground dark:divide-gray-700">
                            {currentRecords.map((record, idx) => (
                                <tr
                                    key={idx}
                                    className="transition-colors hover:bg-gray-50 dark:hover:bg-darkBackgroundVery"
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col}
                                            className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap"
                                        >
                                            {typeof record[col] === 'number' ?
                                                Number(record[col]).toLocaleString() :
                                                record[col]}
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
                    Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, displayData.length)} of {displayData.length} records
                    {isCollecting && <span className="ml-2 text-green-600 dark:text-green-400">(growing)</span>}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm border border-gray-200 rounded dark:border-gray-700 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        Previous
                    </button>
                    <span className="px-3 py-1 text-sm">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || displayData.length === 0}
                        className="px-3 py-1 text-sm border border-gray-200 rounded dark:border-gray-700 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MetricsDataTable;
