"use client"

import React from "react"

interface ExportJob {
  id: string
  action: string
  timestamp: string
}

interface Props {
  history: ExportJob[]
}

export function SavedSearchesPanel({ history }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Exporter Activity Action Audits</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {history.map((h) => (
          <div key={h.id} style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "11px", color: "#9ca3af" }}>{new Date(h.timestamp).toLocaleTimeString()}</span>
              <div style={{ fontSize: "13px", marginTop: "2px" }}>{h.action}</div>
            </div>
          </div>
        ))}
        {history.length === 0 && <div style={{ color: "#9ca3af", fontSize: "13px" }}>No recent export operations performed.</div>}
      </div>
    </div>
  )
}
