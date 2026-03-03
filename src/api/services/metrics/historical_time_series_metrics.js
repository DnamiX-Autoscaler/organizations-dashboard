import ENDPOINTS from "../../config/endpoint";

const historicalTimeSeriesService = {
    /**
     * Connect to the monthly historical time-series live stream.
     * Handles large JSON responses by streaming and parsing incrementally.
     * Auto-refreshes every 30 seconds.
     *
     * @param {{ onMessage, onError, onOpen, signal }} options
     * @returns {Promise<void>}
     */
    async connectStream({ onMessage, onError, onOpen, signal } = {}) {
        const url = ENDPOINTS.TIMESERIES.STREAM;
        const REFRESH_INTERVAL = 30000; // 30 seconds

        const fetchData = async () => {
            try {
                const response = await fetch(url, { signal });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                if (onOpen) onOpen();

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = "";
                let bracketCount = 0;
                let inString = false;
                let escapeNext = false;
                let jsonStart = -1;

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });

                    // Process character by character to find complete JSON objects
                    for (let i = 0; i < chunk.length; i++) {
                        const char = chunk[i];
                        buffer += char;

                        if (escapeNext) {
                            escapeNext = false;
                            continue;
                        }

                        if (char === '\\' && inString) {
                            escapeNext = true;
                            continue;
                        }

                        if (char === '"' && !escapeNext) {
                            inString = !inString;
                            continue;
                        }

                        if (inString) continue;

                        if (char === '{') {
                            if (bracketCount === 0) {
                                jsonStart = buffer.length - 1;
                            }
                            bracketCount++;
                        } else if (char === '}') {
                            bracketCount--;

                            if (bracketCount === 0 && jsonStart !== -1) {
                                // Found complete JSON object
                                const jsonStr = buffer.substring(jsonStart);

                                // Clean up SSE "data:" prefix if present
                                const cleanJson = jsonStr.replace(/^[\s\n]*data:\s*/i, '').trim();

                                try {
                                    const parsed = JSON.parse(cleanJson);
                                    onMessage(parsed);
                                } catch (e) {
                                    console.warn("JSON parse error:", e.message);
                                }

                                // Reset for next JSON object
                                buffer = "";
                                jsonStart = -1;
                            }
                        }
                    }
                }

                // Try to parse any remaining buffer
                if (buffer.trim()) {
                    const cleanJson = buffer.replace(/^[\s\n]*data:\s*/i, '').trim();
                    // Find the JSON object in the buffer
                    const match = cleanJson.match(/\{[\s\S]*\}/);
                    if (match) {
                        try {
                            const parsed = JSON.parse(match[0]);
                            onMessage(parsed);
                        } catch (e) {
                            console.warn("Final buffer parse error:", e.message);
                        }
                    }
                }

            } catch (err) {
                if (err.name === "AbortError") return;
                console.error("Time-series fetch error:", err);
                if (onError) onError(err);
            }
        };

        // Initial fetch
        await fetchData();

        // Set up 30-second refresh interval
        const intervalId = setInterval(async () => {
            if (signal?.aborted) {
                clearInterval(intervalId);
                return;
            }
            console.log("[SSE] Refreshing data...");
            await fetchData();
        }, REFRESH_INTERVAL);

        // Clean up interval when aborted
        if (signal) {
            signal.addEventListener('abort', () => {
                clearInterval(intervalId);
            });
        }
    },
};

export default historicalTimeSeriesService;