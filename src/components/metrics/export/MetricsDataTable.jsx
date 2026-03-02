import React, { useState } from "react";
import { Icon } from "@iconify/react";

const MetricsDataTable = ({ data = [] }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);

    // Calculate pagination
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(data.length / recordsPerPage);

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
                    Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, data.length)} of {data.length} records
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
                        disabled={currentPage === totalPages || data.length === 0}
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
