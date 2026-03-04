/**
 * MLModelContext
 * Centralises all live simulation state so it persists across
 * mlmodel sub-pages without restarting when the user navigates.
 */
import React, { useState, useEffect, useRef } from "react";
import { MLModelContext } from "./MLModelContextDef";import {
    getPodCountData,
    getResourceMetricsData,
    getPerformanceMetricsData,
    getProvisioningEfficiencyData,
} from "../components/mlmodel/DataGenerator";
import { fetchSimulationData, checkApiHealth, predictPodScaling } from "./mlModelService";
import {
    loadPredictions, savePrediction, clearPredictions,
    loadModelMetrics, saveModelMetrics,
} from "./dbService";

const FEATURE_KEYS = [
    "request_rate_rps", "latency_p95_ms", "latency_p99_ms", "error_rate_percent",
    "queue_length", "pod_cpu_usage_percent_avg", "pod_cpu_usage_percent_p95",
    "pod_memory_usage_mb_avg", "pod_memory_usage_mb_p95", "hour_sin", "hour_cos",
    "day_sin", "day_cos", "mesh_inbound_rps", "mesh_inbound_latency_p95",
    "mesh_inbound_error_rate", "degree_centrality", "eigenvector_centrality",
    "betweenness_centrality", "closeness_centrality",
];

const SIMULATION_INTERVAL_MS = 2000;

// MLModelContext is imported from MLModelContextDef.js
// hook lives in useMLModel.js to satisfy Fast Refresh constraints

