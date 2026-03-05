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

const SIMULATION_INTERVAL_MS = 10000; // 10 s per tick — each CSV row = 1 min of data, predicts T+5 min ahead

// ---------------------------------------------------------------------------
// Real-data scenario selector
// Instead of generating synthetic rows (which push features out-of-distribution
// and cause inaccurate predictions), each scenario finds the best matching
// real segment from the already-loaded simulationQueue (last 30% of CSV).
// The model receives data identical in distribution to its training set,
// keeping predictions stable and accurate throughout the demo.
// ---------------------------------------------------------------------------
const SCENARIO_ROW_COUNT = { flash_sale: 20, gradual_ramp: 25, load_test: 20 };

const findRealScenarioRows = (type, queue) => {
    // Skip the first 48 rows (used as the initial window seed).
    const pool = queue.slice(48);
    const rowCount = SCENARIO_ROW_COUNT[type] || 20;
    if (pool.length < rowCount) return null;

    const rpsValues = pool.map((r) => parseFloat(r.request_rate_rps || 0));
    const sorted = [...rpsValues].sort((a, b) => a - b);
    const p75 = sorted[Math.floor(sorted.length * 0.75)];

    let bestStart = 0;
    let bestScore = -Infinity;

    if (type === "load_test") {
        // Highest sustained RPS window — reward high mean, penalise variance
        // (we want a flat plateau, not a single spike).
        for (let i = 0; i <= pool.length - rowCount; i++) {
            const win = rpsValues.slice(i, i + rowCount);
            const avg = win.reduce((s, v) => s + v, 0) / rowCount;
            const std = Math.sqrt(win.reduce((s, v) => s + (v - avg) ** 2, 0) / rowCount) || 1;
            const score = avg - std * 0.5;
            if (score > bestScore) { bestScore = score; bestStart = i; }
        }

    } else if (type === "flash_sale") {
        // Window whose peak is closest to the centre (ramp-up → peak → ramp-down shape).
        for (let i = 0; i <= pool.length - rowCount; i++) {
            const win = rpsValues.slice(i, i + rowCount);
            const peakIdx = win.indexOf(Math.max(...win));
            const mid = (rowCount - 1) / 2;
            const centreScore = 1 - Math.abs(peakIdx - mid) / rowCount;
            const peakHeight = win[peakIdx];
            const score = peakHeight * centreScore;
            if (score > bestScore) { bestScore = score; bestStart = i; }
        }

    } else if (type === "gradual_ramp") {
        // Window with the strongest upward linear trend (highest Pearson r with index).
        for (let i = 0; i <= pool.length - rowCount; i++) {
            const win = rpsValues.slice(i, i + rowCount);
            const n = win.length;
            const xMean = (n - 1) / 2;
            const yMean = win.reduce((s, v) => s + v, 0) / n;
            const num = win.reduce((s, v, j) => s + (j - xMean) * (v - yMean), 0);
            const denX = Math.sqrt(win.reduce((s, _, j) => s + (j - xMean) ** 2, 0));
            const denY = Math.sqrt(win.reduce((s, v) => s + (v - yMean) ** 2, 0));
            const r = denX * denY === 0 ? 0 : num / (denX * denY);
            const gain = win[n - 1] - win[0];
            const score = r * 0.7 + (gain / (win[0] || 1)) * 0.3;
            if (score > bestScore) { bestScore = score; bestStart = i; }
        }
    } else {
        return null;
    }

    // Tag rows so OOD detection still fires for genuinely busy periods,
    // and the scenario badge stays active in the UI.
    return pool.slice(bestStart, bestStart + rowCount).map((r) => ({
        ...r,
        _isSpike: true,
        _spikeType: type,
    }));
};

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
    // Baseline stats for OOD detection (updated only from non-spike rows)
    const baselineRef = useRef({ rps: [], cpu: [], latency: [] });
    const [oodScore, setOodScore] = useState(0);
    const [modelConfidence, setModelConfidence] = useState("High");

    // Spike injection
    const [spikeActive, setSpikeActive] = useState(null);
    const spikeEndRef = useRef(null);
    const lastRowRef = useRef(null);

    const injectSpike = (type) => {
        // Use real rows from the dataset so the model receives in-distribution
        // input and predictions remain accurate during the demo.
        const realRows = findRealScenarioRows(type, simulationQueue);
        if (!realRows || realRows.length === 0) return;
        const insertAt = simIndexRef.current;
        setSpikeActive(type);
        spikeEndRef.current = insertAt + realRows.length;
        setSimulationQueue((prev) => {
            const next = [...prev];
            next.splice(insertAt, 0, ...realRows);
            return next;
        });
    };

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

        // Health check runs independently — does NOT gate simulation data loading.
        // Retries every 5 s until the remote ML API responds (handles cold-start).
        let healthRetryTimer = null;
        const tryHealth = () => {
            checkApiHealth().then((status) => {
                if (status) {
                    setIsApiHealthy(true);
                    setModelHealth(status);
                } else {
                    healthRetryTimer = setTimeout(tryHealth, 5000);
                }
            });
        };
        tryHealth();

        // Load simulation data independently — local server responds in <50 ms
        // so isSimulating becomes true immediately regardless of remote API state.
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

        return () => { if (healthRetryTimer) clearTimeout(healthRetryTimer); };
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

            // Clear spike flag once we've consumed all injected rows
            if (spikeEndRef.current && idx >= spikeEndRef.current) {
                setSpikeActive(null);
                spikeEndRef.current = null;
            }

            const row = simulationQueue[idx];
            lastRowRef.current = row;
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
                // Round to nearest integer — pod counts are always whole numbers
                predictedPodsAtT5 = Math.round(resp.predicted_pods) || actualPods;
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
                // Strip predicted from all history so the forecast line only shows current→future
                const history = prev
                    .filter((d) => d.actual !== null)
                    .slice(-25)
                    .map((d) => ({ time: d.time, actual: d.actual, predicted: null }));
                // Current tick: anchor both lines at the same value
                const current = { time: timeStr, actual: actualPods, predicted: actualPods };
                const future = [];
                for (let i = 1; i <= 5; i++) {
                    const ft = new Date(timestamp.getTime() + i * 60000);
                    const interp = actualPods + (predictedPodsAtT5 - actualPods) * (i / 5);
                    future.push({ time: formatTime(ft.toISOString()), actual: null, predicted: Math.round(interp * 10) / 10 });
                }
                return [...history, current, ...future];
            });

            // OOD detection: compare current row to baseline (pre-spike) mean/std
            const bl = baselineRef.current;
            const computeStats = (arr) => {
                if (arr.length < 5) return { mean: null, std: null };
                const mean = arr.reduce((s, v) => s + v, 0) / arr.length;
                const std = Math.sqrt(arr.reduce((s, v) => s + (v - mean) ** 2, 0) / arr.length) || 1;
                return { mean, std };
            };
            const blRps = computeStats(bl.rps);
            const blCpu = computeStats(bl.cpu);
            const blLat = computeStats(bl.latency);
            let maxZ = 0;
            if (blRps.mean) maxZ = Math.max(maxZ, Math.abs((requestRate - blRps.mean) / blRps.std));
            if (blCpu.mean) maxZ = Math.max(maxZ, Math.abs((cpuUsage - blCpu.mean) / blCpu.std));
            if (blLat.mean) maxZ = Math.max(maxZ, Math.abs((latency - blLat.mean) / blLat.std));
            const newOod = Math.min(100, Math.round(maxZ * 10));
            setOodScore(newOod);
            const newConf = maxZ < 2 ? "High" : maxZ < 4 ? "Medium" : maxZ < 7 ? "Low" : "Critical";
            setModelConfidence(newConf);
            // Update baseline only from normal (non-spike) rows
            if (!row._isSpike) {
                bl.rps = [...bl.rps.slice(-49), requestRate];
                bl.cpu = [...bl.cpu.slice(-49), cpuUsage];
                bl.latency = [...bl.latency.slice(-49), latency];
            }

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
            // OOD alert when model enters low/critical confidence during a spike
            if (spikeActive && (newConf === "Low" || newConf === "Critical") && newOod > (newConf === "Critical" ? 60 : 40)) {
                const alreadyHasOod = newAlerts.some((a) => a.message?.startsWith("[OOD]"));
                if (!alreadyHasOod) {
                    newAlerts.push({
                        level: newConf === "Critical" ? "critical" : "warning",
                        message: `[OOD] Model confidence: ${newConf} — input ${newOod}% out-of-distribution`,
                        detail: `RPS z=${blRps.mean ? ((requestRate - blRps.mean) / blRps.std).toFixed(1) : "n/a"}, CPU z=${blCpu.mean ? ((cpuUsage - blCpu.mean) / blCpu.std).toFixed(1) : "n/a"}, Latency z=${blLat.mean ? ((latency - blLat.mean) / blLat.std).toFixed(1) : "n/a"} — predictions may under-estimate demand`,
                        time: timeStr,
                    });
                }
            }
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
                // Spike injection
                injectSpike, spikeActive,
                // OOD / confidence
                oodScore, modelConfidence,
            }}
        >
            {children}
        </MLModelContext.Provider>
    );
};
