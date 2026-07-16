"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkspace = useWorkspace;
const react_query_1 = require("@tanstack/react-query");
const workspace_store_1 = require("../stores/workspace.store");
const workspace_service_1 = require("../services/workspace.service");
function useWorkspace() {
    const { activeWorkspace, activeMode, setWorkspace, setMode, clearWorkspace } = (0, workspace_store_1.useWorkspaceStore)();
    const { data: workspaces, isLoading } = (0, react_query_1.useQuery)({
        queryKey: ["workspaces"],
        queryFn: workspace_service_1.WorkspaceService.list,
    });
    return {
        activeWorkspace,
        activeMode,
        workspaces: workspaces || [],
        isLoadingWorkspaces: isLoading,
        selectWorkspace: (workspace) => setWorkspace(workspace),
        selectMode: (mode) => setMode(mode),
        resetWorkspace: clearWorkspace,
    };
}
//# sourceMappingURL=useWorkspace.js.map