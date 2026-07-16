interface SelectionState {
    selectedNodeId: string | null;
    setSelectedNodeId: (id: string | null) => void;
}
export declare const useAdvancedSelectionStore: import("zustand").UseBoundStore<import("zustand").StoreApi<SelectionState>>;
export {};
