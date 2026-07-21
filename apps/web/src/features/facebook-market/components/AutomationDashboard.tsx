"use client"

import React from "react"

interface Props {
  isRunning: boolean
  totalJobsCount: number
  onStart: () => void
  onStop: () => void
}

export function AutomationDashboard({ isRunning, totalJobsCount, onStart, onStop }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
      <h3 style={{ color: "#3b82f6", margin: "0 0 16px 0" }}>Marketplace Automation Console</h3>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div>Engine State: <b>{isRunning ? "RUNNING" : "STOPPED"}</b></div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>Active Queue Jobs: {totalJobsCount}</div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {!isRunning ? (
            <button onClick={onStart} style={{ background: "#10b981", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Start Engine</button>
          ) : (
            <button onClick={onStop} style={{ background: "#ef4444", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Stop Engine</button>
          )}
        </div>
      </div>
    </div>
  )
}
