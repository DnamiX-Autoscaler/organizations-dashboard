/**
 * DataGenerator.js
 * Generates mock data for the ML Model Dashboard.
 */

const generateTimeLabels = (count) => {
  const labels = [];
  const now = new Date();
  for (let i = count; i > 0; i--) {
    const d = new Date(now.getTime() - i * 60000); // Minutes ago
    labels.push(d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
  }
  return labels;
};

// Generate a single row of 21 features with wave-like patterns for ML consistency
export const generateRandomFeatureRow = (currentPods, step = 0) => {
  // 20 features + 1 target
  const row = [];
  
  // Base patterns using sine waves to simulate daily/hourly traffic
  const baseWave = Math.sin(step * 0.1) * 0.5 + 0.5; // 0 to 1
  const noise = () => (Math.random() - 0.5) * 0.2; // +/- 0.1 noise

  // Feature scales match actual data.csv observations:
  //   RPS: 17–780 (simulation zone 17–780; typical 50–250)
  //   Latency p95: 50–200 ms
  //   CPU avg: 20–60 %
  //   Memory avg: 470–680 MB

  // 1. request_rate_rps
  row.push(50 + baseWave * 200 + noise() * 30);

  // 2-3. latency (slightly correlated with load)
  row.push(50 + baseWave * 80 + noise() * 10);   // p95
  row.push(70 + baseWave * 120 + noise() * 15);  // p99

  // 4. error rate (spikes rarely, low base)
  row.push(Math.max(0, Math.random() > 0.9 ? Math.random() * 0.5 : 0.035));

  // 5. queue length
  row.push(Math.floor(baseWave * 20 + Math.random() * 5));

  // 6-9. CPU/Mem (correlated with load)
  row.push(20 + baseWave * 20 + noise() * 4);   // CPU avg %
  row.push(28 + baseWave * 28 + noise() * 5);   // CPU p95 %
  row.push(470 + baseWave * 130 + noise() * 30); // Mem avg MB
  row.push(520 + baseWave * 150 + noise() * 35); // Mem p95 MB

  // 10-13. Time encoding
  row.push(Math.sin(step * 0.05));
  row.push(Math.cos(step * 0.05));
  row.push(Math.sin(step * 0.01));
  row.push(Math.cos(step * 0.01));

  // 14-16. Mesh stats (closely track request_rate_rps)
  row.push(45 + baseWave * 190 + noise() * 25);
  row.push(50 + baseWave * 75 + noise() * 8);
  row.push(0.035 + noise() * 0.004);

  // 17-20. Centrality (relatively static)
  row.push(0.5 + noise());
  row.push(0.4 + noise());
  row.push(0.3 + noise());
  row.push(0.6 + noise());
  
  // 21. Current Pod Count (Target)
  row.push(currentPods);
  
  return row;
};

export const getInitialHistory = (lookback = 48) => {
  const history = [];
  for (let i = 0; i < lookback; i++) {
     history.push(generateRandomFeatureRow(12, i)); 
  }
  return history;
};

export const getPodCountData = () => {
  const labels = generateTimeLabels(20);
  return labels.map((time, index) => {
    // Real simulation zone: pods 2–12, wave-shaped
    const actual = Math.max(2, Math.round(2 + Math.sin(index * 0.4) * 3 + Math.random()));
    const predicted = Math.max(2, Math.round(actual + (Math.random() - 0.5) * 1.5));
    return { time, actual, predicted };
  });
};

export const getResourceMetricsData = () => {
  const labels = generateTimeLabels(15);
  return labels.map((time) => ({
    time,
    cpu: parseFloat((20 + Math.random() * 20).toFixed(1)),      // 20–40 % (real avg: ~28 %)
    memory: parseFloat((490 + Math.random() * 120).toFixed(0)), // 490–610 MB (real avg: ~555 MB)
    network: parseFloat((50 + Math.random() * 150).toFixed(0)), // mesh inbound RPS
  }));
};

export const getPerformanceMetricsData = () => {
  const labels = generateTimeLabels(15);
  return labels.map((time) => ({
    time,
    latency: parseFloat((60 + Math.random() * 50).toFixed(1)),   // p95 ms (real: 55–130 ms)
    errorRate: parseFloat((0.03 + Math.random() * 0.01).toFixed(4)), // ~3 % baseline
    requests: parseFloat((50 + Math.random() * 150).toFixed(0)), // RPS (real: 40–250)
  }));
};

export const getProvisioningEfficiencyData = () => [
  { name: "Under-provisioned", value: 15, color: "#ef4444" }, // Red
  { name: "Exact Match", value: 70, color: "#22c55e" },       // Green
  { name: "Over-provisioned", value: 15, color: "#eab308" },  // Yellow
];

// Single point generators for live updates
export const getNewPodPoint = (lastTime) => {
  const time = new Date(Date.now()).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const actual = Math.max(2, Math.round(2 + Math.random() * 5));
  const predicted = Math.max(2, Math.round(actual + (Math.random() - 0.5) * 1.5));
  return { time, actual, predicted };
};

export const getNewResourcePoint = () => {
  const time = new Date(Date.now()).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return {
      time,
      cpu: parseFloat((20 + Math.random() * 20).toFixed(1)),
      memory: parseFloat((490 + Math.random() * 120).toFixed(0)),
      network: parseFloat((50 + Math.random() * 150).toFixed(0)),
  };
};

export const getNewPerformancePoint = () => {
  const time = new Date(Date.now()).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return {
      time,
      latency: parseFloat((60 + Math.random() * 50).toFixed(1)),
      errorRate: parseFloat((0.03 + Math.random() * 0.01).toFixed(4)),
      requests: parseFloat((50 + Math.random() * 150).toFixed(0)),
  };
};
