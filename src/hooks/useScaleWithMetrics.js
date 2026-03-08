import { useState, useEffect } from "react";
import { getScaleWithMetrics } from "../api/config/autoscaling/api";

export const useScaleWithMetrics = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const limit = 10;

    const fetchData = async (page) => {
        if (loading) return;
        
        setLoading(true);
        setError(null);

        try {
            const result = await getScaleWithMetrics({ page, limit });
            
            // Handle different response structures
            let newData = [];
            let total = 0;

            if (Array.isArray(result)) {
                // If response is directly an array
                newData = result;
                setHasMore(result.length === limit);
            } else if (result.data && Array.isArray(result.data)) {
                // If response has a data property
                newData = result.data;
                total = result.total || result.totalRecords || 0;
                setHasMore(page * limit < total || newData.length === limit);
            } else {
                newData = [];
                setHasMore(false);
            }

            // Append new data to existing data
            setData((prevData) => [...prevData, ...newData]);
            setCurrentPage(page);
        } catch (err) {
            console.error("Error fetching scale with metrics:", err);
            setError(err.message || "Failed to fetch data");
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchData(1);
    }, []);

    const loadMore = () => {
        if (hasMore && !loading) {
            fetchData(currentPage + 1);
        }
    };

    const refresh = () => {
        setData([]);
        setCurrentPage(0);
        setHasMore(true);
        setError(null);
        fetchData(1);
    };

    return {
        data,
        loading,
        error,
        hasMore,
        loadMore,
        refresh,
        currentPage
    };
};
