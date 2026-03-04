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

// ---------------------------------------------------------------------------
// Spike row generator
// Builds synthetic CSV-compatible rows spliced into simulationQueue so the
// real ML API receives them as genuine input — not just CSV replay.
// ---------------------------------------------------------------------------
const generateSpikeRows = (type, baseRow) => {
    const now = Date.now();
    const base = {
        rps: parseFloat(baseRow?.request_rate_rps || 800),
        lat95: parseFloat(baseRow?.latency_p95_ms || 30),
        lat99: parseFloat(baseRow?.latency_p99_ms || 50),
        errRate: parseFloat(baseRow?.error_rate_percent || 0.1),
        queue: parseFloat(baseRow?.queue_length || 10),
        cpuAvg: parseFloat(baseRow?.pod_cpu_usage_percent_avg || 40),
        cpuP95: parseFloat(baseRow?.pod_cpu_usage_percent_p95 || 55),
        memAvg: parseFloat(baseRow?.pod_memory_usage_mb_avg || 300),
        memP95: parseFloat(baseRow?.pod_memory_usage_mb_p95 || 450),
        hSin: parseFloat(baseRow?.hour_sin || 0),
        hCos: parseFloat(baseRow?.hour_cos || 1),
        dSin: parseFloat(baseRow?.day_sin || 0),
        dCos: parseFloat(baseRow?.day_cos || 1),
        meshRps: parseFloat(baseRow?.mesh_inbound_rps || 300),
        meshLat: parseFloat(baseRow?.mesh_inbound_latency_p95 || 12),
        meshErr: parseFloat(baseRow?.mesh_inbound_error_rate || 0),
        degC: parseFloat(baseRow?.degree_centrality || 0.5),
        eigC: parseFloat(baseRow?.eigenvector_centrality || 0.4),
        betC: parseFloat(baseRow?.betweenness_centrality || 0.3),
        cloC: parseFloat(baseRow?.closeness_centrality || 0.6),
        pods: parseInt(baseRow?.current_pod_count || 8),
    };

    const noise = (pct = 0.05) => 1 + (Math.random() - 0.5) * pct * 2;

    const makeRow = (mult, ts) => ({
        timestamp: new Date(ts).toISOString(),
        request_rate_rps: (base.rps * mult.rps * noise()).toFixed(2),
        latency_p95_ms: (base.lat95 * mult.lat * noise()).toFixed(2),
        latency_p99_ms: (base.lat99 * mult.lat * 1.3 * noise()).toFixed(2),
        error_rate_percent: (base.errRate * mult.err * noise(0.2)).toFixed(3),
        queue_length: Math.round(base.queue * mult.rps * noise()),
        pod_cpu_usage_percent_avg: Math.min(98, base.cpuAvg * mult.cpu * noise()).toFixed(1),
        pod_cpu_usage_percent_p95: Math.min(99, base.cpuP95 * mult.cpu * 1.1 * noise()).toFixed(1),
        pod_memory_usage_mb_avg: (base.memAvg * mult.mem * noise()).toFixed(1),
        pod_memory_usage_mb_p95: (base.memP95 * mult.mem * 1.1 * noise()).toFixed(1),
        hour_sin: base.hSin, hour_cos: base.hCos, day_sin: base.dSin, day_cos: base.dCos,
        mesh_inbound_rps: (base.meshRps * mult.rps * noise()).toFixed(2),
        mesh_inbound_latency_p95: (base.meshLat * mult.lat * noise()).toFixed(2),
        mesh_inbound_error_rate: (base.meshErr + mult.err * 0.5 * noise(0.3)).toFixed(3),
        degree_centrality: base.degC, eigenvector_centrality: base.eigC,
        betweenness_centrality: base.betC, closeness_centrality: base.cloC,
        current_pod_count: Math.max(1, Math.round(base.pods * mult.pods)),
        _isSpike: true,
        _spikeType: type,
    });

    const rows = [];

    if (type === "flash_sale") {
        // 5 ramp-up + 10 peak + 5 ramp-down
        for (let i = 0; i < 20; i++) {
            const t = now + i * 5 * 60000;
            let f;
            if (i < 5) f = 1 + (i / 5) * 3; // 1→4
            else if (i < 15) f = 4 + Math.random() * 0.5; // peak 4-4.5
            else f = 4 - ((i - 15) / 5) * 3; // 4→1
            rows.push(makeRow({ rps: f, lat: 1 + f * 0.4, err: 1 + f * 0.05, cpu: 1 + f * 0.3, mem: 1 + f * 0.2, pods: Math.max(1, f * 0.9) }, t));
        }
    } else if (type === "ddos_burst") {
        // 3 sudden extreme + 5 partial mitigation + 7 recovery
        for (let i = 0; i < 15; i++) {
            const t = now + i * 5 * 60000;
            let rpsM, latM, errM, cpuM, podsM;
            if (i < 3) { rpsM = 10; latM = 8; errM = 60; cpuM = 2.2; podsM = 1; } // overload — pods haven't scaled
            else if (i < 8) { rpsM = 8 - (i - 3) * 1.2; latM = 6 - (i - 3); errM = 30 - (i - 3) * 4; cpuM = 1.8; podsM = 1 + (i - 2) * 0.8; } // scaling up
            else { rpsM = 3 - (i - 8) * 0.25; latM = 2; errM = 2; cpuM = 1.2; podsM = 3 - (i - 8) * 0.2; } // recovery
            rows.push(makeRow({ rps: rpsM, lat: latM, err: errM, cpu: cpuM, mem: 1 + cpuM * 0.3, pods: Math.max(1, podsM) }, t));
        }
    } else if (type === "gradual_ramp") {
        // Steady linear 1→3 over 25 ticks
        for (let i = 0; i < 25; i++) {
            const t = now + i * 5 * 60000;
            const f = 1 + (i / 24) * 2; // 1→3
            rows.push(makeRow({ rps: f, lat: 1 + f * 0.3, err: 1 + f * 0.1, cpu: 1 + f * 0.3, mem: 1 + f * 0.2, pods: f }, t));
        }
    } else if (type === "load_test") {
        // Sudden 3× → hold 15 ticks → clean drop
        for (let i = 0; i < 20; i++) {
            const t = now + i * 5 * 60000;
            let f;
            if (i < 2) f = 1 + (i / 2) * 2; // quick ramp
            else if (i < 17) f = 3 + (Math.random() - 0.5) * 0.2; // sustained ±noise
            else f = 3 - ((i - 17) / 3) * 2; // clean recovery
            rows.push(makeRow({ rps: f, lat: 1 + f * 0.25, err: 1.2, cpu: 1 + f * 0.28, mem: 1 + f * 0.18, pods: Math.max(1, f * 0.95) }, t));
        }
    }

    return rows;
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
        const baseRow = lastRowRef.current || simulationQueue[simIndexRef.current - 1];
        if (!baseRow) return;
        const spikeRows = generateSpikeRows(type, baseRow);
        const insertAt = simIndexRef.current;
        setSpikeActive(type);
        spikeEndRef.current = insertAt + spikeRows.length;
        setSimulationQueue((prev) => {
            const next = [...prev];
            next.splice(insertAt, 0, ...spikeRows);
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
