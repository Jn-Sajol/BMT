"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useThemeStore = void 0;
const zustand_1 = require("zustand");
exports.useThemeStore = (0, zustand_1.create)((set) => ({
    theme: typeof window !== "undefined"
        ? (localStorage.getItem("bmt_theme") || "system")
        : "system",
    setTheme: (theme) => {
        localStorage.setItem("bmt_theme", theme);
        set({ theme });
    },
}));
//# sourceMappingURL=theme.store.js.map