import React from "react";
import { Icon } from "@iconify/react";

const Table = ({ columns, data, empty }) => (
  <div className="flex-1 overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
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
                    <Icon icon={col.icon} className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-darkBackground dark:divide-gray-700">
          {data.map((row, idx) => (
            <tr
              key={idx}
              className="transition-colors hover:bg-gray-50 dark:hover:bg-darkBackgroundVery"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-6 py-4 text-sm whitespace-nowrap ${
                    col.bold
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
  </div>
);

export default Table;
