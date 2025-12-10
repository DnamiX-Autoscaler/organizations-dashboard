const getResourceConfig = (currentCluster) => ({
  cpu: {
    title: "CPU",
    subtitle: "% Utilization",
    color: "#0EA5E9",
    data: currentCluster.cpu.history,
    metrics: [
      { label: "Utilization", value: `${currentCluster.cpu.utilization}%` },
      { label: "Speed", value: `${currentCluster.cpu.speed} GHz` },
      { label: "Processes", value: currentCluster.systemInfo.processes },
      { label: "Threads", value: currentCluster.systemInfo.threads },
      { label: "Cores", value: currentCluster.cpu.cores },
      { label: "Logical processors", value: currentCluster.cpu.threads },
      {
        label: "Handles",
        value: currentCluster.systemInfo.handles.toLocaleString(),
      },
      { label: "Up time", value: currentCluster.systemInfo.uptime },
    ],
  },
  memory: {
    title: "Memory",
    subtitle: "GB In Use",
    color: "#10B981",
    data: currentCluster.memory.history,
    metrics: [
      {
        label: "In Use",
        value: `${currentCluster.memory.used} GB (${currentCluster.memory.percentage}%)`,
      },
      { label: "Available", value: `${currentCluster.memory.available} GB` },
      { label: "Total", value: `${currentCluster.memory.total} GB` },
      { label: "Cached", value: `${currentCluster.memory.cached} GB` },
      {
        label: "Committed",
        value: `${currentCluster.memory.used}/${currentCluster.memory.total} GB`,
      },
      { label: "Paged pool", value: "N/A" },
      { label: "Non-paged pool", value: "N/A" },
      { label: "Speed", value: "3200 MHz" },
    ],
  },
  disk: {
    title: "Disk (PVC)",
    subtitle: "% Active Time",
    color: "#8B5CF6",
    data: [],
    metrics: [
      { label: "Active Time", value: `${currentCluster.disk.activeTime}%` },
      { label: "Read Speed", value: `${currentCluster.disk.readSpeed} MB/s` },
      { label: "Write Speed", value: `${currentCluster.disk.writeSpeed} MB/s` },
      {
        label: "Total Capacity",
        value: `${currentCluster.disk.totalCapacity} GB`,
      },
      { label: "Used", value: `${currentCluster.disk.used} GB` },
      {
        label: "Available",
        value: `${
          currentCluster.disk.totalCapacity - currentCluster.disk.used
        } GB`,
      },
      { label: "Type", value: "Persistent Volume Claims" },
      { label: "Storage Class", value: "managed-premium" },
    ],
  },
  network: {
    title: "Network",
    subtitle: "Cluster Network Traffic",
    color: "#F59E0B",
    data: [],
    metrics: [
      { label: "Send", value: `${currentCluster.network.send} Kbps` },
      { label: "Receive", value: `${currentCluster.network.receive} Kbps` },
      {
        label: "Total Throughput",
        value: `${
          currentCluster.network.send + currentCluster.network.receive
        } Kbps`,
      },
      { label: "Connections", value: currentCluster.network.connections },
      { label: "Network Type", value: "Virtual Network" },
      { label: "Adapter", value: "Azure Virtual Network" },
      { label: "Link Speed", value: "10 Gbps" },
      { label: "Status", value: "Connected" },
    ],
  },
});

export default getResourceConfig;
