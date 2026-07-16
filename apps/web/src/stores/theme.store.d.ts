type Theme = "dark" | "light" | "system";
interface ThemeState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}
export declare const useThemeStore: import("zustand").UseBoundStore<import("zustand").StoreApi<ThemeState>>;
export {};
