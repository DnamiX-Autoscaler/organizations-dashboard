import { useState, useEffect } from "react";
import { getDeploymentHealthStream } from "../api/config/autoscaling/api";

export const useDeploymentHealthSSE = (initialData = [], page = 1, limit = 10) => {
    const [healthData, setHealthData] = useState(initialData);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setHealthData([]); // Clear data when page changes
        
        const onMessage = (data) => {
            if (!data) return;

            // Check if this is pagination info
            if (data.type === 'pagination_info') {
                setPagination(data);
                setLoading(false);
                return;
            }

            // Handle regular data
            setHealthData((prevData) => {
                // If data is an array, replace all data
                if (Array.isArray(data)) {
                    return data;
                }

                // Add each new record
                const exists = prevData.some((item) => item._id === data._id);
                
                if (!exists) {
                    return [...prevData, data];
                }
                
                return prevData;
            });
        };

        const onError = (err) => {
            console.error("SSE Deployment Health Stream Error:", err);
            setLoading(false);
        };

        const eventSource = getDeploymentHealthStream(onMessage, onError, { page, limit });

        return () => {
            eventSource.close();
        };
    }, [page, limit]);

    return { healthData, pagination, loading };
};
