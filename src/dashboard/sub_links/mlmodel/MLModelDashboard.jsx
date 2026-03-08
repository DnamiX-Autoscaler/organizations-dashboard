import React, { useState, useEffect, useRef } from "react";
import TitleHeader from "../../../components/common/TitleHeader";
import PodCountChart from "../../../components/mlmodel/PodCountChart";
import ResourceMetrics from "../../../components/mlmodel/ResourceMetrics";
import PerformanceMetrics from "../../../components/mlmodel/PerformanceMetrics";
import ProvisioningEfficiency from "../../../components/mlmodel/ProvisioningEfficiency";
import PredictionLogTable from "../../../components/mlmodel/PredictionLogTable";
import ModelMetrics from "../../../components/mlmodel/ModelMetrics";
import ModelInfoPanel from "../../../components/mlmodel/ModelInfoPanel";
import CostSavingsPanel from "../../../components/mlmodel/CostSavingsPanel";
import AccuracyTrendChart from "../../../components/mlmodel/AccuracyTrendChart";
import FeatureMonitor from "../../../components/mlmodel/FeatureMonitor";
import AlertsPanel from "../../../components/mlmodel/AlertsPanel";
import {
    getPodCountData,
    getResourceMetricsData,
    getPerformanceMetricsData,
    getProvisioningEfficiencyData,
} from "../../../components/mlmodel/DataGenerator";
import { fetchSimulationData, checkApiHealth, predictPodScaling } from "../../../services/mlModelService";
import { loadPredictions, savePrediction, clearPredictions, loadModelMetrics, saveModelMetrics } from "../../../services/dbService";
import { Icon } from "@iconify/react";

// Feature keys matching backend FEATURE_COLS order exactly
const FEATURE_KEYS = [
    "request_rate_rps", "latency_p95_ms", "latency_p99_ms", "error_rate_percent",
    "queue_length", "pod_cpu_usage_percent_avg", "pod_cpu_usage_percent_p95",
    "pod_memory_usage_mb_avg", "pod_memory_usage_mb_p95", "hour_sin", "hour_cos",
    "day_sin", "day_cos", "mesh_inbound_rps", "mesh_inbound_latency_p95",
    "mesh_inbound_error_rate", "degree_centrality", "eigenvector_centrality",
    "betweenness_centrality", "closeness_centrality"
];

const SIMULATION_INTERVAL_MS = 2000;

