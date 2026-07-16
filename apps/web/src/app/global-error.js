"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GlobalError;
const react_1 = __importDefault(require("react"));
function GlobalError({ error, reset }) {
    return (<html>
      <body className="flex h-screen flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold text-destructive">A critical error occurred!</h2>
        <p className="text-muted-foreground">{error.message}</p>
        <button onClick={reset} className="rounded bg-primary px-4 py-2 text-primary-foreground">
          Retry boot
        </button>
      </body>
    </html>);
}
//# sourceMappingURL=global-error.js.map