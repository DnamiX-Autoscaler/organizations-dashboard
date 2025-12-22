import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import TitleHeader from "../../../components/common/TitleHeader";
import Search from "../../../components/common/Search";
import CommandCard from "../../../components/metrics/monitoring_notes/CommandCard";
import AddCommandModal from "../../../components/metrics/monitoring_notes/AddCommandModal";
import {
    monitoringCommandCategories,
    searchCommands,
    getCustomCommands,
    saveCustomCommand,
    deleteCustomCommand,
} from "../../../data/monitoringCommands";

const MonitoringNotes = () => {
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [customCommands, setCustomCommands] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Load custom commands on mount
    useEffect(() => {
        setCustomCommands(getCustomCommands());
    }, []);

    // Get filtered commands
    const getFilteredCommands = () => {
        let commands = [];

        if (searchTerm) {
            commands = searchCommands(searchTerm);
        } else if (activeCategory === "all") {
            commands = monitoringCommandCategories.flatMap((cat) => cat.commands);
        } else if (activeCategory === "custom") {
            commands = customCommands;
        } else {
            const category = monitoringCommandCategories.find(
                (cat) => cat.id === activeCategory
            );
            commands = category ? category.commands : [];
        }

        return commands;
    };

    const filteredCommands = getFilteredCommands();

    // Handle add custom command
    const handleAddCommand = (commandData) => {
        const newCommand = saveCustomCommand(commandData);
        setCustomCommands([...customCommands, newCommand]);
    };

    // Handle delete custom command
    const handleDeleteCommand = (commandId) => {
        deleteCustomCommand(commandId);
        setCustomCommands(customCommands.filter((cmd) => cmd.id !== commandId));
    };

    // Category color mapping
    const getCategoryColorClass = (color) => {
        const colorMap = {
            blue: "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
            orange:
                "border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20",
            green:
                "border-green-500 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
            purple:
                "border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20",
            red: "border-red-500 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20",
            indigo:
                "border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20",
            yellow:
                "border-yellow-500 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20",
        };
        return colorMap[color] || colorMap.blue;
    };

    return (
        <div className="space-y-6">
            <TitleHeader
                title="Monitoring Commands"
                subtitle="Quick access to common monitoring and debugging commands"
            />

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <Search
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search commands..."
                    />
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all rounded-lg bg-primary hover:bg-primary/90"
                >
                    <Icon icon="mdi:plus" className="w-4 h-4" />
                    Add Custom Command
                </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto">
                <button
                    onClick={() => setActiveCategory("all")}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeCategory === "all"
                            ? "bg-primary text-white"
                            : "bg-white dark:bg-darkBackground text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary/50"
                        }`}
                >
                    All Commands
                </button>

                {monitoringCommandCategories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap border ${activeCategory === category.id
                                ? getCategoryColorClass(category.color)
                                : "bg-white dark:bg-darkBackground text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary/50"
                            }`}
                    >
                        <Icon icon={category.icon} className="w-4 h-4" />
                        {category.title}
                    </button>
                ))}

                {customCommands.length > 0 && (
                    <button
                        onClick={() => setActiveCategory("custom")}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap border ${activeCategory === "custom"
                                ? "border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20"
                                : "bg-white dark:bg-darkBackground text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary/50"
                            }`}
                    >
                        <Icon icon="mdi:star" className="w-4 h-4" />
                        Custom ({customCommands.length})
                    </button>
                )}
            </div>

            {/* Commands Grid */}
            {filteredCommands.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {filteredCommands.map((command) => (
                        <CommandCard
                            key={command.id}
                            command={command}
                            isCustom={command.isCustom}
                            onDelete={handleDeleteCommand}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
                    <Icon
                        icon="mdi:file-document-outline"
                        className="w-16 h-16 text-gray-300 dark:text-gray-600"
                    />
                    <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-400">
                        No commands found
                    </p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                        {searchTerm
                            ? "Try a different search term"
                            : "Add your first custom command to get started"}
                    </p>
                </div>
            )}

            {/* Results count */}
            {filteredCommands.length > 0 && (
                <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700 dark:text-gray-400">
                    <span>Showing {filteredCommands.length} commands</span>
                    {activeCategory !== "all" && (
                        <button
                            onClick={() => setActiveCategory("all")}
                            className="text-primary hover:underline"
                        >
                            View all
                        </button>
                    )}
                </div>
            )}

            {/* Add Command Modal */}
            <AddCommandModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAddCommand}
            />
        </div>
    );
};

export default MonitoringNotes;
