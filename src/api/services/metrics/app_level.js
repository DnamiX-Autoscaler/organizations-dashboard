import api from "../../config/api";
import ENDPOINTS from "../../config/endpoint";

const appLevelService = {
    /**
     * Connect to the real-time app-level metrics live-stream via SSE.
     *
     * @param {object} options
     * @param {function} options.onMessage  - Called with parsed app metrics array on each event
     * @param {function} [options.onError]  - Called on stream error
     * @param {function} [options.onOpen]   - Called when connection opens successfully
     * @param {AbortSignal} [options.signal] - AbortController signal to cancel
     * @returns {Promise<void>}
     */
    connectLiveStream({ onMessage, onError, onOpen, signal } = {}) {
        return api.connectSSE(ENDPOINTS.APP.STREAM, {
            onMessage,
            onError,
            onOpen,
            signal,
        });
    },
};

export default appLevelService;
