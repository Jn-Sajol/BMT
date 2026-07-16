"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedDesignerService = void 0;
const api_1 = require("../../../lib/api");
exports.AdvancedDesignerService = {
    listWorkflows: async () => {
        const response = await api_1.api.get("/automation/workflows");
        return response.data;
    },
    getWorkflow: async (id) => {
        const response = await api_1.api.get(`/automation/workflows/${id}`);
        return response.data;
    },
    compileWorkflow: async (id, payload) => {
        const response = await api_1.api.post(`/automation/workflows/${id}/compile`, payload);
        return response.data;
    },
    validateWorkflow: async (id, payload) => {
        const response = await api_1.api.post(`/automation/workflows/${id}/validate`, payload);
        return response.data;
    },
    publishWorkflow: async (id, payload) => {
        const response = await api_1.api.post(`/automation/workflows/${id}/publish`, payload);
        return response.data;
    },
    deployWorkflow: async (id, payload) => {
        const response = await api_1.api.post(`/automation/workflows/${id}/deploy`, payload);
        return response.data;
    },
    listExecutions: async () => {
        const response = await api_1.api.get("/automation/executions");
        return response.data;
    },
    getExecutionLogs: async (id) => {
        const response = await api_1.api.get(`/automation/executions/${id}/logs`);
        return response.data;
    },
    listVariables: async () => {
        const response = await api_1.api.get("/automation/variables");
        return response.data;
    },
    listTriggers: async () => {
        const response = await api_1.api.get("/automation/triggers");
        return response.data;
    },
};
//# sourceMappingURL=designer.service.js.map