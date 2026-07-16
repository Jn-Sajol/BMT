import { type User } from "../stores/auth.store";
export declare function useAuth(): {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: import("@tanstack/react-query").UseMutateAsyncFunction<{
        token: string;
        refreshToken: string;
        user: User;
    }, Error, any, unknown>;
    isLoggingIn: boolean;
    register: import("@tanstack/react-query").UseMutateAsyncFunction<any, Error, any, unknown>;
    isRegistering: boolean;
    logout: () => void;
};
