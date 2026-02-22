// Use nullish coalescing so an intentionally empty VITE_BASE_URL (for Vite proxy) is respected.
// Falls back to direct URL only when the variable is completely absent.
const BASE_URL = import.meta.env.VITE_BASE_URL ?? "http://localhost:8000";

const api = {
    baseUrl: BASE_URL,

    /**
     * Build a full URL from an endpoint path
     */
    url(endpoint) {
        return `${this.baseUrl}${endpoint}`;
    },

    /**
     * Connect to an SSE / streaming endpoint using fetch + ReadableStream.
     * Works with servers that send text/event-stream or chunked JSON.
     *
     * @param {string} endpoint - The endpoint path (e.g. "/process/live-stream")
     * @param {object} options
     * @param {function} options.onMessage  - Called with parsed JSON data per SSE event
     * @param {function} [options.onError]  - Called on error
     * @param {function} [options.onOpen]   - Called when the connection opens successfully
     * @param {AbortSignal} [options.signal] - AbortController signal to cancel the stream
     * @returns {Promise<void>}
     */
    async connectSSE(endpoint, { onMessage, onError, onOpen, signal } = {}) {
        const url = this.url(endpoint);

        try {
            const response = await fetch(url, { signal });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            if (onOpen) onOpen();

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                // Process SSE-formatted lines: "data: {...}\n\n"
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || trimmed.startsWith(":")) continue; // skip empty / comments

                    // Strip "data: " prefix if present (standard SSE format)
                    const payload = trimmed.startsWith("data:")
                        ? trimmed.slice(5).trim()
                        : trimmed;

                    if (!payload) continue;

                    try {
                        const parsed = JSON.parse(payload);
                        onMessage(parsed);
                    } catch {
                        // Not valid JSON yet — may be a partial chunk, ignore
                    }
                }
            }

            // Process any remaining buffer
            if (buffer.trim()) {
                const payload = buffer.trim().startsWith("data:")
                    ? buffer.trim().slice(5).trim()
                    : buffer.trim();
                try {
                    const parsed = JSON.parse(payload);
                    onMessage(parsed);
                } catch {
                    // ignore
                }
            }
        } catch (err) {
            if (err.name === "AbortError") return; // intentional disconnect
            console.error("SSE stream error:", err);
            if (onError) onError(err);
        }
    },

    /**
     * Fetch data from a GET endpoint (standard HTTP).
     *
     * @param {string} endpoint - The endpoint path
     * @returns {Promise<any>}
     */
    async get(endpoint) {
        const response = await fetch(this.url(endpoint));
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    },
};

export default api;
