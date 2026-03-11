import api from "../../config/api";
import ENDPOINTS from "../../config/endpoint";

const podLevelService = {
    /**
     * Connect to the real-time pod-level metrics live-stream via SSE.
     *
     * @param {object} options
     * @param {function} options.onMessage  - Called with parsed pod metrics array on each event
     * @param {function} [options.onError]  - Called on stream error
     * @param {function} [options.onOpen]   - Called when connection opens successfully
     * @param {AbortSignal} [options.signal] - AbortController signal to cancel
     * @returns {Promise<void>}
     */
    connectLiveStream({ onMessage, onError, onOpen, signal } = {}) {
        return api.connectSSE(ENDPOINTS.POD.STREAM, {
            onMessage,
            onError,
            onOpen,
            signal,
        });
    },
};

export default podLevelService;
