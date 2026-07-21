"use client"

import React from "react"

interface BrowserSession {
  id: string
  profileId: string
  expiresAt: string
  status: string
}

interface Props {
  sessions: BrowserSession[]
  onValidate: (id: string) => void
}

export function BrowserSessionPanel({ sessions, onValidate }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Active Encryption Cookie Sessions</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {sessions.map((s) => (
          <div key={s.id} style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "11px", color: "#9ca3af" }}>Session: {s.id}</span>
              <div style={{ fontSize: "13px", marginTop: "2px" }}>Linked Profile: {s.profileId}</div>
              <div style={{ fontSize: "11px", color: "#ef4444", marginTop: "2px" }}>Expires: {new Date(s.expiresAt).toLocaleDateString()}</div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ fontSize: "12px", background: "rgba(16,185,129,0.15)", color: "#10b981", padding: "2px 8px", borderRadius: "10px" }}>{s.status}</span>
              <button
                onClick={() => onValidate(s.id)}
                style={{ background: "#60a5fa", border: "none", color: "#000", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
              >
                Validate cookies
              </button>
            </div>
          </div>
        ))}
        {sessions.length === 0 && <div style={{ color: "#9ca3af", fontSize: "13px" }}>No active sessions recorded.</div>}
      </div>
    </div>
  )
}
