import React, { useState, useMemo } from "react";
import { Icon } from "@iconify/react";

const PAGE_SIZE = 10;

const PredictionLogTable = ({ logs }) => {
    const [page, setPage] = useState(1);
    const [sortDir, setSortDir] = useState("desc");
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const allLogs = logs || [];

    const processed = useMemo(() => {
        let result = [...allLogs];
        if (filterStatus !== "all") {
            result = result.filter((l) => {
                const abs = Math.abs(l.error);
                if (filterStatus === "exact") return abs === 0;
                if (filterStatus === "within1") return abs === 1;
                if (filterStatus === "over") return l.error > 1;
                if (filterStatus === "under") return l.error < -1;
                return true;
            });
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (l) =>
                    String(l.currentPods).includes(q) ||
                    String(l.predicted).includes(q) ||
                    String(l.actualAtT5).includes(q) ||
                    l.time?.toLowerCase().includes(q)
            );
        }
        if (sortDir === "desc") result = result.reverse();
        return result;
    }, [allLogs, filterStatus, sortDir, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE));
    const displayLogs = processed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleFilterChange = (f) => { setFilterStatus(f); setPage(1); };

    const handleExport = () => {
        const header = ["Time", "Current Pods", "Predicted", "Actual@T+5", "Error", "Status"];
        const rows = allLogs.map((l) => {
            const abs = Math.abs(l.error);
            const status = abs === 0 ? "Exact" : abs === 1 ? "±1" : l.error > 0 ? `Over +${l.error}` : `Under ${l.error}`;
            return [l.time, l.currentPods, l.predicted, l.actualAtT5, l.error, status];
        });
        const csv = header.join(",") + "\n" + rows.map((r) => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `prediction_log_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const getStatusBadge = (error) => {
        const absError = Math.abs(error);
        if (absError === 0) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"><Icon icon="mdi:check-circle" className="w-3 h-3" />Exact</span>;
        if (absError === 1) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"><Icon icon="mdi:approximately-equal" className="w-3 h-3" />±1</span>;
        if (error > 0) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"><Icon icon="mdi:arrow-up" className="w-3 h-3" />Over +{error}</span>;
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"><Icon icon="mdi:arrow-down" className="w-3 h-3" />Under {error}</span>;
    };

    const filterTabs = [
        { key: "all", label: "All" },
        { key: "exact", label: "Exact" },
        { key: "within1", label: "±1" },
        { key: "over", label: "Over" },
        { key: "under", label: "Under" },
    ];

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-xl dark:bg-darkBackground dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                        <Icon icon="mdi:table-clock" className="w-5 h-5 text-indigo-500" />
                        Prediction Log
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Predictions vs actual outcomes (T+5min validation)
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 font-medium">
                        {allLogs.length} total
                    </span>
                    <button
                        onClick={handleExport}
                        disabled={allLogs.length === 0}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Icon icon="mdi:download" className="w-3.5 h-3.5" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                <div className="flex gap-1.5 flex-wrap">
                    {filterTabs.map((tab) => (
                        <button key={tab.key} onClick={() => handleFilterChange(tab.key)}
                            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${filterStatus === tab.key ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"}`}
                        >{tab.label}</button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Icon icon="mdi:magnify" className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input type="text" placeholder="Search..." value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                            className="pl-7 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-400 w-36"
                        />
                    </div>
                    <button onClick={() => setSortDir((d) => d === "desc" ? "asc" : "desc")}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <Icon icon={sortDir === "desc" ? "mdi:sort-descending" : "mdi:sort-ascending"} className="w-3.5 h-3.5" />
                        {sortDir === "desc" ? "Newest" : "Oldest"}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800/80">
                            <tr>
                                {["#", "Time", "Current", "Predicted", "Actual@T+5", "Error", "Status"].map((h, i) => (
                                    <th key={i} className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-left">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                            {displayLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                                        <Icon icon="mdi:table-off" className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                        <p className="text-sm">{allLogs.length === 0 ? "Waiting for predictions..." : "No results match your filter"}</p>
                                    </td>
                                </tr>
                            ) : (
                                displayLogs.map((log, idx) => {
                                    const globalIdx = sortDir === "desc"
                                        ? allLogs.length - (page - 1) * PAGE_SIZE - idx
                                        : (page - 1) * PAGE_SIZE + idx + 1;
                                    const isLatest = sortDir === "desc" && page === 1 && idx === 0;
                                    return (
                                        <tr key={idx} className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40 ${isLatest ? "bg-indigo-50/40 dark:bg-indigo-900/10" : ""}`}>
                                            <td className="px-4 py-3 text-xs text-gray-400 font-mono">#{globalIdx}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="font-mono text-sm text-gray-700 dark:text-gray-300">{log.time}</span>
                                                {isLatest && <span className="ml-2 text-xs text-indigo-500 font-medium">Latest</span>}
                                            </td>
                                            <td className="px-4 py-3 text-center"><span className="font-semibold text-violet-600 dark:text-violet-400">{log.currentPods}</span></td>
                                            <td className="px-4 py-3 text-center"><span className="font-semibold text-emerald-600 dark:text-emerald-400">{log.predicted}</span></td>
                                            <td className="px-4 py-3 text-center"><span className="font-semibold text-blue-600 dark:text-blue-400">{log.actualAtT5}</span></td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`font-mono font-semibold text-sm ${log.error === 0 ? "text-emerald-600 dark:text-emerald-400" : Math.abs(log.error) === 1 ? "text-blue-600 dark:text-blue-400" : log.error > 0 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
                                                    {log.error > 0 ? "+" : ""}{log.error}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">{getStatusBadge(log.error)}</td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        Page {page} of {totalPages} · {processed.length} results
                    </span>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setPage(1)} disabled={page === 1} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                            <Icon icon="mdi:page-first" className="w-4 h-4" />
                        </button>
                        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                            <Icon icon="mdi:chevron-left" className="w-4 h-4" />
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                            return start + i;
                        }).map((p) => (
                            <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 text-xs rounded-lg font-medium transition-all ${p === page ? "bg-indigo-500 text-white" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>{p}</button>
                        ))}
                        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                            <Icon icon="mdi:chevron-right" className="w-4 h-4" />
                        </button>
                        <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                            <Icon icon="mdi:page-last" className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PredictionLogTable;
