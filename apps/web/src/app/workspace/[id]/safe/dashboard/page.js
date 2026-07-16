"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SafeDashboard;
const react_1 = __importDefault(require("react"));
const useWorkspace_1 = require("../../../../../hooks/useWorkspace");
function SafeDashboard() {
    const { activeWorkspace } = (0, useWorkspace_1.useWorkspace)();
    return (<div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">SAFE Dashboard</h1>
        <p className="text-muted-foreground">Compliance analytics metrics and optimization advisor settings</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="border bg-card p-6 rounded-xl shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground uppercase">Monitored Spend</div>
          <div className="text-3xl font-bold mt-2">$24,500.00</div>
          <div className="text-xs text-emerald-500 mt-1">✓ within budget</div>
        </div>

        <div className="border bg-card p-6 rounded-xl shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground uppercase">Advisory Suggestions</div>
          <div className="text-3xl font-bold mt-2">12 Active</div>
          <div className="text-xs text-blue-500 mt-1">→ 3 high priority</div>
        </div>

        <div className="border bg-card p-6 rounded-xl shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground uppercase">Workspace Name</div>
          <div className="text-3xl font-bold mt-2">{activeWorkspace?.name || "Corporate"}</div>
          <div className="text-xs text-muted-foreground mt-1">Tenant context active</div>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map