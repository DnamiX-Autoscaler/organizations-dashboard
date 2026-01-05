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

  // 1. request_rate_rps (correlated with daily wave)
  // Low: 500, High: 1500
  row.push(500 + baseWave * 1000 + noise() * 100); 

  // 2-3. latency (slightly correlated with load)
  row.push(20 + baseWave * 30 + noise() * 5); // p95
  row.push(30 + baseWave * 50 + noise() * 10); // p99

  // 4. error rate (spikes randomly but low base)
  row.push(Math.max(0, Math.random() > 0.9 ? Math.random() * 5 : 0.1));

  // 5. queue length
  row.push(Math.floor(baseWave * 50 + Math.random() * 10));

  // 6-9. CPU/Mem (correlated with load)
  row.push(30 + baseWave * 40 + noise() * 5); // CPU Avg
  row.push(40 + baseWave * 50 + noise() * 5); // CPU P95
  row.push(200 + baseWave * 300 + noise() * 50); // Mem Avg
  row.push(300 + baseWave * 400 + noise() * 50); // Mem P95

  // 10-13. Time encoding (mocking strictly for shape)
  row.push(Math.sin(step * 0.05));
  row.push(Math.cos(step * 0.05));
  row.push(Math.sin(step * 0.01));
  row.push(Math.cos(step * 0.01));

  // 14-16. Mesh stats
  row.push(100 + baseWave * 500);
  row.push(10 + Math.random() * 5);
  row.push(0);

  // 17-20. Centrality (relatively static)
  row.push(0.5 + noise());
  row.push(0.4 + noise());
  row.push(0.3 + noise());
  row.push(0.6 + noise());
  
  // 21. Current Pod Count (Target) - scaled roughly by load
  // Simple heuristic: 1 pod per 100 RPS approx
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
    const actual = Math.floor(10 + Math.sin(index * 0.5) * 5 + Math.random() * 2);
    const predicted = Math.floor(actual + (Math.random() - 0.5) * 2); // Slight deviation
    return {
      time,
      actual,
      predicted,
    };
  });
};

export const getResourceMetricsData = () => {
  const labels = generateTimeLabels(15);
  return labels.map((time) => ({
    time,
    cpu: Math.floor(40 + Math.random() * 30), // 40-70%
    memory: Math.floor(50 + Math.random() * 20), // 50-70%
    network: Math.floor(100 + Math.random() * 100), // Mbps
  }));
};

export const getPerformanceMetricsData = () => {
  const labels = generateTimeLabels(15);
  return labels.map((time) => ({
    time,
    latency: Math.floor(50 + Math.random() * 20), // ms
    errorRate: parseFloat((Math.random() * 2).toFixed(2)), // %
    requests: Math.floor(1000 + Math.random() * 500), // RPS
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
  const actual = Math.floor(10 + Math.random() * 5);
  const predicted = Math.floor(actual + (Math.random() - 0.5) * 2);
  return { time, actual, predicted };
};

export const getNewResourcePoint = () => {
  const time = new Date(Date.now()).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return {
      time,
      cpu: Math.floor(40 + Math.random() * 30),
      memory: Math.floor(50 + Math.random() * 20),
      network: Math.floor(100 + Math.random() * 100),
  };
};

export const getNewPerformancePoint = () => {
  const time = new Date(Date.now()).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return {
      time,
      latency: Math.floor(50 + Math.random() * 20),
      errorRate: parseFloat((Math.random() * 2).toFixed(2)),
      requests: Math.floor(1000 + Math.random() * 500),
  };
};
