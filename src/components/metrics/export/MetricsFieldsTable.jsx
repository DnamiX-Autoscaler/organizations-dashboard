import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { metricsCategories, getFieldsByCategory, metricsFields } from "../../../data/metricsExport";

const MetricsFieldsTable = () => {
    const [activeCategory, setActiveCategory] = useState("all");

    const getFilteredFields = () => {
        if (activeCategory === "all") {
            return metricsFields;
        }
        return getFieldsByCategory(activeCategory);
    };

    const filteredFields = getFilteredFields();

    const getCategoryColor = (category) => {
        const cat = metricsCategories.find((c) => c.key === category);
        return cat ? cat.color : "gray";
    };

    const getCategoryBadgeClass = (color) => {
        const colorMap = {
            blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
            green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
            purple: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
            orange: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
            indigo: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
            pink: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
            red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
            teal: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
        };
        return colorMap[color] || colorMap.gray;
    };

    return (
        <div className="space-y-4">
            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto">
                <button
                    onClick={() => setActiveCategory("all")}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeCategory === "all"
                            ? "bg-primary text-white"
                            : "bg-white dark:bg-darkBackground text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary/50"
                        }`}
                >
                    All Fields ({metricsFields.length})
                </button>

                {metricsCategories.map((category) => (
                    <button
                        key={category.key}
                        onClick={() => setActiveCategory(category.key)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeCategory === category.key
                                ? "bg-primary text-white"
                                : "bg-white dark:bg-darkBackground text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary/50"
                            }`}
                    >
                        <Icon icon={category.icon} className="w-4 h-4" />
                        {category.label}
                    </button>
                ))}
            </div>

            {/* Fields Table */}
            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
                <div className="overflow-x-auto max-h-[600px]">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-darkBackgroundVery sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                                    Field Name
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                                    Label
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                                    Category
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-darkBackground dark:divide-gray-700">
                            {filteredFields.map((field) => (
                                <tr
                                    key={field.key}
                                    className="transition-colors hover:bg-gray-50 dark:hover:bg-darkBackgroundVery"
                                >
                                    <td className="px-6 py-4 font-mono text-sm text-gray-900 whitespace-nowrap dark:text-white">
                                        {field.key}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap dark:text-gray-300">
                                        {field.label}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 py-1 text-xs font-medium rounded-md ${getCategoryBadgeClass(
                                                getCategoryColor(field.category)
                                            )}`}
                                        >
                                            {field.category}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700 dark:text-gray-400">
                <span>Showing {filteredFields.length} fields</span>
                <span className="text-xs font-medium text-primary">
                    Total: {metricsFields.length} metrics
                </span>
            </div>
        </div>
    );
};

export default MetricsFieldsTable;
