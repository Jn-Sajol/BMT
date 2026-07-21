"use client"

import React from "react"

interface Props {
  totalRuns: number
  successRuns: number
  failedRuns: number
}

export function GroupMessengerReportPanel({ totalRuns, successRuns, failedRuns }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px" }}>
      <h4 style={{ color: "#10b981", margin: "0 0 12px 0" }}>Auto-Responder Performance Metrics</h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", textAlign: "center" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "8px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>{totalRuns}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Total responses</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "8px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#10b981" }}>{successRuns}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Success</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "8px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#ef4444" }}>{failedRuns}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Failed</span>
        </div>
      </div>
    </div>
  )
}
