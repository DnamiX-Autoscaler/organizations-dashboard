import api from "../../config/api";
import ENDPOINTS from "../../config/endpoint";

const performanceService = {
    /**
     * Connect to the real-time cluster performance live-stream via SSE.
     *
     * @param {object} options
     * @param {function} options.onMessage  - Called with parsed performance data on each event
     * @param {function} [options.onError]  - Called on stream error
     * @param {function} [options.onOpen]   - Called when connection opens successfully
     * @param {AbortSignal} [options.signal] - AbortController signal to cancel
     * @returns {Promise<void>}
     */
    connectLiveStream({ onMessage, onError, onOpen, signal } = {}) {
        return api.connectSSE(ENDPOINTS.PERFORMANCE.STREAM, {
            onMessage,
            onError,
            onOpen,
            signal,
        });
    },
};

export default performanceService;