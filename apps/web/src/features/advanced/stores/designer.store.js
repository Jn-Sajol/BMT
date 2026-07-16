"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAdvancedDesignerStore = void 0;
const zustand_1 = require("zustand");
exports.useAdvancedDesignerStore = (0, zustand_1.create)((set) => ({
    activeTab: "editor",
    setActiveTab: (activeTab) => set({ activeTab }),
}));
//# sourceMappingURL=designer.store.js.map