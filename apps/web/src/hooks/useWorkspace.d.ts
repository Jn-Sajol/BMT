import { type Workspace } from "../stores/workspace.store";
export declare function useWorkspace(): {
    activeWorkspace: Workspace | null;
    activeMode: "SAFE" | "ADVANCED" | null;
    workspaces: any;
    isLoadingWorkspaces: boolean;
    selectWorkspace: (workspace: Workspace) => void;
    selectMode: (mode: "SAFE" | "ADVANCED") => void;
    resetWorkspace: () => void;
};
