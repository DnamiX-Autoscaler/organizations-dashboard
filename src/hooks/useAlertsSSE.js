import { useState, useEffect } from "react";
import { getAlertsStream } from "../api/config/autoscaling/api";

export const useAlertsSSE = (initialAlerts = []) => {
    const [alerts, setAlerts] = useState(initialAlerts);

    useEffect(() => {
        const onMessage = (data) => {
            // Data is now pre-mapped by the backend for "real details"
            const mappedAlert = {
                ...data,
                id: data._id || data.id || `SSE-${Date.now()}-${Math.random()}`,
            };

            setAlerts((prev) => {
                // Avoid duplicates by ID
                const exists = prev.some(a => (a._id && a._id === mappedAlert._id) || (a.id === mappedAlert.id));
                if (exists) return prev;

                // Add new alert and keep unique ones, sorted by time
                return [mappedAlert, ...prev].sort((a, b) =>
                    new Date(b.triggeredAt) - new Date(a.triggeredAt)
                ).slice(0, 100);
            });
        };

        const onError = (err) => {
            console.error("SSE Alerts Stream Error:", err);
        };

        const eventSource = getAlertsStream(onMessage, onError);

        return () => {
            eventSource.close();
        };
    }, []);

    return alerts;
};
