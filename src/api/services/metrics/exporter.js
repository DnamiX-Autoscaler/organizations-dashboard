import api from "../../config/api";
import ENDPOINTS from "../../config/endpoint";

const exporterService = {
    /**
     * Connect to the live metrics stream.
     * Each SSE message is an object keyed by "namespace/service_name",
     * where each value is a flat metrics record.
     *
     * GET /metrics/live-stream  (SSE)
     *
     * @param {object} options
     * @param {function} options.onMessage  - Called with the parsed batch object per SSE event
     * @param {function} [options.onError]  - Called on stream error
     * @param {function} [options.onOpen]   - Called when the connection opens
     * @param {AbortSignal} [options.signal] - AbortController signal to cancel the stream
     * @returns {Promise<void>}
     */
    connectStream({ onMessage, onError, onOpen, signal } = {}) {
        return api.connectSSE(ENDPOINTS.METRICS_EXPORT.STREAM, {
            onMessage,
            onError,
            onOpen,
            signal,
        });
    },
};

export default exporterService;
