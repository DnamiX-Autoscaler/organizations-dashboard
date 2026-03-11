import api from "../../config/api";
import ENDPOINTS from "../../config/endpoint";

const runningMonitoringServicesService = {
    /**
     * Fetch the current list of monitoring namespace services.
     * GET /runtime/monitoring/services
     *
     * @returns {Promise<Array>} - Array of service objects
     */
    getServices() {
        return api.get(ENDPOINTS.MONITORING_SERVICES.GET);
    },
};

export default runningMonitoringServicesService;
