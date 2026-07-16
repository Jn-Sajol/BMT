"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const react_1 = __importDefault(require("react"));
require("./globals.css");
const auth_provider_1 = require("../providers/auth-provider");
const theme_provider_1 = require("../providers/theme-provider");
const query_provider_1 = require("../providers/query-provider");
const workspace_provider_1 = require("../providers/workspace-provider");
const motion_provider_1 = require("../providers/motion-provider");
exports.metadata = {
    title: "BMT Platform",
    description: "Enterprise Marketing Operating System",
};
function RootLayout({ children }) {
    return (<html lang="en" suppressHydrationWarning>
      <body>
        <query_provider_1.QueryProvider>
          <auth_provider_1.AuthProvider>
            <workspace_provider_1.WorkspaceProvider>
              <theme_provider_1.ThemeProvider>
                <motion_provider_1.MotionProvider>
                  {children}
                </motion_provider_1.MotionProvider>
              </theme_provider_1.ThemeProvider>
            </workspace_provider_1.WorkspaceProvider>
          </auth_provider_1.AuthProvider>
        </query_provider_1.QueryProvider>
      </body>
    </html>);
}
//# sourceMappingURL=layout.js.map