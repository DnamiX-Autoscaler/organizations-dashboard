// Mock Prometheus API responses for different queries
export const mockPrometheusData = {
    "prometheus_http_requests_total": {
        status: "success",
        data: {
            resultType: "matrix",
            result: [
                {
                    metric: {
                        __name__: "prometheus_http_requests_total",
                        code: "200",
                        handler: "/api/v1/query",
                        instance: "localhost:9090",
                        job: "prometheus"
                    },
                    values: [
                        [1704067200, "1234"],
                        [1704067260, "1245"],
                        [1704067320, "1256"],
                        [1704067380, "1270"],
                        [1704067440, "1289"],
                        [1704067500, "1305"],
                        [1704067560, "1320"],
                        [1704067620, "1338"],
                    ]
                },
                {
                    metric: {
                        __name__: "prometheus_http_requests_total",
                        code: "400",
                        handler: "/api/v1/query",
                        instance: "localhost:9090",
                        job: "prometheus"
                    },
                    values: [
                        [1704067200, "23"],
                        [1704067260, "25"],
                        [1704067320, "24"],
                        [1704067380, "26"],
                        [1704067440, "28"],
                        [1704067500, "27"],
                        [1704067560, "29"],
                        [1704067620, "31"],
                    ]
                }
            ]
        }
    },
    "up": {
        status: "success",
        data: {
            resultType: "matrix",
            result: [
                {
                    metric: {
                        __name__: "up",
                        instance: "localhost:9090",
                        job: "prometheus"
                    },
                    values: [
                        [1704067200, "1"],
                        [1704067260, "1"],
                        [1704067320, "1"],
                        [1704067380, "1"],
                        [1704067440, "0"],
                        [1704067500, "1"],
                        [1704067560, "1"],
                        [1704067620, "1"],
                    ]
                },
                {
                    metric: {
                        __name__: "up",
                        instance: "localhost:8080",
                        job: "node-exporter"
                    },
                    values: [
                        [1704067200, "1"],
                        [1704067260, "1"],
                        [1704067320, "1"],
                        [1704067380, "1"],
                        [1704067440, "1"],
                        [1704067500, "1"],
                        [1704067560, "1"],
                        [1704067620, "1"],
                    ]
                }
            ]
        }
    },
    "node_cpu_seconds_total": {
        status: "success",
        data: {
            resultType: "matrix",
            result: [
                {
                    metric: {
                        __name__: "node_cpu_seconds_total",
                        cpu: "0",
                        mode: "idle",
                        instance: "localhost:9100",
                        job: "node"
                    },
                    values: [
                        [1704067200, "45678"],
                        [1704067260, "45698"],
                        [1704067320, "45720"],
                        [1704067380, "45745"],
                        [1704067440, "45768"],
                        [1704067500, "45790"],
                        [1704067560, "45815"],
                        [1704067620, "45840"],
                    ]
                },
                {
                    metric: {
                        __name__: "node_cpu_seconds_total",
                        cpu: "0",
                        mode: "system",
                        instance: "localhost:9100",
                        job: "node"
                    },
                    values: [
                        [1704067200, "8956"],
                        [1704067260, "8978"],
                        [1704067320, "8995"],
                        [1704067380, "9015"],
                        [1704067440, "9035"],
                        [1704067500, "9058"],
                        [1704067560, "9078"],
                        [1704067620, "9100"],
                    ]
                }
            ]
        }
    },
    "process_cpu_seconds_total": {
        status: "success",
        data: {
            resultType: "matrix",
            result: [
                {
                    metric: {
                        __name__: "process_cpu_seconds_total",
                        instance: "localhost:9090",
                        job: "prometheus"
                    },
                    values: [
                        [1704067200, "123.45"],
                        [1704067260, "125.67"],
                        [1704067320, "128.12"],
                        [1704067380, "130.89"],
                        [1704067440, "133.45"],
                        [1704067500, "136.23"],
                        [1704067560, "139.01"],
                        [1704067620, "141.78"],
                    ]
                }
            ]
        }
    },
    "http_requests_total": {
        status: "success",
        data: {
            resultType: "matrix",
            result: [
                {
                    metric: {
                        __name__: "http_requests_total",
                        method: "GET",
                        status: "200",
                        endpoint: "/api/users"
                    },
                    values: [
                        [1704067200, "5678"],
                        [1704067260, "5723"],
                        [1704067320, "5789"],
                        [1704067380, "5856"],
                        [1704067440, "5920"],
                        [1704067500, "5998"],
                        [1704067560, "6078"],
                        [1704067620, "6145"],
                    ]
                },
                {
                    metric: {
                        __name__: "http_requests_total",
                        method: "POST",
                        status: "201",
                        endpoint: "/api/users"
                    },
                    values: [
                        [1704067200, "234"],
                        [1704067260, "245"],
                        [1704067320, "256"],
                        [1704067380, "268"],
                        [1704067440, "279"],
                        [1704067500, "291"],
                        [1704067560, "305"],
                        [1704067620, "318"],
                    ]
                }
            ]
        }
    }
};

// Function to simulate Prometheus query execution
export const executePrometheusQuery = (query) => {
    // Simulate API delay
    return new Promise((resolve) => {
        setTimeout(() => {
            // Find matching mock data
            const matchingKey = Object.keys(mockPrometheusData).find(key =>
                query.toLowerCase().includes(key.toLowerCase())
            );

            if (matchingKey) {
                resolve(mockPrometheusData[matchingKey]);
            } else {
                // Return empty result for unknown queries
                resolve({
                    status: "success",
                    data: {
                        resultType: "matrix",
                        result: []
                    }
                });
            }
        }, 500); // 500ms delay to simulate network request
    });
};

// Format timestamp for display
export const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

// Transform Prometheus data for graph visualization
export const transformPrometheusDataForGraph = (prometheusResponse) => {
    if (!prometheusResponse?.data?.result || prometheusResponse.data.result.length === 0) {
        return [];
    }

    const timeSeriesMap = new Map();

    prometheusResponse.data.result.forEach((timeSeries) => {
        const metricLabel = formatMetricLabel(timeSeries.metric);

        timeSeries.values.forEach(([timestamp, value]) => {
            const timeKey = formatTimestamp(timestamp);

            if (!timeSeriesMap.has(timeKey)) {
                timeSeriesMap.set(timeKey, { time: timeKey, timeStamp: timestamp * 1000 });
            }

            timeSeriesMap.get(timeKey)[metricLabel] = parseFloat(value);
        });
    });

    return Array.from(timeSeriesMap.values());
};

// Format metric label from metric object
export const formatMetricLabel = (metric) => {
    const labels = Object.entries(metric)
        .filter(([key]) => key !== '__name__')
        .map(([key, value]) => `${key}="${value}"`)
        .join(', ');

    return labels ? `{${labels}}` : metric.__name__ || 'value';
};

// Get all metric keys from transformed data
export const getMetricKeys = (transformedData) => {
    if (!transformedData || transformedData.length === 0) return [];

    return Object.keys(transformedData[0]).filter(key =>
        key !== 'time' && key !== 'timeStamp'
    );
};
