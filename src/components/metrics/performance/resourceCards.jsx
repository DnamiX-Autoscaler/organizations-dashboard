const getResourceCards = (currentCluster) => [
  {
    type: "cpu",
    title: "CPU",
    value: `${currentCluster.cpu.utilization}% ${currentCluster.cpu.speed} GHz`,
    graphData: currentCluster.cpu.history,
    graphColor: "#3B82F6",
    borderColor: "blue-500",
    bgColor: "blue-50",
    iconColor: "blue-500",
  },
  {
    type: "memory",
    title: "Memory",
    value: `${currentCluster.memory.used}/${currentCluster.memory.total} GB (${currentCluster.memory.percentage}%)`,
    graphData: currentCluster.memory.history,
    graphColor: "#10B981",
    borderColor: "green-500",
    bgColor: "green-50",
    iconColor: "green-500",
  },
  {
    type: "disk",
    title: "Disk (PVC)",
    value: `${currentCluster.disk.activeTime}%`,
    icon: "mdi:harddisk",
    borderColor: "purple-500",
    bgColor: "purple-50",
    iconColor: "purple-500",
  },
  {
    type: "network",
    title: "Network",
    value: `S: ${currentCluster.network.send} R: ${currentCluster.network.receive} Kbps`,
    icon: "mdi:wifi",
    borderColor: "orange-500",
    bgColor: "orange-50",
    iconColor: "orange-500",
  },
];

export default getResourceCards;
