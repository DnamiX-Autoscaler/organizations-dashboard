import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

const random = (min, max) => Math.random() * (max - min) + min;
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function generateMetrics(type) {
    if (type === "scale_up" || type === "scale_down") {
        return {
            successRate: random(0.96, 0.99).toFixed(3),
            errorRate: random(0.0001, 0.005).toFixed(4),
            p95LatencyBefore: randomInt(150, 300),
            p95LatencyAfter: randomInt(100, 250),
            cpuPercent: randomInt(50, 75),
            memPercent: randomInt(20, 60),
            restartCount: randomInt(0, 1),
            trafficRecovery: random(0.95, 0.99).toFixed(2)
        };
    }

    // rollback scenario
    if (type === "rollback") {
        return {
            successRate: random(0.85, 0.94).toFixed(3),
            errorRate: random(0.05, 0.1).toFixed(3),
            p95LatencyBefore: randomInt(200, 400),
            p95LatencyAfter: randomInt(900, 1500),
            cpuPercent: randomInt(91, 100),
            memPercent: randomInt(85, 100),
            restartCount: randomInt(3, 5),
            trafficRecovery: random(0.5, 0.89).toFixed(2)
        };
    }
}

function generateRequestBody(type) {
    const action = type === "rollback" ? "scale_up" : type;
    return {
        services: [
            {
                deployment: "order",
                namespace: "ecommerce-test",
                request_pods: randomInt(1, 3),
                scale_action: action,
                metrics: generateMetrics(type)
            }
        ]
    };
}

