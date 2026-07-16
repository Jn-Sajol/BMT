interface LayoutState {
    showSidebar: boolean;
    showConsole: boolean;
    toggleSidebar: () => void;
    toggleConsole: () => void;
}
export declare const useAdvancedLayoutStore: import("zustand").UseBoundStore<import("zustand").StoreApi<LayoutState>>;
export {};
