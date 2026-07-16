"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAdvancedExecutionStore = void 0;
const zustand_1 = require("zustand");
exports.useAdvancedExecutionStore = (0, zustand_1.create)((set) => ({
    logs: ["[System] Engine initialized. Ready to compile rules."],
    addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
    clearLogs: () => set({ logs: [] }),
}));
//# sourceMappingURL=execution.store.js.map