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
exports.default = SafeNotificationsPage;
const react_1 = __importStar(require("react"));
const useNotifications_1 = require("../../../../../features/safe/notifications/hooks/useNotifications");
function SafeNotificationsPage() {
    const { notifications, updateSettings } = (0, useNotifications_1.useNotifications)();
    const [quietHoursStart, setQuietHoursStart] = (0, react_1.useState)("22:00");
    const [quietHoursEnd, setQuietHoursEnd] = (0, react_1.useState)("08:00");
    const displayNotifications = notifications.length > 0 ? notifications : [
        { id: "alert-1", title: "Meta CPC Spike Detected", message: "Campaign Meta-Ads-Q3 exceeds target threshold CPC by 24%.", priority: "HIGH", createdAt: new Date().toLocaleTimeString() },
        { id: "alert-2", title: "Template Installed Successfully", message: "Digital signature verification passed for Slack integration.", priority: "INFO", createdAt: new Date().toLocaleTimeString() },
    ];
    const handleSaveSettings = async () => {
        await updateSettings({ quietHoursStart, quietHoursEnd });
    };
    return (<div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Notification Center</h1>
        <p className="text-muted-foreground">Alerts inbox log and timezone configurations</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Alerts feed */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">Active Alerts</h2>
          {displayNotifications.map((alert) => (<div key={alert.id} className="border bg-card rounded-xl p-4 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold text-blue-600">{alert.priority}</span>
                <span>{alert.createdAt}</span>
              </div>
              <h3 className="font-bold text-sm">{alert.title}</h3>
              <p className="text-xs text-muted-foreground">{alert.message}</p>
            </div>))}
        </div>

        {/* Quiet hours configurations */}
        <div className="border bg-card rounded-xl p-6 shadow-sm space-y-4 h-fit">
          <h2 className="text-lg font-semibold">Alert Settings</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Quiet Hours Start</label>
            <input type="time" value={quietHoursStart} onChange={(e) => setQuietHoursStart(e.target.value)} className="w-full rounded border px-3 py-2 text-sm bg-background"/>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Quiet Hours End</label>
            <input type="time" value={quietHoursEnd} onChange={(e) => setQuietHoursEnd(e.target.value)} className="w-full rounded border px-3 py-2 text-sm bg-background"/>
          </div>

          <button onClick={handleSaveSettings} className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 py-2 text-sm font-semibold text-white transition">
            Save Preferences
          </button>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map