"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const axios_1 = __importDefault(require("axios"));
const auth_store_1 = require("../stores/auth.store");
const workspace_store_1 = require("../stores/workspace.store");
const env_1 = require("./env");
exports.api = axios_1.default.create({
    baseURL: env_1.env.NEXT_PUBLIC_API_URL,
});
// Request Interceptor: Inject JWT and Workspace Headers
exports.api.interceptors.request.use((config) => {
    const token = auth_store_1.useAuthStore.getState().token;
    const activeWorkspace = workspace_store_1.useWorkspaceStore.getState().activeWorkspace;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (activeWorkspace) {
        config.headers["x-workspace-id"] = activeWorkspace.id;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// Response Interceptor: Manage 401 Session Refresh
exports.api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = auth_store_1.useAuthStore.getState().refreshToken;
        if (refreshToken) {
            try {
                const response = await axios_1.default.post(`${env_1.env.NEXT_PUBLIC_API_URL}/auth/refresh`, { refreshToken });
                const { token, newRefreshToken, user } = response.data;
                auth_store_1.useAuthStore.getState().setSession(token, newRefreshToken, user);
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return (0, exports.api)(originalRequest);
            }
            catch (refreshError) {
                auth_store_1.useAuthStore.getState().clearSession();
                if (typeof window !== "undefined") {
                    window.location.href = "/auth/login";
                }
            }
        }
    }
    return Promise.reject(error);
});
//# sourceMappingURL=api.js.map