const costData = {
    projects: [
        {
            id: "hotel-management",
            name: "Hotel Management System",
            totalMonthlyCost: 2450.75,
            totalResourceUnits: 1850,
            services: [
                {
                    serviceName: "Butler Service",
                    monthlyCost: 850.25,
                    resourceUnits: 650,
                    cpuCost: 320.50,
                    memoryCost: 280.75,
                    storageCost: 150.00,
                    networkCost: 99.00,
                    cpuUsage: 40,
                    memoryUsage: 55,
                    storageUsage: 35,
                    replicas: 3,
                    avgRequestsPerDay: 12500,
                    costPerRequest: 0.068,
                    trend: "stable",
                    efficiency: 72
                },
                {
                    serviceName: "Room Service",
                    monthlyCost: 1200.50,
                    resourceUnits: 900,
                    cpuCost: 480.20,
                    memoryCost: 420.30,
                    storageCost: 200.00,
                    networkCost: 100.00,
                    cpuUsage: 60,
                    memoryUsage: 65,
                    storageUsage: 45,
                    replicas: 5,
                    avgRequestsPerDay: 18000,
                    costPerRequest: 0.067,
                    trend: "increasing",
                    efficiency: 68
                },
                {
                    serviceName: "Reservation Service",
                    monthlyCost: 400.00,
                    resourceUnits: 300,
                    cpuCost: 150.00,
                    memoryCost: 130.00,
                    storageCost: 80.00,
                    networkCost: 40.00,
                    cpuUsage: 35,
                    memoryUsage: 42,
                    storageUsage: 28,
                    replicas: 2,
                    avgRequestsPerDay: 5000,
                    costPerRequest: 0.080,
                    trend: "stable",
                    efficiency: 78
                }
            ]
        },
        {
            id: "hospital-management",
            name: "Hospital Management System",
            totalMonthlyCost: 3200.40,
            totalResourceUnits: 2400,
            services: [
                {
                    serviceName: "Patient Service",
                    monthlyCost: 950.20,
                    resourceUnits: 720,
                    cpuCost: 350.10,
                    memoryCost: 320.10,
                    storageCost: 180.00,
                    networkCost: 100.00,
                    cpuUsage: 30,
                    memoryUsage: 45,
                    storageUsage: 40,
                    replicas: 4,
                    avgRequestsPerDay: 15000,
                    costPerRequest: 0.063,
                    trend: "stable",
                    efficiency: 82
                },
                {
                    serviceName: "Appointment Service",
                    monthlyCost: 1550.20,
                    resourceUnits: 1180,
                    cpuCost: 620.08,
                    memoryCost: 550.12,
                    storageCost: 250.00,
                    networkCost: 130.00,
                    cpuUsage: 75,
                    memoryUsage: 80,
                    storageUsage: 55,
                    replicas: 6,
                    avgRequestsPerDay: 22000,
                    costPerRequest: 0.070,
                    trend: "increasing",
                    efficiency: 65
                },
                {
                    serviceName: "Medical Records Service",
                    monthlyCost: 700.00,
                    resourceUnits: 500,
                    cpuCost: 280.00,
                    memoryCost: 240.00,
                    storageCost: 120.00,
                    networkCost: 60.00,
                    cpuUsage: 50,
                    memoryUsage: 58,
                    storageUsage: 62,
                    replicas: 3,
                    avgRequestsPerDay: 8000,
                    costPerRequest: 0.088,
                    trend: "stable",
                    efficiency: 75
                }
            ]
        },
        {
            id: "online-bookstore",
            name: "Online Bookstore",
            totalMonthlyCost: 4100.85,
            totalResourceUnits: 3100,
            services: [
                {
                    serviceName: "Product Service",
                    monthlyCost: 1800.50,
                    resourceUnits: 1350,
                    cpuCost: 720.20,
                    memoryCost: 650.30,
                    storageCost: 300.00,
                    networkCost: 130.00,
                    cpuUsage: 85,
                    memoryUsage: 70,
                    storageUsage: 65,
                    replicas: 8,
                    avgRequestsPerDay: 35000,
                    costPerRequest: 0.051,
                    trend: "increasing",
                    efficiency: 60
                },
                {
                    serviceName: "Order Service",
                    monthlyCost: 2100.35,
                    resourceUnits: 1580,
                    cpuCost: 840.14,
                    memoryCost: 760.21,
                    storageCost: 350.00,
                    networkCost: 150.00,
                    cpuUsage: 95,
                    memoryUsage: 92,
                    storageUsage: 70,
                    replicas: 10,
                    avgRequestsPerDay: 42000,
                    costPerRequest: 0.050,
                    trend: "critical",
                    efficiency: 55
                },
                {
                    serviceName: "User Service",
                    monthlyCost: 200.00,
                    resourceUnits: 170,
                    cpuCost: 80.00,
                    memoryCost: 70.00,
                    storageCost: 30.00,
                    networkCost: 20.00,
                    cpuUsage: 25,
                    memoryUsage: 30,
                    storageUsage: 20,
                    replicas: 2,
                    avgRequestsPerDay: 3000,
                    costPerRequest: 0.067,
                    trend: "stable",
                    efficiency: 85
                }
            ]
        }
    ],
    summary: {
        totalMonthlyCost: 9751.00,
        totalResourceUnits: 7350,
        avgCostPerRequest: 0.065,
        totalServices: 9,
        totalProjects: 3,
        highestCostService: "Order Service",
        lowestEfficiency: "Order Service",
        costTrend: "increasing"
    }
};

export default costData;
