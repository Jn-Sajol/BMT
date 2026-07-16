"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTheme = useTheme;
const react_1 = require("react");
const theme_store_1 = require("../stores/theme.store");
function useTheme() {
    const { theme, setTheme } = (0, theme_store_1.useThemeStore)();
    (0, react_1.useEffect)(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            root.classList.add(systemTheme);
        }
        else {
            root.classList.add(theme);
        }
    }, [theme]);
    return { theme, setTheme };
}
//# sourceMappingURL=useTheme.js.map