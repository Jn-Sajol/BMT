"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAdvancedWorkflowStore = void 0;
const zustand_1 = require("zustand");
exports.useAdvancedWorkflowStore = (0, zustand_1.create)((set) => ({
    nodes: [],
    setNodes: (nodes) => set({ nodes }),
    clearWorkflow: () => set({ nodes: [] }),
}));
//# sourceMappingURL=workflow.store.js.map