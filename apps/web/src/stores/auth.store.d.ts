export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}
interface AuthState {
    token: string | null;
    refreshToken: string | null;
    user: User | null;
    setSession: (token: string, refreshToken: string, user: User) => void;
    clearSession: () => void;
}
export declare const useAuthStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AuthState>>;
export {};
