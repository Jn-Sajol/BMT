export interface Workspace {
    id: string;
    name: string;
}
interface WorkspaceState {
    activeWorkspace: Workspace | null;
    activeMode: "SAFE" | "ADVANCED" | null;
    setWorkspace: (workspace: Workspace) => void;
    setMode: (mode: "SAFE" | "ADVANCED") => void;
    clearWorkspace: () => void;
}
export declare const useWorkspaceStore: import("zustand").UseBoundStore<import("zustand").StoreApi<WorkspaceState>>;
export {};
