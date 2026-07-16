"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const api_1 = require("../../../../lib/api");
exports.DashboardService = {
    getKPIs: async () => {
        // In SAFE Mode, this queries aggregate campaign metrics
        const response = await api_1.api.get("/automation/recommendations/dashboard");
        return response.data;
    },
    getRecentActivities: async () => {
        const response = await api_1.api.get("/audit-logs");
        return response.data;
    },
};
//# sourceMappingURL=dashboard.service.js.map