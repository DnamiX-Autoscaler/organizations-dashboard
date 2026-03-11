import React, { useState, useEffect, useRef } from "react";
import TitleHeader from "../../../components/common/TitleHeader";
import { fetchSimulationData, checkApiHealth, predictPodScaling } from "../../../services/mlModelService";
import { loadLogs, saveLog, clearLogs } from "../../../services/dbService";
import { Icon } from "@iconify/react";

// Feature keys matching backend
const FEATURE_KEYS = [
    "request_rate_rps", "latency_p95_ms", "latency_p99_ms", "error_rate_percent",
    "queue_length", "pod_cpu_usage_percent_avg", "pod_cpu_usage_percent_p95",
    "pod_memory_usage_mb_avg", "pod_memory_usage_mb_p95", "hour_sin", "hour_cos",
    "day_sin", "day_cos", "mesh_inbound_rps", "mesh_inbound_latency_p95",
    "mesh_inbound_error_rate", "degree_centrality", "eigenvector_centrality",
    "betweenness_centrality", "closeness_centrality"
];

const MLModelLogs = () => {
    const [logs, setLogs] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationQueue, setSimulationQueue] = useState([]);
    const [filter, setFilter] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    const logContainerRef = useRef(null);
    const simIndexRef = useRef(48);

    // Load persisted logs on mount
    useEffect(() => {
        loadLogs().then(saved => {
            if (saved && saved.length > 0) setLogs(saved);
        });
    }, []);

    // Add log entry
    const addLog = (level, message, details = null) => {
        const timestamp = new Date().toLocaleTimeString("en-US", {
            hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
        });
        const entry = { timestamp, level, message, details };
        setLogs(prev => [...prev.slice(-500), entry]);
        saveLog(entry);
    };

    // Auto-scroll
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    // Initialize
    useEffect(() => {
        addLog('INFO', 'System log viewer initialized');
        addLog('INFO', 'Connecting to ML backend...');

        checkApiHealth().then(status => {
            if (status) {
                setIsConnected(true);
                addLog('SUCCESS', 'Backend connection established', {
                    model: status.model_file,
                    lookback: status.lookback,
                    horizon: status.horizon_min
                });

                fetchSimulationData().then(data => {
                    if (data && data.length > 48) {
                        addLog('SUCCESS', `Loaded ${data.length} simulation data points`);
                        setSimulationQueue(data);
                        simIndexRef.current = 48;
                        setIsSimulating(true);
                        addLog('INFO', 'Starting real-time simulation...');
                    }
                }).catch(err => {
                    addLog('ERROR', `Failed to load simulation data: ${err.message}`);
                });
            } else {
                addLog('WARN', 'Backend offline - simulation unavailable');
            }
        });
    }, []);

    // Simulation loop
    useEffect(() => {
        if (!isSimulating || simulationQueue.length === 0) return;

        const interval = setInterval(async () => {
            const idx = simIndexRef.current;

            if (idx >= simulationQueue.length - 6) {
                addLog('INFO', '🔄 Simulation cycle complete - restarting');
                simIndexRef.current = 48;
                return;
            }

            const row = simulationQueue[idx];
            const timestamp = new Date(row.timestamp);
            const timeStr = timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
            const currentPods = parseInt(row.current_pod_count) || 2;
            const futureRow = simulationQueue[idx + 5];
            const actualAtT5 = futureRow ? parseInt(futureRow.current_pod_count) : currentPods;

            // Build window
            const windowRows = simulationQueue.slice(idx - 48, idx);
            const apiWindow = windowRows.map(r => {
                const features = FEATURE_KEYS.map(k => parseFloat(r[k] || 0));
                return [...features, parseFloat(r.current_pod_count || 0)];
            });

            addLog('INFO', `Processing timestamp: ${timeStr}`, {
                index: idx,
                pods: currentPods,
                cpu: parseFloat(row.pod_cpu_usage_percent_avg).toFixed(1) + '%',
                rps: parseFloat(row.request_rate_rps).toFixed(0)
            });

            // API Call
            const startTime = performance.now();
            try {
                addLog('API', `POST /predict - window_end=${timestamp.toISOString()}`);

                const resp = await predictPodScaling(apiWindow, timestamp.toISOString());
                const latency = Math.round(performance.now() - startTime);
                const predicted = resp.predicted_pods;

                addLog('SUCCESS', `Prediction: ${predicted} pods (${latency}ms)`, {
                    input_shape: `[${apiWindow.length}, ${apiWindow[0]?.length}]`,
                    confidence: resp.confidence || 'N/A'
                });

                // Scaling decision
                const diff = predicted - currentPods;
                if (diff > 0) {
                    addLog('SCALE', `⬆️ SCALE UP recommended: ${currentPods} → ${predicted}`, {
                        reason: 'Predicted demand increase'
                    });
                } else if (diff < 0) {
                    addLog('SCALE', `⬇️ SCALE DOWN recommended: ${currentPods} → ${predicted}`, {
                        reason: 'Predicted demand decrease'
                    });
                }

                // Validation
                const error = predicted - actualAtT5;
                if (Math.abs(error) <= 1) {
                    addLog('VALIDATE', ` Prediction validated: predicted=${predicted}, actual@T+5=${actualAtT5}`, {
                        error: error
                    });
                } else if (error > 1) {
                    addLog('WARN', `⚠️ Over-provisioned: predicted ${predicted}, actual@T+5 was ${actualAtT5}`, {
                        error: `+${error}`
                    });
                } else {
                    addLog('WARN', `⚠️ Under-provisioned: predicted ${predicted}, actual@T+5 was ${actualAtT5}`, {
                        error: error
                    });
                }

            } catch (e) {
                addLog('ERROR', `Prediction failed: ${e.message}`);
            }

            simIndexRef.current = idx + 1;
        }, 2000);

        return () => clearInterval(interval);
    }, [isSimulating, simulationQueue]);

    // Filter logs
    const filteredLogs = logs.filter(log => {
        if (filter !== "ALL" && log.level !== filter) return false;
        if (searchQuery && !log.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const getLogStyle = (level) => {
        const styles = {
            INFO: { color: 'text-blue-400', bg: 'bg-blue-500/10', icon: 'mdi:information' },
            SUCCESS: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: 'mdi:check-circle' },
            WARN: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: 'mdi:alert' },
            ERROR: { color: 'text-red-400', bg: 'bg-red-500/10', icon: 'mdi:alert-circle' },
            API: { color: 'text-cyan-400', bg: 'bg-cyan-500/10', icon: 'mdi:api' },
            SCALE: { color: 'text-orange-400', bg: 'bg-orange-500/10', icon: 'mdi:arrow-expand-vertical' },
            VALIDATE: { color: 'text-purple-400', bg: 'bg-purple-500/10', icon: 'mdi:check-decagram' },
        };
        return styles[level] || styles.INFO;
    };

    const logLevels = ['ALL', 'INFO', 'SUCCESS', 'WARN', 'ERROR', 'API', 'SCALE', 'VALIDATE'];

    return (
        <div className="space-y-6">
            <TitleHeader
                title="ML Model System Logs"
                subtitle="Real-time logging of prediction pipeline, scaling decisions, and validation results"
            />

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-xl dark:bg-darkBackground dark:border-gray-700">
                <div className="flex items-center gap-3">
                    {/* Connection Status */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${isConnected ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className={`text-sm font-medium ${isConnected ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>

                    {/* Simulation Status */}
                    {isSimulating && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                            <Icon icon="mdi:play-circle" className="w-4 h-4 text-blue-500 animate-pulse" />
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Simulating</span>
                        </div>
                    )}

                    {/* Log Count */}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {filteredLogs.length} / {logs.length} entries
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Filter */}
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {logLevels.map(level => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>

                    {/* Clear */}
                    <button
                        onClick={() => { setLogs([]); clearLogs(); }}
                        className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Log Container */}
            <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <Icon icon="mdi:console" className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm font-semibold text-white">System Console</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {logLevels.slice(1).map(level => {
                            const count = logs.filter(l => l.level === level).length;
                            const style = getLogStyle(level);
                            return count > 0 && (
                                <span key={level} className={`text-xs ${style.color}`}>
                                    {level}: {count}
                                </span>
                            );
                        })}
                    </div>
                </div>

                {/* Logs */}
                <div
                    ref={logContainerRef}
                    className="overflow-y-auto p-4 font-mono text-sm space-y-1"
                    style={{ height: '600px' }}
                >
                    {filteredLogs.length === 0 ? (
                        <div className="text-gray-500 text-center py-12">
                            <Icon icon="mdi:console-line" className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>No logs to display</p>
                        </div>
                    ) : (
                        filteredLogs.map((log, idx) => {
                            const style = getLogStyle(log.level);
                            return (
                                <div
                                    key={idx}
                                    className={`flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-colors ${idx === filteredLogs.length - 1 ? 'bg-gray-800/30' : ''
                                        }`}
                                >
                                    <span className="text-gray-600 shrink-0 w-20">{log.timestamp}</span>
                                    <Icon icon={style.icon} className={`w-4 h-4 shrink-0 mt-0.5 ${style.color}`} />
                                    <span className={`shrink-0 w-20 font-semibold ${style.color}`}>[{log.level}]</span>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-gray-300">{log.message}</span>
                                        {log.details && (
                                            <div className="mt-1 text-xs text-gray-500 bg-gray-800/50 rounded px-2 py-1 inline-block">
                                                {Object.entries(log.details).map(([k, v]) => (
                                                    <span key={k} className="mr-3">
                                                        <span className="text-gray-600">{k}:</span> <span className="text-gray-400">{v}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Auto-scroll enabled | Max 500 entries</span>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs text-gray-400">Live</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MLModelLogs;
