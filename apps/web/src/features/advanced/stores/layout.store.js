"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAdvancedLayoutStore = void 0;
const zustand_1 = require("zustand");
exports.useAdvancedLayoutStore = (0, zustand_1.create)((set) => ({
    showSidebar: true,
    showConsole: true,
    toggleSidebar: () => set((state) => ({ showSidebar: !state.showSidebar })),
    toggleConsole: () => set((state) => ({ showConsole: !state.showConsole })),
}));
//# sourceMappingURL=layout.store.js.map