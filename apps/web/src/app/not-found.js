"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NotFound;
const react_1 = __importDefault(require("react"));
const link_1 = __importDefault(require("next/link"));
function NotFound() {
    return (<div className="flex h-screen flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-bold">404 - Page Not Found</h2>
      <p className="text-muted-foreground">The resource you requested does not exist.</p>
      <link_1.default href="/workspaces" className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
        Return Home
      </link_1.default>
    </div>);
}
//# sourceMappingURL=not-found.js.map