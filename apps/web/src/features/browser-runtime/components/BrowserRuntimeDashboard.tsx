"use client"

import React from "react"

interface Props {
  totalProfiles: number
  activeSessions: number
  lockedProfiles: number
}

export function BrowserRuntimeDashboard({ totalProfiles, activeSessions, lockedProfiles }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
      <h3 style={{ color: "#60a5fa", margin: "0 0 16px 0" }}>Browser Runtime Console</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "16px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#60a5fa" }}>{totalProfiles}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Total Profiles</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#10b981" }}>{activeSessions}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Active Sessions</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#f59e0b" }}>{lockedProfiles}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Locked Sessions</div>
        </div>
      </div>
    </div>
  )
}
