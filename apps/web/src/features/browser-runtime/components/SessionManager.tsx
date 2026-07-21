"use client"

import React from "react"

interface BrowserSession {
  id: string
  profileId: string
  status: string
}

interface Props {
  sessions: BrowserSession[]
  onRefresh: (id: string) => void
}

export function SessionManager({ sessions, onRefresh }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Session Refresher Console</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {sessions.map((s) => (
          <div key={s.id} style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <b>Session: {s.id}</b>
              <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>Profile: {s.profileId}</div>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: s.status === "Valid" ? "#10b981" : "#ef4444" }}>{s.status}</span>
              <button onClick={() => onRefresh(s.id)} style={{ background: "#60a5fa", border: "none", color: "#000", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>Refresh Token</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
