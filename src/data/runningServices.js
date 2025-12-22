// Mock data for running services (simulating kubectl get svc -n default output)
export const mockRunningServices = [
    {
        name: "front-end",
        type: "NodePort",
        clusterIP: "10.99.234.146",
        externalIP: "<none>",
        ports: "80:30080/TCP,15090:31913/TCP",
        age: "61d",
    },
    {
        name: "hello-k8s",
        type: "NodePort",
        clusterIP: "10.103.43.248",
        externalIP: "<none>",
        ports: "8080:32123/TCP",
        age: "61d",
    },
    {
        name: "kubernetes",
        type: "ClusterIP",
        clusterIP: "10.96.0.1",
        externalIP: "<none>",
        ports: "443/TCP",
        age: "244d",
    },
    {
        name: "makeline-service",
        type: "ClusterIP",
        clusterIP: "10.110.237.66",
        externalIP: "<none>",
        ports: "3001/TCP",
        age: "61d",
    },
    {
        name: "mongodb",
        type: "ClusterIP",
        clusterIP: "10.111.111.23",
        externalIP: "<none>",
        ports: "27017/TCP",
        age: "48d",
    },
    {
        name: "order-service",
        type: "ClusterIP",
        clusterIP: "10.100.0.144",
        externalIP: "<none>",
        ports: "3000/TCP,15090/TCP",
        age: "61d",
    },
    {
        name: "product-service",
        type: "ClusterIP",
        clusterIP: "10.111.127.103",
        externalIP: "<none>",
        ports: "3002/TCP,15090/TCP",
        age: "61d",
    },
    {
        name: "rabbitmq",
        type: "NodePort",
        clusterIP: "10.104.253.76",
        externalIP: "<none>",
        ports: "5672:30221/TCP,15672:31572/TCP",
        age: "61d",
    },
    {
        name: "store-admin",
        type: "LoadBalancer",
        clusterIP: "10.97.232.217",
        externalIP: "localhost",
        ports: "80:30081/TCP,15090:30500/TCP",
        age: "61d",
    },
    {
        name: "store-front",
        type: "LoadBalancer",
        clusterIP: "10.104.180.45",
        externalIP: "localhost",
        ports: "80:32325/TCP,15090:32563/TCP",
        age: "61d",
    },
];

// Function to get service type color
export const getServiceTypeColor = (type) => {
    const typeLower = type.toLowerCase();
    if (typeLower === "loadbalancer") return "blue";
    if (typeLower === "nodeport") return "purple";
    if (typeLower === "clusterip") return "green";
    if (typeLower === "externalname") return "orange";
    return "gray";
};

// Function to simulate fetching services
export const fetchRunningServices = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockRunningServices);
        }, 500);
    });
};

// Get service statistics
export const getServiceStatistics = (services) => {
    const loadBalancer = services.filter((s) => s.type === "LoadBalancer").length;
    const nodePort = services.filter((s) => s.type === "NodePort").length;
    const clusterIP = services.filter((s) => s.type === "ClusterIP").length;
    const total = services.length;

    return {
        total,
        loadBalancer,
        nodePort,
        clusterIP,
    };
};
