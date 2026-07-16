"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = useAuth;
const react_query_1 = require("@tanstack/react-query");
const auth_store_1 = require("../stores/auth.store");
const auth_service_1 = require("../services/auth.service");
function useAuth() {
    const { user, token, setSession, clearSession } = (0, auth_store_1.useAuthStore)();
    const loginMutation = (0, react_query_1.useMutation)({
        mutationFn: auth_service_1.AuthService.login,
        onSuccess: (data) => {
            setSession(data.token, data.refreshToken, data.user);
        },
    });
    const registerMutation = (0, react_query_1.useMutation)({
        mutationFn: auth_service_1.AuthService.register,
    });
    return {
        user,
        token,
        isAuthenticated: !!token,
        login: loginMutation.mutateAsync,
        isLoggingIn: loginMutation.isPending,
        register: registerMutation.mutateAsync,
        isRegistering: registerMutation.isPending,
        logout: clearSession,
    };
}
//# sourceMappingURL=useAuth.js.map