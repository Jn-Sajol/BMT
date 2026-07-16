"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SafeLayout;
const react_1 = __importDefault(require("react"));
const useWorkspace_1 = require("../../../../hooks/useWorkspace");
const useAuth_1 = require("../../../../hooks/useAuth");
const useTheme_1 = require("../../../../hooks/useTheme");
const navigation_1 = require("next/navigation");
function SafeLayout({ children }) {
    const { activeWorkspace, selectMode } = (0, useWorkspace_1.useWorkspace)();
    const { user, logout } = (0, useAuth_1.useAuth)();
    const { theme, setTheme } = (0, useTheme_1.useTheme)();
    const router = (0, navigation_1.useRouter)();
    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };
    return (<div className="flex h-screen bg-background text-foreground">
      {/* 1. Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col justify-between p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded bg-blue-600"/>
            <span className="font-bold text-lg">BMT SAFE</span>
          </div>

          <nav className="space-y-1">
            <button onClick={() => router.push(`/workspace/${activeWorkspace?.id || "workspace-1"}/safe/dashboard`)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground text-sm">
              Dashboard
            </button>
            <button onClick={() => router.push(`/workspace/${activeWorkspace?.id || "workspace-1"}/safe/analytics`)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground text-sm">
              Analytics
            </button>
            <button onClick={() => router.push(`/workspace/${activeWorkspace?.id || "workspace-1"}/safe/recommendations`)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground text-sm">
              Recommendations
            </button>
            <button onClick={() => router.push(`/workspace/${activeWorkspace?.id || "workspace-1"}/safe/marketplace`)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground text-sm">
              Marketplace
            </button>
            <button onClick={() => router.push(`/workspace/${activeWorkspace?.id || "workspace-1"}/safe/notifications`)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground text-sm">
              Notifications
            </button>
            <button onClick={() => router.push(`/workspace/${activeWorkspace?.id || "workspace-1"}/safe/settings`)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground text-sm">
              Settings
            </button>
          </nav>
        </div>

        <div className="space-y-4">
          <div className="text-xs text-muted-foreground">
            Workspace: {activeWorkspace?.name || "Corporate"}
          </div>
          <button onClick={() => selectMode("ADVANCED")} className="w-full rounded bg-orange-600 hover:bg-orange-700 text-white py-1.5 text-xs font-semibold">
            Switch to ADVANCED
          </button>
        </div>
      </aside>

      {/* 2. Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-8">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Workspace</span>
            <span>/</span>
            <span className="font-semibold text-foreground">{activeWorkspace?.name}</span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 border rounded-lg hover:bg-muted text-sm">
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            {/* Profile Dropdown */}
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-medium">{user?.name || "Corporate User"}</span>
              <button onClick={handleLogout} className="px-2.5 py-1 border rounded text-xs hover:bg-destructive/10 text-destructive">
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* View content */}
        <main className="flex-1 overflow-auto p-8 bg-muted/10">
          {children}
        </main>
      </div>
    </div>);
}
//# sourceMappingURL=layout.js.map