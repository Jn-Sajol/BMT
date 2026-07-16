"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceService = void 0;
const api_1 = require("../lib/api");
exports.WorkspaceService = {
    list: async () => {
        const response = await api_1.api.get("/workspaces");
        return response.data;
    },
    create: async (payload) => {
        const response = await api_1.api.post("/workspaces", payload);
        return response.data;
    },
};
//# sourceMappingURL=workspace.service.js.map