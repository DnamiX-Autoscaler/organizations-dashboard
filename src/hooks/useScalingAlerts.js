import { useState, useEffect } from "react";
import { getSocket } from "../api/socket";

export const useScalingAlerts = (initialAlerts = []) => {
    const [alerts, setAlerts] = useState(initialAlerts);

    useEffect(() => {
        const socket = getSocket();

        const handleNewAlert = (data) => {
            const newAlert = {
                id: `REALTIME-${Date.now()}`,
                project: "Custom Scaling", // Or map from data if available
                service: data.deployment,
                severity: data.severity || "info",
                status: "open",
                rule: data.rule || "Auto-scaling Event",
                metric: "Scaling",
                currentValue: data.required_replicas,
                threshold: data.previous_replicas,
                triggeredAt: data.timestamp || new Date().toISOString(),
                lastSeen: data.timestamp || new Date().toISOString(),
                source: "Autoscaler",
                environment: "prod",
                node: "dynamic",
                action: data.status,
                description: data.message || `Scaling activity for ${data.deployment}`
            };

            setAlerts((prev) => [newAlert, ...prev]);
        };

        socket.on("scaling:scaled", handleNewAlert);
        socket.on("scaling:rolled_back", handleNewAlert);

        return () => {
            socket.off("scaling:scaled", handleNewAlert);
            socket.off("scaling:rolled_back", handleNewAlert);
        };
    }, []);

    return alerts;
};
