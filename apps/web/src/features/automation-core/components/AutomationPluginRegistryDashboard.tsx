"use client"

import React from "react"

export interface PluginItemSummary {
  id: string
  name: string
  version: string
  platform: string
  isEnabled: boolean
  capabilities: string[]
  healthStatus: "Healthy" | "Degraded" | "Disabled"
}

export interface DriverItemSummary {
  platformId: string
  platformName: string
  version: string
  status: "Active" | "Inactive"
}

interface Props {
  plugins: PluginItemSummary[]
  drivers: DriverItemSummary[]
  onTogglePlugin: (pluginId: string, enabled: boolean) => void
}

export function AutomationPluginRegistryDashboard({ plugins, drivers, onTogglePlugin }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ color: "#10b981", margin: 0 }}>Automation Plugin & Registry Console</h3>
        <span style={{ fontSize: "11px", color: "#9ca3af", background: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: "4px" }}>
          Framework Event Schema v1.0
        </span>
      </div>

      {/* Installed Drivers Section */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px" }}>Installed Platform Drivers ({drivers.length})</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px" }}>
          {drivers.map((d) => (
            <div key={d.platformId} style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "6px" }}>
              <div style={{ fontWeight: "bold", fontSize: "13px" }}>{d.platformName}</div>
              <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>v{d.version} | ID: {d.platformId}</div>
              <span style={{ fontSize: "10px", color: d.status === "Active" ? "#10b981" : "#9ca3af", display: "inline-block", marginTop: "4px" }}>
                ● {d.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Registered Plugins Section */}
      <div>
        <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px" }}>Registered Automation Plugins ({plugins.length})</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {plugins.map((p) => (
            <div key={p.id} style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <b style={{ fontSize: "14px" }}>{p.name}</b>
                  <span style={{ fontSize: "10px", background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px" }}>v{p.version}</span>
                  <span style={{ fontSize: "10px", color: "#60a5fa" }}>Platform: {p.platform}</span>
                </div>
                <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "6px" }}>
                  Supported Capabilities: {p.capabilities.map((c) => <span key={c} style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", padding: "1px 6px", borderRadius: "3px", marginRight: "4px", fontSize: "10px" }}>{c}</span>)}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "11px", color: p.healthStatus === "Healthy" ? "#10b981" : p.healthStatus === "Degraded" ? "#f59e0b" : "#ef4444" }}>
                  ● {p.healthStatus}
                </span>
                <button
                  onClick={() => onTogglePlugin(p.id, !p.isEnabled)}
                  style={{
                    background: p.isEnabled ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)",
                    border: "none",
                    color: p.isEnabled ? "#fca5a5" : "#6ee7b7",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "11px"
                  }}
                >
                  {p.isEnabled ? "Disable" : "Enable"}
                </button>
              </div>
            </div>
          ))}
          {plugins.length === 0 && <div style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "12px" }}>No plugins registered.</div>}
        </div>
      </div>
    </div>
  )
}
