import { create } from "zustand"

export interface Workspace {
  id: string
  name: string
}

interface WorkspaceState {
  activeWorkspace: Workspace | null
  activeMode: "SAFE" | "ADVANCED" | null
  setWorkspace: (workspace: Workspace) => void
  setMode: (mode: "SAFE" | "ADVANCED") => void
  clearWorkspace: () => void
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activeWorkspace: typeof window !== "undefined" && localStorage.getItem("bmt_active_workspace")
    ? JSON.parse(localStorage.getItem("bmt_active_workspace")!)
    : null,
  activeMode: typeof window !== "undefined"
    ? (localStorage.getItem("bmt_active_mode") as "SAFE" | "ADVANCED" | null)
    : null,
  setWorkspace: (workspace) => {
    localStorage.setItem("bmt_active_workspace", JSON.stringify(workspace))
    set({ activeWorkspace: workspace })
  },
  setMode: (mode) => {
    localStorage.setItem("bmt_active_mode", mode)
    set({ activeMode: mode })
  },
  clearWorkspace: () => {
    localStorage.removeItem("bmt_active_workspace")
    localStorage.removeItem("bmt_active_mode")
    set({ activeWorkspace: null, activeMode: null })
  },
}))
