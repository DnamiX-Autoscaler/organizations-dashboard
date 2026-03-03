import api from "../../config/api";
import ENDPOINTS from "../../config/endpoint";

const processesService = {
    /**
     * Connect to the real-time process live-stream via SSE.
     *
     * @param {object} options
     * @param {function} options.onMessage - Called with parsed process data on each event
     * @param {function} [options.onError] - Called on stream error
     * @param {function} [options.onOpen]  - Called when connection opens
     * @param {AbortSignal} [options.signal] - AbortController signal to cancel
     * @returns {Promise<void>}
     */
    connectLiveStream({ onMessage, onError, onOpen, signal } = {}) {
        return api.connectSSE(ENDPOINTS.PROCESS.STREAM, {
            onMessage,
            onError,
            onOpen,
            signal,
        });
    },
};

export default processesService;
