"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationService = void 0;
const api_1 = require("../../../../lib/api");
exports.RecommendationService = {
    list: async () => {
        const response = await api_1.api.get("/automation/recommendations");
        return response.data;
    },
    accept: async (id) => {
        const response = await api_1.api.post(`/automation/recommendations/${id}/accept`);
        return response.data;
    },
    reject: async (id) => {
        const response = await api_1.api.post(`/automation/recommendations/${id}/reject`);
        return response.data;
    },
};
//# sourceMappingURL=recommendation.service.js.map