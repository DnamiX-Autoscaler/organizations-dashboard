import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

const LiveAlertSimulation = () => {
    const [alert, setAlert] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    const sampleAlerts = [
        {
            type: "error",
            title: "Connection Failed",
            message: "Failed to connect to order-service database.",
            icon: "mdi:alert-circle"
        },
        {
            type: "success",
            title: "Scaling Complete",
            message: "Successfully scaled up payment-service to 5 replicas.",
            icon: "mdi:check-circle"
        },
        {
            type: "warning",
            title: "High Latency Warning",
            message: "P95 latency exceeding threshold for user-service.",
            icon: "mdi:alert"
        },
        {
            type: "error",
            title: "Pod CrashLoopBackOff",
            message: "Pod auth-service-x72 detected in CrashLoopBackOff state.",
            icon: "mdi:alert-octagon"
        },
        {
            type: "success",
            title: "Deployment Healthy",
            message: "New version of notification-service is healthy.",
            icon: "mdi:shield-check"
        },
        {
            type: "warning",
            title: "Memory Pressure",
            message: "Node-02 is experiencing high memory pressure (85%).",
            icon: "mdi:memory"
        }
    ];

    useEffect(() => {
        // Initial delay
        const initialTimer = setTimeout(() => {
            triggerAlert();
        }, 2000);

        const interval = setInterval(() => {
            triggerAlert();
        }, 10000); // Every 10 seconds

        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, []);

    const triggerAlert = () => {
        // Pick a random alert
        const randomAlert = sampleAlerts[Math.floor(Math.random() * sampleAlerts.length)];
        setAlert(randomAlert);
        setIsVisible(true);

        // Hide after 5 seconds
        setTimeout(() => {
            setIsVisible(false);
        }, 5000);
    };

    if (!alert) return null;

    const getStyles = (type) => {
        switch (type) {
            case "error":
                return "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200";
            case "success":
                return "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200";
            case "warning":
                return "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-200";
            default:
                return "bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200";
        }
    };

    const getIconColor = (type) => {
        switch (type) {
            case "error": return "text-red-500";
            case "success": return "text-green-500";
            case "warning": return "text-amber-500";
            default: return "text-gray-500";
        }
    };

    return (
        <div
            className={`fixed top-24 right-6 z-[200] transition-all duration-500 transform ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0 pointer-events-none"
                }`}
        >
            <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm min-w-[320px] max-w-sm ${getStyles(alert.type)}`}>
                <div className={`p-1.5 rounded-full bg-white/50 dark:bg-black/20 mt-0.5`}>
                    <Icon icon={alert.icon} className={`w-5 h-5 ${getIconColor(alert.type)}`} />
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-bold mb-1">{alert.title}</h4>
                    <p className="text-xs opacity-90 leading-relaxed">{alert.message}</p>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="p-1 hover:bg-black/10 rounded-full transition-colors"
                >
                    <Icon icon="mdi:close" className="w-4 h-4 opacity-70" />
                </button>
            </div>
        </div>
    );
};

export default LiveAlertSimulation;
