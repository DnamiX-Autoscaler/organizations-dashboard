import React from "react";
import { Icon } from "@iconify/react";

const TabSection = ({ tabs, activeTab, onTabChange }) => (
    <div className="flex items-center mb-6 space-x-6 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
            <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`flex items-center space-x-2 pb-3 px-1 border-b-2 transition-colors ${activeTab === tab.key
                        ? "border-primary text-primary dark:text-primary"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
            >
                {tab.icon && <Icon icon={tab.icon} className="w-5 h-5" />}
                <span className="font-medium">{tab.label}</span>
            </button>
        ))}
    </div>
);

export default TabSection;
