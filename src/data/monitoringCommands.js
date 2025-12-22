export const monitoringCommandCategories = [
    {
        id: "setup",
        title: "Setup",
        icon: "mdi:cog",
        color: "blue",
        commands: [
            {
                id: "setup-1",
                title: "Check Python Version",
                command: "python --version",
                description: "Verify Python installation",
                category: "setup",
            },
            {
                id: "setup-2",
                title: "Create Virtual Environment",
                command: "python -m venv venv",
                description: "Create isolated Python environment",
                category: "setup",
            },
            {
                id: "setup-3",
                title: "Activate Virtual Environment (Windows)",
                command: "venv\\Scripts\\activate",
                description: "Activate virtual environment on Windows",
                category: "setup",
            },
            {
                id: "setup-4",
                title: "Activate Virtual Environment (Linux/Mac)",
                command: "source venv/bin/activate",
                description: "Activate virtual environment on Linux/Mac",
                category: "setup",
            },
            {
                id: "setup-5",
                title: "Install Required Libraries",
                command: "pip install requests networkx boto3 pytest matplotlib",
                description: "Install basic required libraries",
                category: "setup",
            },
        ],
    },
    {
        id: "troubleshooting",
        title: "Troubleshooting",
        icon: "mdi:wrench",
        color: "orange",
        commands: [
            {
                id: "trouble-1",
                title: "Upgrade Pip",
                command: "python -m pip install --upgrade pip",
                description: "Update pip to latest version",
                category: "troubleshooting",
            },
            {
                id: "trouble-2",
                title: "Install All Required Libraries",
                command:
                    "pip install requests networkx boto3 pytest matplotlib python-dateutil",
                description: "Complete installation of all dependencies",
                category: "troubleshooting",
            },
            {
                id: "trouble-3",
                title: "Confirm Installation",
                command: "pip list",
                description: "List all installed packages",
                category: "troubleshooting",
            },
            {
                id: "trouble-4",
                title: "Show Outdated Packages",
                command: "pip list --outdated",
                description: "Check for package updates",
                category: "troubleshooting",
            },
        ],
    },
    {
        id: "run",
        title: "Run Commands",
        icon: "mdi:play",
        color: "green",
        commands: [
            {
                id: "run-1",
                title: "Run Main Pipeline",
                command: "python main.py",
                description: "Execute the main pipeline",
                category: "run",
            },
            {
                id: "run-2",
                title: "Run Node CPU Collector",
                command: "python collectors/node/node_cpu_collector.py",
                description: "Execute specific collector",
                category: "run",
            },
            {
                id: "run-3",
                title: "Run with Debug Mode",
                command: "python main.py --debug",
                description: "Run with verbose logging",
                category: "run",
            },
        ],
    },
    {
        id: "prometheus",
        title: "Prometheus",
        icon: "simple-icons:prometheus",
        color: "orange",
        commands: [
            {
                id: "prom-1",
                title: "Port Forward Prometheus",
                command:
                    "kubectl -n monitoring port-forward svc/prometheus-kube-prometheus-prometheus 9090:9090",
                description: "Access Prometheus UI locally",
                category: "prometheus",
            },
            {
                id: "prom-2",
                title: "Port Forward Grafana",
                command: "kubectl -n monitoring port-forward svc/prometheus-grafana 3000:80",
                description: "Access Grafana UI locally",
                category: "prometheus",
            },
            {
                id: "prom-3",
                title: "Port Forward Alertmanager",
                command:
                    "kubectl -n monitoring port-forward svc/prometheus-kube-prometheus-alertmanager 9093:9093",
                description: "Access Alertmanager UI locally",
                category: "prometheus",
            },
        ],
    },
    {
        id: "kubernetes",
        title: "Kubernetes",
        icon: "mdi:kubernetes",
        color: "blue",
        commands: [
            {
                id: "k8s-1",
                title: "Get All Pods",
                command: "kubectl get pods -o wide",
                description: "List all pods with detailed info",
                category: "kubernetes",
            },
            {
                id: "k8s-2",
                title: "Get Services (Default Namespace)",
                command: "kubectl get svc -n default",
                description: "List services in default namespace",
                category: "kubernetes",
            },
            {
                id: "k8s-3",
                title: "Get Services (Monitoring Namespace)",
                command: "kubectl get svc -n monitoring",
                description: "List services in monitoring namespace",
                category: "kubernetes",
            },
            {
                id: "k8s-4",
                title: "Apply YAML Configuration",
                command: "kubectl apply -f src/store-admin/service.yaml",
                description: "Deploy service from YAML file",
                category: "kubernetes",
            },
            {
                id: "k8s-5",
                title: "Restart Deployment",
                command: "kubectl rollout restart deploy store-front",
                description: "Restart a deployment",
                category: "kubernetes",
            },
            {
                id: "k8s-6",
                title: "Delete Deployment",
                command: "kubectl delete -f mesh-metrics-test.yaml",
                description: "Remove deployment from cluster",
                category: "kubernetes",
            },
            {
                id: "k8s-7",
                title: "Get Pod Logs",
                command: "kubectl logs <pod-name> -n <namespace>",
                description: "View logs from a specific pod",
                category: "kubernetes",
            },
            {
                id: "k8s-8",
                title: "Describe Pod",
                command: "kubectl describe pod <pod-name>",
                description: "Get detailed pod information",
                category: "kubernetes",
            },
            {
                id: "k8s-9",
                title: "Get All Namespaces",
                command: "kubectl get namespaces",
                description: "List all namespaces in cluster",
                category: "kubernetes",
            },
        ],
    },
    {
        id: "context",
        title: "Kubectl Context",
        icon: "mdi:swap-horizontal",
        color: "purple",
        commands: [
            {
                id: "ctx-1",
                title: "Switch to Local Context",
                command: "kubectl config use-context docker-desktop",
                description: "Switch to local Docker Desktop cluster",
                category: "context",
            },
            {
                id: "ctx-2",
                title: "Switch to Production Context",
                command: "kubectl config use-context sr-research-aks",
                description: "Switch to production AKS cluster",
                category: "context",
            },
            {
                id: "ctx-3",
                title: "Verify Current Context",
                command: "kubectl config current-context",
                description: "Check active Kubernetes context",
                category: "context",
            },
            {
                id: "ctx-4",
                title: "List All Contexts",
                command: "kubectl config get-contexts",
                description: "View all available contexts",
                category: "context",
            },
        ],
    },
    {
        id: "api",
        title: "API Server",
        icon: "mdi:api",
        color: "green",
        commands: [
            {
                id: "api-1",
                title: "Run Uvicorn Server",
                command: "python -m uvicorn api.server:app --reload",
                description: "Start API server with auto-reload",
                category: "api",
            },
            {
                id: "api-2",
                title: "Run Uvicorn with Host/Port",
                command:
                    "python -m uvicorn api.server:app --host 0.0.0.0 --port 8000 --reload",
                description: "Start API server on specific host and port",
                category: "api",
            },
            {
                id: "api-3",
                title: "Access Live Metrics Endpoint",
                command: "curl http://localhost:8000/metrics/live",
                description: "Test metrics endpoint",
                category: "api",
            },
            {
                id: "api-4",
                title: "Access Live Stream Endpoint",
                command: "curl http://localhost:8000/metrics/live-stream",
                description: "Test streaming metrics endpoint",
                category: "api",
            },
        ],
    },
    {
        id: "testing",
        title: "Testing",
        icon: "mdi:test-tube",
        color: "red",
        commands: [
            {
                id: "test-1",
                title: "Run All Tests",
                command: "pytest -q",
                description: "Execute all test cases quietly",
                category: "testing",
            },
            {
                id: "test-2",
                title: "Run Tests with Coverage",
                command: "pytest --cov=. --cov-report=html",
                description: "Run tests and generate coverage report",
                category: "testing",
            },
            {
                id: "test-3",
                title: "Run with Queue Test Mode",
                command: '$env:QUEUE_TEST_MODE="1"; python main.py',
                description: "Enable queue testing mode (Windows)",
                category: "testing",
            },
            {
                id: "test-4",
                title: "Run with Error Test Mode",
                command: '$env:ERROR_TEST_MODE="1"; $env:QUEUE_TEST_MODE="1"; python main.py',
                description: "Enable error and queue testing (Windows)",
                category: "testing",
            },
            {
                id: "test-5",
                title: "Run with Custom Window Size",
                command: '$env:WINDOW_SIZE_SECONDS="60"; python main.py',
                description: "Set custom metrics window size (Windows)",
                category: "testing",
            },
            {
                id: "test-6",
                title: "Run Specific Test File",
                command: "pytest tests/test_collectors.py -v",
                description: "Run a specific test file with verbose output",
                category: "testing",
            },
        ],
    },
    {
        id: "verification",
        title: "Dataset Verification",
        icon: "mdi:database-check",
        color: "indigo",
        commands: [
            {
                id: "verify-1",
                title: "View CSV Dataset",
                command: "cat output/dataset/metrics_dataset.csv",
                description: "Display CSV metrics dataset",
                category: "verification",
            },
            {
                id: "verify-2",
                title: "View JSONL Dataset",
                command: "cat output/dataset/metrics_dataset.jsonl",
                description: "Display JSON lines dataset",
                category: "verification",
            },
            {
                id: "verify-3",
                title: "List Raw Prometheus Dumps",
                command: "ls -la output/raw/",
                description: "View raw Prometheus data files",
                category: "verification",
            },
            {
                id: "verify-4",
                title: "Count CSV Rows",
                command: "wc -l output/dataset/metrics_dataset.csv",
                description: "Count number of records in CSV",
                category: "verification",
            },
        ],
    },
    {
        id: "traffic",
        title: "Traffic Generation",
        icon: "mdi:traffic-light",
        color: "yellow",
        commands: [
            {
                id: "traffic-1",
                title: "Get Traffic Generator Pods",
                command: "kubectl get pods -n default | findstr mesh-traffic-generator",
                description: "Find traffic generator pods (Windows)",
                category: "traffic",
            },
            {
                id: "traffic-2",
                title: "Get Traffic Generator Pods (Linux)",
                command: "kubectl get pods -n default | grep mesh-traffic-generator",
                description: "Find traffic generator pods (Linux/Mac)",
                category: "traffic",
            },
            {
                id: "traffic-3",
                title: "Deploy Traffic Generator",
                command: "kubectl apply -f tests/istio/mesh-traffic-generator.yaml",
                description: "Deploy mesh traffic generator",
                category: "traffic",
            },
            {
                id: "traffic-4",
                title: "Delete Traffic Generator",
                command: "kubectl delete -f tests/istio/mesh-traffic-generator.yaml",
                description: "Remove traffic generator deployment",
                category: "traffic",
            },
        ],
    },
];

