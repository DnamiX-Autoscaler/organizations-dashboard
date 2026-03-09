const API_BASE = import.meta.env.VITE_EXECUTOR_API ?? "http://localhost:6000";

const WINDOW_SIZE = 48;
const ROW_WIDTH = 21;

const rand = (min, max) => Math.random() * (max - min) + min;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const buildTimeLabel = (minutesBack) => {
    const d = new Date(Date.now() - minutesBack * 60000);
    return d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
};

// Generates a single row in the backend order:
// 20 features + current_pod_count (last column), total width = 21.
export const generateRandomFeatureRow = (currentPods = 3, idx = 0) => {
    const pods = Math.max(1, Number(currentPods) || 3);
    const dayProgress = (idx % WINDOW_SIZE) / WINDOW_SIZE;
    const diurnal = Math.sin(dayProgress * Math.PI * 2);
    const inverseDiurnal = Math.cos(dayProgress * Math.PI * 2);

    const requestRate = rand(180, 620) * (1 + 0.12 * diurnal);
    const latencyP95 = rand(35, 120) * (1 + 0.08 * inverseDiurnal);
    const latencyP99 = latencyP95 * rand(1.08, 1.35);
    const errorRatePct = clamp(rand(0.05, 1.5), 0.01, 5);
    const queueLength = Math.max(0, rand(2, 40));

    const cpuAvg = clamp(rand(30, 70) + pods * 0.8, 5, 99);
    const cpuP95 = clamp(cpuAvg + rand(4, 15), 5, 100);
    const memAvg = clamp(rand(240, 680) + pods * 20, 80, 4096);
    const memP95 = clamp(memAvg + rand(30, 180), 100, 4096);

    const hourSin = diurnal;
    const hourCos = inverseDiurnal;
    const daySin = Math.sin(dayProgress * Math.PI);
    const dayCos = Math.cos(dayProgress * Math.PI);

    const meshInboundRps = requestRate * rand(0.85, 1.2);
    const meshInboundLatencyP95 = latencyP95 * rand(0.9, 1.25);
    const meshInboundErrorRate = clamp(errorRatePct / 100 * rand(0.8, 1.25), 0, 1);

    const degreeCentrality = clamp(rand(0.15, 0.85), 0, 1);
    const eigenvectorCentrality = clamp(rand(0.05, 0.95), 0, 1);
    const betweennessCentrality = clamp(rand(0.01, 0.7), 0, 1);
    const closenessCentrality = clamp(rand(0.1, 0.95), 0, 1);

    return [
        Number(requestRate.toFixed(2)),
        Number(latencyP95.toFixed(2)),
        Number(latencyP99.toFixed(2)),
        Number(errorRatePct.toFixed(4)),
        Number(queueLength.toFixed(2)),
        Number(cpuAvg.toFixed(2)),
        Number(cpuP95.toFixed(2)),
        Number(memAvg.toFixed(2)),
        Number(memP95.toFixed(2)),
        Number(hourSin.toFixed(6)),
        Number(hourCos.toFixed(6)),
        Number(daySin.toFixed(6)),
        Number(dayCos.toFixed(6)),
        Number(meshInboundRps.toFixed(2)),
        Number(meshInboundLatencyP95.toFixed(2)),
        Number(meshInboundErrorRate.toFixed(6)),
        Number(degreeCentrality.toFixed(6)),
        Number(eigenvectorCentrality.toFixed(6)),
        Number(betweennessCentrality.toFixed(6)),
        Number(closenessCentrality.toFixed(6)),
        pods,
    ];
};

export const buildScenarioWindow = (scenario, currentPods = 3) => {
    const window = [];
    for (let i = 0; i < WINDOW_SIZE; i++) {
        const row = generateRandomFeatureRow(currentPods, i);

        // Scenario shaping on top of the base generator.
        if (scenario === "load_test") {
            row[0] *= 1.8; // request_rate_rps
            row[1] *= 1.4; // latency_p95_ms
            row[2] *= 1.4; // latency_p99_ms
            row[5] *= 1.3; // cpu avg
            row[7] *= 1.2; // mem avg
        } else if (scenario === "flash_sale") {
            row[0] *= (i < 16 ? 1.2 : i < 32 ? 2.4 : 1.4);
            row[1] *= 1.5;
            row[2] *= 1.6;
        } else if (scenario === "gradual_ramp") {
            const factor = 1 + i / 96;
            row[0] *= factor;
            row[5] *= factor;
            row[7] *= factor;
        }

        row[0] = Number(row[0].toFixed(2));
        row[1] = Number(row[1].toFixed(2));
        row[2] = Number(row[2].toFixed(2));
        row[5] = Number(row[5].toFixed(2));
        row[7] = Number(row[7].toFixed(2));
        window.push(row);
    }
    return window;
};

export const sendWindowToBackend = async ({
    serviceId = "Order",
    window,
    dryRun = false,
    validate = true,
    source = "dashboard_synthetic",
}) => {
    if (!Array.isArray(window) || window.length !== WINDOW_SIZE) {
        throw new Error(`window must contain ${WINDOW_SIZE} rows`);
    }
    if (window.some((r) => !Array.isArray(r) || r.length !== ROW_WIDTH)) {
        throw new Error(`each row must contain ${ROW_WIDTH} values`);
    }

    const res = await fetch(`${API_BASE}/api/v1/metrics/window`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            serviceId,
            timestamp: new Date().toISOString(),
            window,
            dryRun,
            validate,
            source,
        }),
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
};

// Existing dashboard placeholders (used as initial chart states before live data loads).
export const getPodCountData = () => {
    return Array.from({ length: 20 }, (_, i) => {
        const t = 19 - i;
        const base = Math.max(2, Math.round(3 + Math.sin(i / 4) * 1.5));
        return {
            time: buildTimeLabel(t),
            actual: base,
            predicted: base,
        };
    });
};

export const getResourceMetricsData = () => {
    return Array.from({ length: 20 }, (_, i) => {
        const t = 19 - i;
        return {
            time: buildTimeLabel(t),
            cpu: Number((45 + Math.sin(i / 3) * 8 + rand(-2, 2)).toFixed(1)),
            memory: Number((420 + Math.cos(i / 4) * 65 + rand(-20, 20)).toFixed(1)),
            network: Number((250 + Math.sin(i / 5) * 90 + rand(-15, 15)).toFixed(1)),
        };
    });
};

export const getPerformanceMetricsData = () => {
    return Array.from({ length: 20 }, (_, i) => {
        const t = 19 - i;
        return {
            time: buildTimeLabel(t),
            latency: Number((68 + Math.sin(i / 4) * 11 + rand(-4, 4)).toFixed(1)),
            requests: Number((360 + Math.cos(i / 3) * 70 + rand(-20, 20)).toFixed(1)),
            errorRate: Number(clamp(rand(0.05, 1.4), 0, 5).toFixed(3)),
        };
    });
};

export const getProvisioningEfficiencyData = () => {
    return [
        { name: "Under-provisioned", value: 0, color: "#ef4444" },
        { name: "Exact Match", value: 100, color: "#10b981" },
        { name: "Over-provisioned", value: 0, color: "#f59e0b" },
    ];
};
