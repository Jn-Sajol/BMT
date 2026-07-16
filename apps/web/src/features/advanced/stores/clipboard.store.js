"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAdvancedClipboardStore = void 0;
const zustand_1 = require("zustand");
exports.useAdvancedClipboardStore = (0, zustand_1.create)((set) => ({
    copiedNodeData: null,
    setCopiedNodeData: (copiedNodeData) => set({ copiedNodeData }),
}));
//# sourceMappingURL=clipboard.store.js.map