// Get commands by category
export const getCommandsByCategory = (categoryId) => {
    const category = monitoringCommandCategories.find((c) => c.id === categoryId);
    return category ? category.commands : [];
};

// Get all commands
export const getAllCommands = () => {
    return monitoringCommandCategories.flatMap((category) => category.commands);
};

// Search commands
export const searchCommands = (searchTerm) => {
    const term = searchTerm.toLowerCase();
    return getAllCommands().filter(
        (cmd) =>
            cmd.title.toLowerCase().includes(term) ||
            cmd.command.toLowerCase().includes(term) ||
            cmd.description.toLowerCase().includes(term)
    );
};

// User-added custom commands storage key
export const CUSTOM_COMMANDS_KEY = "monitoring_custom_commands";

// Get custom commands from localStorage
export const getCustomCommands = () => {
    try {
        const stored = localStorage.getItem(CUSTOM_COMMANDS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

// Save custom command
export const saveCustomCommand = (command) => {
    const customs = getCustomCommands();
    const newCommand = {
        ...command,
        id: `custom-${Date.now()}`,
        category: "custom",
        isCustom: true,
    };
    customs.push(newCommand);
    localStorage.setItem(CUSTOM_COMMANDS_KEY, JSON.stringify(customs));
    return newCommand;
};

// Delete custom command
export const deleteCustomCommand = (commandId) => {
    const customs = getCustomCommands();
    const filtered = customs.filter((cmd) => cmd.id !== commandId);
    localStorage.setItem(CUSTOM_COMMANDS_KEY, JSON.stringify(filtered));
};
