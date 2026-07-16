"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SafeSettingsPage;
const react_1 = __importDefault(require("react"));
const useWorkspace_1 = require("../../../../../hooks/useWorkspace");
function SafeSettingsPage() {
    const { activeWorkspace } = (0, useWorkspace_1.useWorkspace)();
    const mockMembers = [
        { id: "u-1", name: "John Doe", email: "john@jnsoft.local", role: "Owner" },
        { id: "u-2", name: "Jane Smith", email: "jane@jnsoft.local", role: "Admin" },
    ];
    return (<div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Workspace Settings</h1>
        <p className="text-muted-foreground">General workspace parameters and team profiles</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Workspace Info */}
        <div className="border bg-card rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold">Workspace Information</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">Workspace Name: </span>
              <span>{activeWorkspace?.name || "Corporate"}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Workspace ID: </span>
              <span className="font-mono text-xs">{activeWorkspace?.id || "workspace-1"}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Deployment Status: </span>
              <span className="text-blue-500 font-semibold">SAFE (Read Only)</span>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="border bg-card rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold">Team Members</h2>
          <div className="space-y-3">
            {mockMembers.map((m) => (<div key={m.id} className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-bold">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.email}</div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded border bg-muted font-semibold">
                  {m.role}
                </span>
              </div>))}
          </div>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map