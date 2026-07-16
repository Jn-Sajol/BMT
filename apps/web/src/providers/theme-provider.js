"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeProvider = ThemeProvider;
const react_1 = __importDefault(require("react"));
const useTheme_1 = require("../hooks/useTheme");
function ThemeProvider({ children }) {
    (0, useTheme_1.useTheme)(); // Applies active theme class at startup
    return <>{children}</>;
}
//# sourceMappingURL=theme-provider.js.map