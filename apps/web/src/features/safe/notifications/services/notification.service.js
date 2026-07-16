"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const api_1 = require("../../../../lib/api");
exports.NotificationService = {
    list: async () => {
        const response = await api_1.api.get("/notifications");
        return response.data;
    },
    updateSettings: async (payload) => {
        const response = await api_1.api.put("/notifications/config", payload);
        return response.data;
    },
};
//# sourceMappingURL=notification.service.js.map