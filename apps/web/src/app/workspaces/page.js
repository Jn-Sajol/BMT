"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WorkspacesPage;
const react_1 = __importStar(require("react"));
const navigation_1 = require("next/navigation");
const useWorkspace_1 = require("../../hooks/useWorkspace");
function WorkspacesPage() {
    const router = (0, navigation_1.useRouter)();
    const { selectWorkspace, selectMode } = (0, useWorkspace_1.useWorkspace)();
    // Mock workspaces list (usually loaded from API)
    const mockWorkspaces = [
        { id: "workspace-1", name: "Corporate Marketing OS Workspace" },
        { id: "workspace-2", name: "Agency Client Ops Workspace" },
    ];
    const [selectedWorkspace, setSelectedWorkspaceState] = (0, react_1.useState)(null);
    const handleModeSelection = (mode) => {
        if (!selectedWorkspace)
            return;
        selectWorkspace(selectedWorkspace);
        selectMode(mode);
        if (mode === "SAFE") {
            router.push(`/workspace/${selectedWorkspace.id}/safe/dashboard`);
        }
        else {
            router.push(`/workspace/${selectedWorkspace.id}/advanced/designer`);
        }
    };
    return (<div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 px-4 py-12">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">Select Workspace Mode</h1>
          <p className="text-muted-foreground">Select your workspace and target operations gateway</p>
        </div>

        {/* 1. Workspace selection list */}
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Choose target workspace</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {mockWorkspaces.map((ws) => (<button key={ws.id} onClick={() => setSelectedWorkspaceState(ws)} className={`border rounded-lg p-4 text-left transition ${selectedWorkspace?.id === ws.id
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "hover:bg-muted/50"}`}>
                <div className="font-medium">{ws.name}</div>
                <div className="text-xs text-muted-foreground mt-1">Tenant ID: {ws.id}</div>
              </button>))}
          </div>
        </div>

        {/* 2. Workspace Modes cards */}
        <div className={`grid gap-6 md:grid-cols-2 transition-opacity ${selectedWorkspace ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
          {/* SAFE Workspace Option */}
          <div className="border bg-card rounded-xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  SAFE Mode
                </span>
              </div>
              <h3 className="text-2xl font-bold mt-4">SAFE Workspace</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Read-only environment designed for compliance campaign oversight and recommendations review.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">✓ Analytics Dashboard</li>
                <li className="flex items-center">✓ Optimization Recommendations</li>
                <li className="flex items-center">✓ Notification Center</li>
              </ul>
            </div>
            <button onClick={() => handleModeSelection("SAFE")} className="mt-8 w-full rounded-lg bg-blue-600 hover:bg-blue-700 py-2.5 text-sm font-semibold text-white transition">
              Enter SAFE Gateway
            </button>
          </div>

          {/* ADVANCED Workspace Option */}
          <div className="border bg-card rounded-xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                  ADVANCED Mode
                </span>
              </div>
              <h3 className="text-2xl font-bold mt-4">ADVANCED Workspace</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Active operations sandbox allowing rules compilations and custom script templates triggers.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">✓ Topological Workflow Builder</li>
                <li className="flex items-center">✓ Automation Run Engine</li>
                <li className="flex items-center">✓ Schedulers & Danger Zones</li>
              </ul>
            </div>
            <button onClick={() => handleModeSelection("ADVANCED")} className="mt-8 w-full rounded-lg bg-orange-600 hover:bg-orange-700 py-2.5 text-sm font-semibold text-white transition">
              Enter ADVANCED Gateway
            </button>
          </div>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map