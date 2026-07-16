interface ClipboardState {
    copiedNodeData: any | null;
    setCopiedNodeData: (data: any) => void;
}
export declare const useAdvancedClipboardStore: import("zustand").UseBoundStore<import("zustand").StoreApi<ClipboardState>>;
export {};
