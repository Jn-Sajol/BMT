import { useQuery } from "@tanstack/react-query"
import { useWorkspaceStore, type Workspace } from "../stores/workspace.store"
import { WorkspaceService } from "../services/workspace.service"

export function useWorkspace() {
  const { activeWorkspace, activeMode, setWorkspace, setMode, clearWorkspace } = useWorkspaceStore()

  const { data: workspaces, isLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: WorkspaceService.list,
  })

  return {
    activeWorkspace,
    activeMode,
    workspaces: workspaces || [],
    isLoadingWorkspaces: isLoading,
    selectWorkspace: (workspace: Workspace) => setWorkspace(workspace),
    selectMode: (mode: "SAFE" | "ADVANCED") => setMode(mode),
    resetWorkspace: clearWorkspace,
  }
}
