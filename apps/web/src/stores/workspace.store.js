"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkspaceStore = void 0;
const zustand_1 = require("zustand");
exports.useWorkspaceStore = (0, zustand_1.create)((set) => ({
    activeWorkspace: typeof window !== "undefined" && localStorage.getItem("bmt_active_workspace")
        ? JSON.parse(localStorage.getItem("bmt_active_workspace"))
        : null,
    activeMode: typeof window !== "undefined"
        ? localStorage.getItem("bmt_active_mode")
        : null,
    setWorkspace: (workspace) => {
        localStorage.setItem("bmt_active_workspace", JSON.stringify(workspace));
        set({ activeWorkspace: workspace });
    },
    setMode: (mode) => {
        localStorage.setItem("bmt_active_mode", mode);
        set({ activeMode: mode });
    },
    clearWorkspace: () => {
        localStorage.removeItem("bmt_active_workspace");
        localStorage.removeItem("bmt_active_mode");
        set({ activeWorkspace: null, activeMode: null });
    },
}));
//# sourceMappingURL=workspace.store.js.map