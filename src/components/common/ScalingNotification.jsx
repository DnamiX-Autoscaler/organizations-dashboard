import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { getSocket } from "../../api/socket";

const ScalingNotification = () => {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return undefined;

        const addAlert = (data, isSystem = false) => {
            const id = Date.now() + Math.random();
            let newAlert;

            if (isSystem) {
                newAlert = {
                    id,
                    type: data.type || "info",
                    title: data.title || "System Alert",
                    message: data.message,
                    icon: data.type === "error" ? "mdi:alert-decagram" : (data.type === "success" ? "mdi:check-circle" : "mdi:information-outline"),
                    deployment: "System Notification"
                };
            } else {
                const isRollback = data.status === "ROLLED_BACK";
                const isScaleUp = data.rule === "Scale Up Triggered" || (data.required_replicas > data.previous_replicas);

                newAlert = {
                    id,
                    type: isRollback ? "error" : (isScaleUp ? "success" : "warning"),
                    title: isRollback ? "Scaling Rolled Back" : (isScaleUp ? "Scaling Up" : "Scaling Down"),
                    message: data.message || `Replicas: ${data.previous_replicas} -> ${data.required_replicas}`,
                    icon: isRollback ? "mdi:alert-octagon" : (isScaleUp ? "mdi:trending-up" : "mdi:trending-down"),
                    deployment: data.deployment
                };
            }

            setAlerts(prev => [newAlert, ...prev].slice(0, 5)); // Keep last 5

            setTimeout(() => {
                setAlerts(prev => prev.filter(a => a.id !== id));
            }, 8000);
        };

        const handleScalingEvent = (data) => addAlert(data, false);
        const handleSystemAlert = (data) => addAlert(data, true);

        socket.on("scaling:scaled", handleScalingEvent);
        socket.on("scaling:rolled_back", handleScalingEvent);
        socket.on("system:alert", handleSystemAlert);

        return () => {
            socket.off("scaling:scaled", handleScalingEvent);
            socket.off("scaling:rolled_back", handleScalingEvent);
            socket.off("system:alert", handleSystemAlert);
        };
    }, []);

    const removeAlert = (id) => {
        setAlerts(prev => prev.filter(a => a.id !== id));
    };

    if (alerts.length === 0) return null;

    const getStyles = (type) => {
        switch (type) {
            case "error":
                return "bg-red-50/95 border-red-200 text-red-800 dark:bg-red-900/40 dark:border-red-800 dark:text-red-200";
            case "success":
                return "bg-green-50/95 border-green-200 text-green-800 dark:bg-green-900/40 dark:border-green-800 dark:text-green-200";
            case "warning":
                return "bg-amber-50/95 border-amber-200 text-amber-800 dark:bg-amber-900/40 dark:border-amber-800 dark:text-amber-200";
            case "info":
                return "bg-blue-50/95 border-blue-200 text-blue-800 dark:bg-blue-900/40 dark:border-blue-800 dark:text-blue-200";
            default:
                return "bg-gray-50/95 border-gray-200 text-gray-800 dark:bg-gray-800/40 dark:border-gray-700 dark:text-gray-200";
        }
    };

    const getIconColor = (type) => {
        switch (type) {
            case "error": return "text-red-500";
            case "success": return "text-green-500";
            case "warning": return "text-amber-500";
            case "info": return "text-blue-500";
            default: return "text-gray-500";
        }
    };

    return (
        <div className="fixed top-20 right-6 z-[300] flex flex-col gap-3 pointer-events-none max-w-md w-full sm:w-[380px]">
            {alerts.map((item) => (
                <div
                    key={item.id}
                    className={`flex items-start gap-4 p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-500 transform translate-x-0 opacity-100 pointer-events-auto animate-in slide-in-from-right-5 ${getStyles(item.type)}`}
                >
                    <div className={`p-2 rounded-xl bg-white/50 dark:bg-black/30 mt-0.5 shadow-sm`}>
                        <Icon icon={item.icon} className={`w-6 h-6 ${getIconColor(item.type)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-bold uppercase tracking-wider truncate">{item.title}</h4>
                            <span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[10px] font-mono shrink-0">LIVE</span>
                        </div>
                        <p className="text-xs font-semibold mb-1 opacity-90 truncate">{item.deployment}</p>
                        <p className="text-[11px] opacity-80 leading-relaxed italic line-clamp-2">"{item.message}"</p>
                    </div>
                    <button
                        onClick={() => removeAlert(item.id)}
                        className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors self-start shrink-0"
                    >
                        <Icon icon="mdi:close" className="w-4 h-4 opacity-70" />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ScalingNotification;
