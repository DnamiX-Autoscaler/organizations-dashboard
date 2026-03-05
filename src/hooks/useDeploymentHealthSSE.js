import { useState, useEffect } from "react";
import { getDeploymentHealthStream } from "../api/config/autoscaling/api";

export const useDeploymentHealthSSE = (initialData = null) => {
    const [healthData, setHealthData] = useState(initialData);

    useEffect(() => {
        const onMessage = (data) => {
            setHealthData(data);
        };

        const onError = (err) => {
            console.error("SSE Deployment Health Stream Error:", err);
        };

        const eventSource = getDeploymentHealthStream(onMessage, onError);

        return () => {
            eventSource.close();
        };
    }, []);

    return healthData;
};
