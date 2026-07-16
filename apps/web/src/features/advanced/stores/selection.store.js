"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAdvancedSelectionStore = void 0;
const zustand_1 = require("zustand");
exports.useAdvancedSelectionStore = (0, zustand_1.create)((set) => ({
    selectedNodeId: null,
    setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),
}));
//# sourceMappingURL=selection.store.js.map