export const MLModelProvider = ({ children }) => {
    // Charts
    const [podData, setPodData] = useState(getPodCountData());
    const [resourceData, setResourceData] = useState(getResourceMetricsData());
    const [performanceData, setPerformanceData] = useState(getPerformanceMetricsData());
    const [efficiencyData, setEfficiencyData] = useState(getProvisioningEfficiencyData());

    // Connection / simulation
    const [simulationQueue, setSimulationQueue] = useState([]);
    const simIndexRef = useRef(48);
    const [isApiHealthy, setIsApiHealthy] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [apiLatency, setApiLatency] = useState(0);
    const [modelHealth, setModelHealth] = useState(null);

    // Live values
    const [currentPods, setCurrentPods] = useState(0);
    const [predictedPods, setPredictedPods] = useState(0);
    const [scalingStatus, setScalingStatus] = useState("Stable");

    // Full history
    const [predictionLog, setPredictionLog] = useState([]);
    const [accuracyHistory, setAccuracyHistory] = useState([]);
    const [currentFeatures, setCurrentFeatures] = useState(null);
    const [featureHistory, setFeatureHistory] = useState([]);
    const [alerts, setAlerts] = useState([]);

    // Model metrics summary
    const [modelMetrics, setModelMetrics] = useState({
        mae: 0, rmse: 0, accuracy: 0, accuracyWithin1: 0,
        totalPredictions: 0, underCount: 0, exactCount: 0, overCount: 0,
    });

    const provisioningStats = useRef({ under: 0, exact: 0, over: 0, total: 0 });
    const errorHistory = useRef([]);

    const formatTime = (ts) =>
        new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const calculateMetrics = (errors, stats) => {
        if (errors.length === 0) return;
        const n = errors.length;
        const absErrors = errors.map((e) => Math.abs(e));
        const mae = absErrors.reduce((s, e) => s + e, 0) / n;
        const rmse = Math.sqrt(errors.reduce((s, e) => s + e * e, 0) / n);
        const exactMatches = errors.filter((e) => e === 0).length;
        const accuracy = (exactMatches / n) * 100;
        const within1 = errors.filter((e) => Math.abs(e) <= 1).length;
        const accuracyWithin1 = (within1 / n) * 100;
        const updated = {
            mae, rmse, accuracy, accuracyWithin1,
            totalPredictions: n,
            underCount: stats.under,
            exactCount: stats.exact,
            overCount: stats.over,
        };
        setModelMetrics(updated);
        saveModelMetrics(updated);
    };

    const initializeChartsFromData = (slice) => {
        setPodData(slice.map((row) => ({
            time: formatTime(row.timestamp),
            actual: row.current_pod_count,
            predicted: row.current_pod_count,
        })));
        setResourceData(slice.map((row) => ({
            time: formatTime(row.timestamp),
            cpu: parseFloat(row.pod_cpu_usage_percent_avg || 0),
            memory: parseFloat(row.pod_memory_usage_mb_avg || 0),
            network: parseFloat(row.mesh_inbound_rps || 0),
        })));
        setPerformanceData(slice.map((row) => ({
            time: formatTime(row.timestamp),
            latency: parseFloat(row.latency_p95_ms || 0),
            requests: parseFloat(row.request_rate_rps || 0),
            errorRate: parseFloat(row.error_rate_percent || 0),
        })));
    };

    // Boot: health check + load persisted data
    useEffect(() => {
        loadPredictions().then((saved) => {
            if (saved?.length > 0) {
                setPredictionLog(saved);
                const errors = saved.map((p) => p.error);
                errorHistory.current = errors;
                const stats = { under: 0, exact: 0, over: 0, total: saved.length };
                saved.forEach((p) => {
                    if (p.error < -1) stats.under++;
                    else if (p.error > 1) stats.over++;
                    else stats.exact++;
                });
                provisioningStats.current = stats;
                calculateMetrics(errors, stats);
            }
        });
        loadModelMetrics().then((saved) => {
            if (saved?.totalPredictions > 0) setModelMetrics(saved);
        });

        checkApiHealth().then((status) => {
            if (status) {
                setIsApiHealthy(true);
                setModelHealth(status);
                fetchSimulationData()
                    .then((data) => {
                        if (data?.length > 48) {
                            setSimulationQueue(data);
                            initializeChartsFromData(data.slice(0, 20));
                            setFeatureHistory(data.slice(0, 48));
                            simIndexRef.current = 48;
                            setIsSimulating(true);
                        }
                    })
                    .catch((err) => console.error("Simulation fetch error:", err));
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Main simulation tick
    useEffect(() => {
        if (!isSimulating || !isApiHealthy || simulationQueue.length === 0) return;

        const interval = setInterval(async () => {
            const idx = simIndexRef.current;
            if (idx >= simulationQueue.length - 6) {
                simIndexRef.current = 48;
                provisioningStats.current = { under: 0, exact: 0, over: 0, total: 0 };
                errorHistory.current = [];
                setPredictionLog([]);
                setAccuracyHistory([]);
                setAlerts([]);
                clearPredictions();
                return;
            }

            const row = simulationQueue[idx];
            const timestamp = new Date(row.timestamp);
            const timeStr = formatTime(row.timestamp);
            const actualPods = parseInt(row.current_pod_count) || 2;
            const cpuUsage = parseFloat(row.pod_cpu_usage_percent_avg) || 0;
            const memUsage = parseFloat(row.pod_memory_usage_mb_avg) || 0;
            const networkIo = parseFloat(row.mesh_inbound_rps) || 0;
            const latency = parseFloat(row.latency_p95_ms) || 0;
            const requestRate = parseFloat(row.request_rate_rps) || 0;
            const errorRate = parseFloat(row.error_rate_percent) || 0;
            const futureRow = simulationQueue[idx + 5];
            const actualPodsAtT5 = futureRow ? parseInt(futureRow.current_pod_count) : actualPods;

            const windowRows = simulationQueue.slice(idx - 48, idx);
            const apiWindow = windowRows.map((r) => {
                const features = FEATURE_KEYS.map((k) => parseFloat(r[k] || 0));
                return [...features, parseFloat(r.current_pod_count || 0)];
            });

            let predictedPodsAtT5 = actualPods;
            const t0 = performance.now();
            try {
                const resp = await predictPodScaling(apiWindow, timestamp.toISOString());
                predictedPodsAtT5 = resp.predicted_pods || actualPods;
                setApiLatency(Math.round(performance.now() - t0));
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

            // Prediction log
            const entry = {
                time: timeStr, currentPods: actualPods, predicted: predictedPodsAtT5,
                actualAtT5: actualPodsAtT5, error: predictionError,
            };
            setPredictionLog((prev) => [...prev, entry]);
            savePrediction(entry);
            calculateMetrics(errorHistory.current, stats);

            // Accuracy trend
            const errs = errorHistory.current;
            const n = errs.length;
            const mae = errs.map(Math.abs).reduce((s, e) => s + e, 0) / n;
            const rmse = Math.sqrt(errs.reduce((s, e) => s + e * e, 0) / n);
            setAccuracyHistory((prev) => [...prev.slice(-89), { time: timeStr, mae, rmse }]);

            // Provisioning efficiency chart
            const total = stats.total || 1;
            const pct = {
                under: Math.round((stats.under / total) * 100),
                exact: Math.round((stats.exact / total) * 100),
                over: Math.round((stats.over / total) * 100),
            };
            setEfficiencyData([
                { name: "Under-provisioned", value: pct.under, color: "#ef4444" },
                { name: "Exact Match", value: pct.exact, color: "#10b981" },
                { name: "Over-provisioned", value: pct.over, color: "#f59e0b" },
            ]);

            // Pod count chart
            setPodData((prev) => {
                const history = prev.filter((d) => d.actual !== null).slice(-25);
                const current = { time: timeStr, actual: actualPods, predicted: actualPods };
                const future = [];
                for (let i = 1; i <= 5; i++) {
                    const ft = new Date(timestamp.getTime() + i * 60000);
                    const interp = actualPods + (predictedPodsAtT5 - actualPods) * (i / 5);
                    future.push({ time: formatTime(ft.toISOString()), actual: null, predicted: Math.round(interp * 10) / 10 });
                }
                return [...history, current, ...future];
            });

            // Resource + performance charts
            setResourceData((prev) => [...prev.slice(-19), { time: timeStr, cpu: cpuUsage, memory: memUsage, network: networkIo }]);
            setPerformanceData((prev) => [...prev.slice(-19), { time: timeStr, latency, requests: requestRate, errorRate }]);

            // Feature monitor
            setCurrentFeatures({ ...row });
            setFeatureHistory((prev) => [...prev.slice(-99), row]);

            // Alerts
            const newAlerts = [];
            const absErr = Math.abs(predictionError);
            if (absErr > 3) {
                newAlerts.push({ level: "critical", message: `Large prediction error: ${predictionError > 0 ? "+" : ""}${predictionError} pods`, detail: `Predicted ${predictedPodsAtT5} vs actual ${actualPodsAtT5} at T+5`, time: timeStr });
            } else if (absErr > 1) {
                newAlerts.push({ level: "warning", message: `Prediction miss by ${absErr} pods`, detail: `Target: ${actualPodsAtT5} pods · Got: ${predictedPodsAtT5} pods`, time: timeStr });
            }
            const recentErrs = errorHistory.current.slice(-5);
            if (recentErrs.length === 5 && recentErrs.every((e) => e < -1)) {
                newAlerts.push({ level: "critical", message: "Consecutive under-provisioning (5 in a row)", detail: "Model consistently under-estimating demand — SLA risk elevated", time: timeStr });
            }
            if (cpuUsage > 85) newAlerts.push({ level: "warning", message: `High CPU: ${cpuUsage.toFixed(1)}%`, detail: "Pod resource saturation — scaling urgency increased", time: timeStr });
            if (latency > 100) newAlerts.push({ level: "warning", message: `Elevated P95 latency: ${latency.toFixed(0)}ms`, detail: "User-facing latency above 100ms threshold", time: timeStr });
            if (errorRate > 2) newAlerts.push({ level: "critical", message: `High error rate: ${errorRate.toFixed(2)}%`, detail: "Service error rate exceeding 2% threshold", time: timeStr });
            if (newAlerts.length > 0) setAlerts((prev) => [...prev.slice(-49), ...newAlerts]);

            simIndexRef.current = idx + 1;
        }, SIMULATION_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [isSimulating, isApiHealthy, simulationQueue]);

    return (
        <MLModelContext.Provider
            value={{
                // Status
                isApiHealthy, isSimulating, apiLatency, modelHealth,
                // Live scalars
                currentPods, predictedPods, scalingStatus,
                // Charts
                podData, resourceData, performanceData, efficiencyData,
                // History / analysis
                predictionLog, accuracyHistory, currentFeatures, featureHistory,
                alerts, modelMetrics,
            }}
        >
            {children}
        </MLModelContext.Provider>
    );
};
