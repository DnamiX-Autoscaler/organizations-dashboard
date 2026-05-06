import api from "../../config/api";
import ENDPOINTS from "../../config/endpoint";

const configurationsService = {
    /**
     * Fetch the current runtime configuration.
     * GET /config/runtime
     *
     * @returns {Promise<object>} - { prometheus, collection_window_seconds, targets, modes }
     */
    getConfig() {
        return api.get(ENDPOINTS.CONFIG.GET);
    },
};

export default configurationsService;
