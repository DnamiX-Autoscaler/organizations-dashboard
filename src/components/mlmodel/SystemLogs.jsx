import React, { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

const SystemLogs = ({ logs }) => {
    const logContainerRef = useRef(null);

    // Auto-scroll to bottom when new logs arrive
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    const getLogLevelStyle = (level) => {
        switch (level) {
            case 'INFO':
                return 'text-blue-400';
            case 'SUCCESS':
                return 'text-emerald-400';
            case 'WARN':
                return 'text-yellow-400';
            case 'ERROR':
                return 'text-red-400';
            case 'PREDICT':
                return 'text-violet-400';
            case 'SCALE':
                return 'text-orange-400';
            default:
                return 'text-gray-400';
        }
    };

    const getLogIcon = (level) => {
        switch (level) {
            case 'INFO':
                return 'mdi:information';
            case 'SUCCESS':
                return 'mdi:check-circle';
            case 'WARN':
                return 'mdi:alert';
            case 'ERROR':
                return 'mdi:alert-circle';
            case 'PREDICT':
                return 'mdi:crystal-ball';
            case 'SCALE':
                return 'mdi:arrow-expand-vertical';
            default:
                return 'mdi:circle-small';
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center gap-2">
                    <Icon icon="mdi:console" className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-semibold text-white">System Logs</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-gray-400">Live</span>
                </div>
            </div>

            {/* Log Container */}
            <div
                ref={logContainerRef}
                className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-1 min-h-[400px] max-h-[600px]"
                style={{ scrollBehavior: 'smooth' }}
            >
                {(!logs || logs.length === 0) ? (
                    <div className="text-gray-500 text-center py-8">
                        <Icon icon="mdi:console-line" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Waiting for logs...</p>
                    </div>
                ) : (
                    logs.map((log, idx) => (
                        <div
                            key={idx}
                            className={`flex items-start gap-2 py-1 px-2 rounded hover:bg-gray-800/50 transition-colors ${idx === logs.length - 1 ? 'bg-gray-800/30' : ''
                                }`}
                        >
                            <span className="text-gray-600 shrink-0">{log.timestamp}</span>
                            <Icon
                                icon={getLogIcon(log.level)}
                                className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${getLogLevelStyle(log.level)}`}
                            />
                            <span className={`font-semibold shrink-0 w-16 ${getLogLevelStyle(log.level)}`}>
                                [{log.level}]
                            </span>
                            <span className="text-gray-300 break-all">{log.message}</span>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                    {logs?.length || 0} entries
                </span>
                <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                        <span className="text-gray-500">INFO</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-violet-400" />
                        <span className="text-gray-500">PREDICT</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-orange-400" />
                        <span className="text-gray-500">SCALE</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SystemLogs;