const TestEnvironment = () => {
    const [logs, setLogs] = useState([]);
    const [isAutoMode, setIsAutoMode] = useState(false);
    const intervalRef = useRef(null);

    const sendScalingRequest = async (type) => {
        const body = generateRequestBody(type);
        const logId = Date.now();

        // Add log entry immediately with loading state
        setLogs(prev => [{
            id: logId,
            time: new Date().toLocaleTimeString(),
            type,
            request: body,
            status: 'loading',
            response: null
        }, ...prev].slice(0, 50));

        let resultData = null;

        try {
            const res = await fetch("/api/v1/scale-with-metrics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            resultData = await res.json();
        } catch (error) {
            resultData = { error: error.message };
        }

        // Update the log entry with the response
        setLogs(prev => prev.map(log =>
            log.id === logId ? { ...log, status: 'complete', response: resultData } : log
        ));
    };

    const toggleAutoMode = () => {
        setIsAutoMode(prev => !prev);
    };

    useEffect(() => {
        if (isAutoMode) {
            intervalRef.current = setInterval(() => {
                const types = ["scale_up", "scale_down", "rollback"];
                const t = types[Math.floor(Math.random() * types.length)];
                sendScalingRequest(t);
            }, 8000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isAutoMode]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Icon icon="lucide:zap" className="w-6 h-6 text-yellow-500" />
                        Chaos & Scaling Simulator
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Generate synthetic metrics and trigger mock scaling events instantly
                    </p>
                </div>

                <button
                    onClick={toggleAutoMode}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all shadow-lg ${isAutoMode
                        ? 'bg-red-500 hover:bg-red-600 outline-red-500/50 shadow-red-500/20 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 outline-indigo-500/50 shadow-indigo-500/20 text-white'
                        } outline outline-4 pl-4`}
                >
                    {isAutoMode ? <Icon icon="lucide:square" className="w-5 h-5 fill-current" /> : <Icon icon="lucide:play" className="w-5 h-5 fill-current" />}
                    {isAutoMode ? 'Stop Auto Simulator' : 'Start Auto Simulator'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SimulatorCard
                    title="Simulate Scale Up"
                    description="Triggers SUCCESS_VALIDATED upscale"
                    icon={<Icon icon="lucide:arrow-up-circle" className="w-8 h-8 text-green-500" />}
                    onClick={() => sendScalingRequest("scale_up")}
                    color="green"
                />
                <SimulatorCard
                    title="Simulate Scale Down"
                    description="Triggers SUCCESS_VALIDATED downscale"
                    icon={<Icon icon="lucide:arrow-down-circle" className="w-8 h-8 text-blue-500" />}
                    onClick={() => sendScalingRequest("scale_down")}
                    color="blue"
                />
                <SimulatorCard
                    title="Inject Chaos (Rollback)"
                    description="Triggers ROLLED_BACK with critical anomalies"
                    icon={<Icon icon="lucide:refresh-ccw" className="w-8 h-8 text-red-500" />}
                    onClick={() => sendScalingRequest("rollback")}
                    color="red"
                />
            </div>

            <div className="bg-white dark:bg-darkBackground p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm mt-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <Icon icon="lucide:activity" className="w-5 h-5 text-indigo-500" />
                    Simulation Event Stream
                </h2>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {logs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-darkBackgroundVery rounded-lg border border-dashed border-gray-200 dark:border-gray-800">
                            <Icon icon="lucide:server" className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-2" />
                            <p className="text-gray-400 dark:text-gray-500">No events simulated yet. Fire a request above!</p>
                        </div>
                    ) : (
                        logs.map((log) => (
                            <LogEntry key={log.id} log={log} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const SimulatorCard = ({ title, description, icon, onClick, color }) => {
    const colorMap = {
        green: 'hover:border-green-400 dark:hover:border-green-500 hover:shadow-green-500/10',
        blue: 'hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-blue-500/10',
        red: 'hover:border-red-400 dark:hover:border-red-500 hover:shadow-red-500/10',
    };

    return (
        <div
            onClick={onClick}
            className={`bg-white dark:bg-darkBackground p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm cursor-pointer transition-all duration-300 group ${colorMap[color]}`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gray-50 dark:bg-darkBackgroundVery rounded-lg group-hover:scale-110 transition-transform">
                    {icon}
                </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
    );
};

const LogEntry = ({ log }) => {
    const isError = log.type === 'rollback';
    const isLoading = log.status === 'loading';

    return (
        <div className={`p-4 rounded-xl border ${isError ? 'bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30' : 'bg-gray-50 dark:bg-darkBackgroundVery border-gray-100 dark:border-gray-800'}`}>
            <div className="flex items-center justify-between mb-3 border-b border-gray-100 dark:border-gray-800 pb-2">
                <div className="flex items-center gap-2">
                    {isError ? <Icon icon="lucide:shield-alert" className="w-4 h-4 text-red-500" /> : <Icon icon="lucide:activity" className="w-4 h-4 text-indigo-500" />}
                    <span className={`text-sm font-semibold uppercase tracking-wider ${isError ? 'text-red-600 dark:text-red-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                        {log.type.replace('_', ' ')}
                    </span>
                    {isLoading && (
                        <span className="flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium">
                            <Icon icon="lucide:loader-2" className="w-3 h-3 animate-spin" />
                            Processing
                        </span>
                    )}
                </div>
                <span className="text-xs text-gray-400">{log.time}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Synthetic Payload</span>
                    <pre className="text-xs bg-white dark:bg-darkBackground p-3 rounded border border-gray-100 dark:border-gray-800 overflow-x-auto text-gray-700 dark:text-gray-300">
                        {JSON.stringify(log.request, null, 2)}
                    </pre>
                </div>
                <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase mb-1 block">System Response</span>
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-darkBackground rounded border border-gray-100 dark:border-gray-800 h-[100px]">
                            <Icon icon="lucide:loader-2" className="w-6 h-6 text-indigo-500 animate-spin mb-2" />
                            <span className="text-xs text-gray-500 animate-pulse">Awaiting API Response...</span>
                        </div>
                    ) : (
                        <pre className={`text-xs p-3 rounded border overflow-x-auto ${isError ? 'bg-white dark:bg-darkBackground border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400' : 'bg-white dark:bg-darkBackground border-gray-100 dark:border-gray-800 text-green-600 dark:text-green-400'}`}>
                            {JSON.stringify(log.response, null, 2)}
                        </pre>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestEnvironment;
