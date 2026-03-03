import api from "../../config/api";
import ENDPOINTS from "../../config/endpoint";

const nodeLevelService = {
    /**
     * Connect to the real-time node-level metrics live-stream via SSE.
     *
     * @param {object} options
     * @param {function} options.onMessage  - Called with parsed node metrics array on each event
     * @param {function} [options.onError]  - Called on stream error
     * @param {function} [options.onOpen]   - Called when connection opens successfully
     * @param {AbortSignal} [options.signal] - AbortController signal to cancel
     * @returns {Promise<void>}
     */
    connectLiveStream({ onMessage, onError, onOpen, signal } = {}) {
        return api.connectSSE(ENDPOINTS.NODE.STREAM, {
            onMessage,
            onError,
            onOpen,
            signal,
        });
    },
};

export default nodeLevelService;