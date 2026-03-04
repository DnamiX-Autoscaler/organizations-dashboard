import { useState, useEffect } from "react";
import { getChaosStream } from "../api/config/autoscaling/api";

export const useChaosSSE = (initialResults = []) => {
    const [chaosResults, setChaosResults] = useState(initialResults);

    useEffect(() => {
        const onMessage = (data) => {
            setChaosResults((prev) => {
                // Handle both historical array and single new result
                if (Array.isArray(data)) {
                    const newItems = data.filter(item =>
                        !prev.some(p => (p.experimentId && p.experimentId === item.experimentId) || (p._id && p._id === item._id))
                    );
                    return [...newItems, ...prev].slice(0, 50);
                } else {
                    const exists = prev.some(p => (p.experimentId && p.experimentId === data.experimentId) || (p._id && p._id === data._id));
                    if (exists) return prev;
                    return [data, ...prev].slice(0, 50);
                }
            });
        };

        const onError = (err) => {
            console.error("SSE Chaos Stream Error:", err);
        };

        const eventSource = getChaosStream(onMessage, onError);

        return () => {
            eventSource.close();
        };
    }, []);

    return chaosResults;
};
