import React from "react";
import { Icon } from "@iconify/react";

const ClearFilterButton = ({ onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center px-4 py-2.5 space-x-2 text-sm text-gray-700 dark:text-gray-300 bg-white/60 dark:bg-darkBackground/60 backdrop-blur-md border border-gray-200 dark:border-gray-600/50 rounded-full transition-all duration-200 hover:bg-white/80 dark:hover:bg-darkBackground/80 focus:outline-none focus:ring-2 focus:ring-primary/50"
    >
        <Icon icon="mdi:filter-off-outline" className="w-4 h-4" />
        <span>Clear Filter</span>
    </button>
);

export default ClearFilterButton;
