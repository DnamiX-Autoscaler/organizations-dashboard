import api from "../../config/api";
import ENDPOINTS from "../../config/endpoint";

const graphCentralityService = {
    /**
     * Connect to the graph centrality live-stream SSE endpoint.
     * Each SSE event contains { services, connections, insights }.
     *
     * @param {object} options
     * @param {function} options.onMessage  - Called with parsed JSON data per event
     * @param {function} [options.onError]  - Called on stream error
     * @param {function} [options.onOpen]   - Called when connection opens
     * @param {AbortSignal} [options.signal] - AbortController signal to cancel
     * @returns {Promise<void>}
     */
    connectLiveStream({ onMessage, onError, onOpen, signal } = {}) {
        return api.connectSSE(ENDPOINTS.GRAPH_CENTRALITY.STREAM, {
            onMessage,
            onError,
            onOpen,
            signal,
        });
    },
};

export default graphCentralityService;
