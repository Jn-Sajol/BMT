"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const api_1 = require("../lib/api");
exports.AuthService = {
    login: async (payload) => {
        const response = await api_1.api.post("/auth/login", payload);
        return response.data;
    },
    register: async (payload) => {
        const response = await api_1.api.post("/auth/register", payload);
        return response.data;
    },
    forgotPassword: async (payload) => {
        const response = await api_1.api.post("/auth/forgot-password", payload);
        return response.data;
    },
    resetPassword: async (payload) => {
        const response = await api_1.api.post("/auth/reset-password", payload);
        return response.data;
    },
    verifyEmail: async (payload) => {
        const response = await api_1.api.post("/auth/verify-email", payload);
        return response.data;
    },
};
//# sourceMappingURL=auth.service.js.map