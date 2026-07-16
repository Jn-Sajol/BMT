"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceService = void 0;
const api_1 = require("../../../../lib/api");
exports.MarketplaceService = {
    listTemplates: async () => {
        const response = await api_1.api.get("/automation/marketplace");
        return response.data;
    },
    installTemplate: async (id, payload) => {
        const response = await api_1.api.post(`/automation/marketplace/${id}/install`, payload);
        return response.data;
    },
    rollbackTemplate: async (id) => {
        const response = await api_1.api.post(`/automation/marketplace/${id}/rollback`);
        return response.data;
    },
};
//# sourceMappingURL=marketplace.service.js.map