const MLModelDashboard = () => {
    const [podData, setPodData] = useState(getPodCountData());
    const [resourceData, setResourceData] = useState(getResourceMetricsData());
    const [performanceData, setPerformanceData] = useState(getPerformanceMetricsData());
    const [efficiencyData, setEfficiencyData] = useState(getProvisioningEfficiencyData());
    const [simulationQueue, setSimulationQueue] = useState([]);
    const simIndexRef = useRef(48);
    const [isApiHealthy, setIsApiHealthy] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [apiLatency, setApiLatency] = useState(0);
    const [currentPods, setCurrentPods] = useState(0);
    const [predictedPods, setPredictedPods] = useState(0);
    const [scalingStatus, setScalingStatus] = useState("Stable");
    const [predictionLog, setPredictionLog] = useState([]);
    const [modelMetrics, setModelMetrics] = useState({
        mae: 0, rmse: 0, accuracy: 0, accuracyWithin1: 0,
        totalPredictions: 0, underCount: 0, exactCount: 0, overCount: 0
    });
    const [modelHealth, setModelHealth] = useState(null);
    const [accuracyHistory, setAccuracyHistory] = useState([]);
    const [currentFeatures, setCurrentFeatures] = useState(null);
    const [featureHistory, setFeatureHistory] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const provisioningStats = useRef({ under: 0, exact: 0, over: 0, total: 0 });
    const errorHistory = useRef([]);

    // Load persisted data on mount
    useEffect(() => {
        loadPredictions().then(saved => {
            if (saved && saved.length > 0) {
                setPredictionLog(saved);
                const errors = saved.map(p => p.error);
                errorHistory.current = errors;
                const stats = { under: 0, exact: 0, over: 0, total: saved.length };
                saved.forEach(p => {
                    if (p.error < -1) stats.under++;
                    else if (p.error > 1) stats.over++;
                    else stats.exact++;
                });
                provisioningStats.current = stats;
                calculateMetrics(errors, stats);
            }
        });
        loadModelMetrics().then(saved => {
            if (saved && saved.totalPredictions > 0) setModelMetrics(saved);
        });
    }, []);

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    };

    const calculateMetrics = (errors, stats) => {
        if (errors.length === 0) return;
        const n = errors.length;
        const absErrors = errors.map(e => Math.abs(e));
        const mae = absErrors.reduce((sum, e) => sum + e, 0) / n;
        const mse = errors.reduce((sum, e) => sum + e * e, 0) / n;
        const rmse = Math.sqrt(mse);
        const exactMatches = errors.filter(e => e === 0).length;
        const accuracy = (exactMatches / n) * 100;
        const within1 = errors.filter(e => Math.abs(e) <= 1).length;
        const accuracyWithin1 = (within1 / n) * 100;
        const updated = {
            mae, rmse, accuracy, accuracyWithin1, totalPredictions: n,
            underCount: stats.under, exactCount: stats.exact, overCount: stats.over
        };
        setModelMetrics(updated);
        saveModelMetrics(updated);
    };

    const initializeChartsFromData = (dataSlice) => {
        setPodData(dataSlice.map(row => ({
            time: formatTime(row.timestamp),
            actual: row.current_pod_count,
            predicted: row.current_pod_count
        })));
        setResourceData(dataSlice.map(row => ({
            time: formatTime(row.timestamp),
            cpu: parseFloat(row.pod_cpu_usage_percent_avg || 0),
            memory: parseFloat(row.pod_memory_usage_mb_avg || 0),
            network: parseFloat(row.mesh_inbound_rps || 0)
        })));
        setPerformanceData(dataSlice.map(row => ({
            time: formatTime(row.timestamp),
            latency: parseFloat(row.latency_p95_ms || 0),
            requests: parseFloat(row.request_rate_rps || 0)
        })));
    };

    useEffect(() => {
        checkApiHealth().then(status => {
            if (status) {
                setIsApiHealthy(true);
                setModelHealth(status);
                fetchSimulationData().then(data => {
                    if (data && data.length > 48) {
                        setSimulationQueue(data);
                        initializeChartsFromData(data.slice(0, 20));
                        setFeatureHistory(data.slice(0, 48));
                        simIndexRef.current = 48;
                        setIsSimulating(true);
                    }
                }).catch(err => console.error("Simulation fetch error:", err));
            }
        });
    }, []);

    useEffect(() => {
        if (!isSimulating || !isApiHealthy || simulationQueue.length === 0) return;

        const interval = setInterval(async () => {
            const idx = simIndexRef.current;
            if (idx >= simulationQueue.length - 6) {
                simIndexRef.current = 48;
                provisioningStats.current = { under: 0, exact: 0, over: 0, total: 0 };
                errorHistory.current = [];
                setPredictionLog([]);
                clearPredictions();
                return;
            }

            const currentRow = simulationQueue[idx];
            const timestamp = new Date(currentRow.timestamp);
            const timeStr = formatTime(currentRow.timestamp);
            const actualPods = parseInt(currentRow.current_pod_count) || 2;
            const cpuUsage = parseFloat(currentRow.pod_cpu_usage_percent_avg) || 0;
            const memUsage = parseFloat(currentRow.pod_memory_usage_mb_avg) || 0;
            const networkIo = parseFloat(currentRow.mesh_inbound_rps) || 0;
            const latency = parseFloat(currentRow.latency_p95_ms) || 0;
            const requestRate = parseFloat(currentRow.request_rate_rps) || 0;
            const errorRate = parseFloat(currentRow.error_rate_percent) || 0;
            const futureRow = simulationQueue[idx + 5];
            const actualPodsAtT5 = futureRow ? parseInt(futureRow.current_pod_count) : actualPods;

            const windowRows = simulationQueue.slice(idx - 48, idx);
            const apiWindow = windowRows.map(r => {
                const features = FEATURE_KEYS.map(k => parseFloat(r[k] || 0));
                return [...features, parseFloat(r.current_pod_count || 0)];
            });

            let predictedPodsAtT5 = actualPods;
            const startTime = performance.now();
            try {
                const resp = await predictPodScaling(apiWindow, timestamp.toISOString());
                predictedPodsAtT5 = resp.predicted_pods || actualPods;
                setApiLatency(Math.round(performance.now() - startTime));
            } catch (e) {
                console.error("Prediction error:", e.message);
            }

            setCurrentPods(actualPods);
            setPredictedPods(predictedPodsAtT5);
            const scaleDiff = predictedPodsAtT5 - actualPods;
            setScalingStatus(scaleDiff > 0 ? "Scaling UP" : scaleDiff < 0 ? "Scaling DOWN" : "Stable");

            const predictionError = predictedPodsAtT5 - actualPodsAtT5;
            const stats = provisioningStats.current;
            stats.total += 1;
            if (predictionError < -1) stats.under += 1;
            else if (predictionError > 1) stats.over += 1;
            else stats.exact += 1;

            errorHistory.current.push(predictionError);
            const newEntry = {
                time: timeStr, currentPods: actualPods, predicted: predictedPodsAtT5,
                actualAtT5: actualPodsAtT5, error: predictionError
            };
            setPredictionLog(prev => [...prev, newEntry]);
            savePrediction(newEntry);
            calculateMetrics(errorHistory.current, stats);

            const total = stats.total || 1;
            const pct = {
                under: Math.round((stats.under / total) * 100),
                exact: Math.round((stats.exact / total) * 100),
                over: Math.round((stats.over / total) * 100)
            };

            setPodData(prev => {
                const history = prev.filter(d => d.actual !== null).slice(-25);
                const current = { time: timeStr, actual: actualPods, predicted: actualPods };
                const futurePoints = [];
                for (let i = 1; i <= 5; i++) {
                    const ft = new Date(timestamp.getTime() + i * 60000);
                    const interp = actualPods + (predictedPodsAtT5 - actualPods) * (i / 5);
                    futurePoints.push({ time: formatTime(ft.toISOString()), actual: null, predicted: Math.round(interp * 10) / 10 });
                }
                return [...history, current, ...futurePoints];
            });

            // Update live feature state + history
            setCurrentFeatures({ ...currentRow });
            setFeatureHistory(prev => [...prev.slice(-99), currentRow]);

            // Update accuracy trend history
            const errors = errorHistory.current;
            if (errors.length > 0) {
                const n = errors.length;
                const absErrs = errors.map(e => Math.abs(e));
                const mae = absErrs.reduce((s, e) => s + e, 0) / n;
                const rmse = Math.sqrt(errors.reduce((s, e) => s + e * e, 0) / n);
                setAccuracyHistory(prev => [...prev.slice(-89), { time: timeStr, mae, rmse }]);
            }

            // Generate contextual alerts
            const newAlerts = [];
            const absError = Math.abs(predictionError);
            if (absError > 3) {
                newAlerts.push({ level: "critical", message: `Large prediction error: ${predictionError > 0 ? '+' : ''}${predictionError} pods`, detail: `Predicted ${predictedPodsAtT5} vs actual ${actualPodsAtT5} at T+5`, time: timeStr });
            } else if (absError > 1) {
                newAlerts.push({ level: "warning", message: `Prediction miss by ${absError} pods`, detail: `Target: ${actualPodsAtT5} pods · Got: ${predictedPodsAtT5} pods`, time: timeStr });
            }
            // Consecutive under-provisioning
            const recentErrors = errorHistory.current.slice(-5);
            if (recentErrors.length === 5 && recentErrors.every(e => e < -1)) {
                newAlerts.push({ level: "critical", message: "Consecutive under-provisioning (5 in a row)", detail: "Model consistently under-estimating pod demand — SLA risk elevated", time: timeStr });
            }
            if (cpuUsage > 85) {
                newAlerts.push({ level: "warning", message: `High CPU: ${cpuUsage.toFixed(1)}%`, detail: "Pod resource saturation — scaling urgency increased", time: timeStr });
            }
            if (latency > 100) {
                newAlerts.push({ level: "warning", message: `Elevated P95 latency: ${latency.toFixed(0)}ms`, detail: "User-facing latency above 100ms threshold", time: timeStr });
            }
            if (errorRate > 2) {
                newAlerts.push({ level: "critical", message: `High error rate: ${errorRate.toFixed(2)}%`, detail: "Service error rate exceeding 2% threshold", time: timeStr });
            }
            if (newAlerts.length > 0) {
                setAlerts(prev => [...prev.slice(-49), ...newAlerts]);
            }

            setResourceData(prev => [...prev.slice(-19), { time: timeStr, cpu: cpuUsage, memory: memUsage, network: networkIo }]);
            setPerformanceData(prev => [...prev.slice(-19), { time: timeStr, latency, requests: requestRate, errorRate }]);
            setEfficiencyData([
                { name: 'Under-provisioned', value: pct.under, color: '#ef4444' },
                { name: 'Exact Match', value: pct.exact, color: '#10b981' },
                { name: 'Over-provisioned', value: pct.over, color: '#f59e0b' },
            ]);

            simIndexRef.current = idx + 1;
        }, SIMULATION_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [isSimulating, isApiHealthy, simulationQueue]);

    return (
        <div className="space-y-6">
            <TitleHeader
                title="ML Model Scaling Predictions"
                subtitle="Real-time inference and scaling decision monitoring powered by BiLSTM"
            />

            <div className={`px-4 py-3 text-sm font-medium rounded-xl flex justify-between items-center ${isApiHealthy
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200 dark:from-green-900/20 dark:to-emerald-900/20 dark:text-green-300 dark:border-green-800'
                    : 'bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-800 border border-yellow-200 dark:from-yellow-900/20 dark:to-amber-900/20 dark:text-yellow-300 dark:border-yellow-800'
                }`}>
                <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${isApiHealthy ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <Icon icon={isApiHealthy ? "mdi:server-network" : "mdi:server-network-off"} className="w-5 h-5" />
                    <span className="font-semibold">{isApiHealthy ? 'Backend Connected' : 'Backend Offline'}</span>
                    {isApiHealthy && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-800/30">API: {apiLatency}ms</span>}
                </div>
                {isSimulating && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-800/30 dark:text-blue-300 animate-pulse">● Simulating</span>}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Accuracy", value: `${modelMetrics.accuracy.toFixed(1)}%`, icon: "mdi:check-decagram", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
                    { label: "Current (T)", value: currentPods, icon: "mdi:cube-outline", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
                    { label: "Predicted (T+5)", value: predictedPods, icon: "mdi:crystal-ball", color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/20" },
                    { label: "Action", value: scalingStatus, icon: scalingStatus === "Scaling UP" ? "mdi:arrow-up-bold" : scalingStatus === "Scaling DOWN" ? "mdi:arrow-down-bold" : "mdi:minus", color: scalingStatus === "Stable" ? "text-teal-500" : "text-orange-500", bg: scalingStatus === "Stable" ? "bg-teal-50 dark:bg-teal-900/20" : "bg-orange-50 dark:bg-orange-900/20" },
                ].map((stat, i) => (
                    <div key={i} className="p-4 bg-white border border-gray-100 rounded-xl dark:bg-darkBackground dark:border-gray-700/50 flex items-center gap-3 shadow-sm">
                        <div className={`p-2.5 rounded-lg ${stat.bg}`}><Icon icon={stat.icon} className={`w-6 h-6 ${stat.color}`} /></div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Row 1: Model Info + Cost Savings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ModelInfoPanel modelHealth={modelHealth} apiLatency={apiLatency} isApiHealthy={isApiHealthy} />
                <CostSavingsPanel modelMetrics={modelMetrics} />
            </div>

            {/* Row 2: Model Performance Metrics */}
            <ModelMetrics metrics={modelMetrics} />

            {/* Row 3: Pod Prediction + Provisioning Efficiency */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2"><PodCountChart data={podData} /></div>
                <div className="lg:col-span-1"><ProvisioningEfficiency data={efficiencyData} /></div>
            </div>

            {/* Row 4: Accuracy Trend + Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AccuracyTrendChart accuracyHistory={accuracyHistory} />
                <AlertsPanel alerts={alerts} />
            </div>

            {/* Row 5: Prediction Log (with pagination + CSV export) */}
            <PredictionLogTable logs={predictionLog} />

            {/* Row 6: Resource + Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResourceMetrics data={resourceData} />
                <PerformanceMetrics data={performanceData} />
            </div>

            {/* Row 7: Live Feature Monitor */}
            <FeatureMonitor currentFeatures={currentFeatures} featureHistory={featureHistory} />
        </div>
    );
};

export default MLModelDashboard;
