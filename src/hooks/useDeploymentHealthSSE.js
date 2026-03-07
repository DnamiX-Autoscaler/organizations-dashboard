import { useState, useEffect } from "react";
import { getDeploymentHealthStream } from "../api/config/autoscaling/api";

export const useDeploymentHealthSSE = (initialData = []) => {
    const [healthData, setHealthData] = useState(initialData);

    useEffect(() => {
        const onMessage = (data) => {
            if (!data) return;

            setHealthData((prevData) => {
                // If data is an array, replace all data
                if (Array.isArray(data)) {
                    return data;
                }

                // Add each new record as a separate entry (don't update existing)
                // Check if this exact record already exists by _id
                const exists = prevData.some((item) => item._id === data._id);
                
                if (!exists) {
                    // Add new record at the beginning (most recent first)
                    return [data, ...prevData];
                }
                
                return prevData;
            });
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
