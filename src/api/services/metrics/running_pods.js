import api from "../../config/api";
import ENDPOINTS from "../../config/endpoint";

const runningPodsService = {
    /**
     * Fetch the current list of running pods.
     * GET /runtime/pods
     *
     * @returns {Promise<Array>} - Array of pod objects
     */
    getPods() {
        return api.get(ENDPOINTS.RUNNING_PODS.GET);
    },
};

export default runningPodsService;
