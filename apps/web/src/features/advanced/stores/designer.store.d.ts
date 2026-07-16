interface DesignerState {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}
export declare const useAdvancedDesignerStore: import("zustand").UseBoundStore<import("zustand").StoreApi<DesignerState>>;
export {};
