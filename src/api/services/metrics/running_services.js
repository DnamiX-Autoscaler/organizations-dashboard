import api from "../../config/api";
import ENDPOINTS from "../../config/endpoint";

const runningServicesService = {
    /**
     * Fetch the current list of running Kubernetes services.
     * GET /runtime/services
     *
     * @returns {Promise<Array>} - Array of service objects
     */
    getServices() {
        return api.get(ENDPOINTS.RUNNING_SERVICES.GET);
    },
};

export default runningServicesService;
