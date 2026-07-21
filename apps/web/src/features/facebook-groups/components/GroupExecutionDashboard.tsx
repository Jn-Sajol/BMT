"use client"

import React from "react"

interface GroupStateTransitionLog {
  jobId: string
  fromState: string
  toState: string
  timestamp: string
  reason?: string
}

interface Props {
  currentState: string
  timeline: GroupStateTransitionLog[]
  onRefresh: () => void
}

export function GroupExecutionDashboard({ currentState, timeline, onRefresh }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ color: "#10b981", margin: 0 }}>Groups Auto-Poster Execution Dashboard</h3>
        <button onClick={onRefresh} style={{ background: "#10b981", border: "none", color: "#fff", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Refresh Timeline</button>
      </div>
      <div>
        Active Execution State: <span style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", padding: "2px 8px", borderRadius: "10px", fontSize: "12px", marginLeft: "6px" }}>{currentState.toUpperCase()}</span>
      </div>
      <div style={{ marginTop: "20px" }}>
        <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px" }}>Audit Trail Tracker:</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {timeline.map((log, idx) => (
            <div key={idx} style={{ background: "rgba(255,255,255,0.03)", padding: "8px", borderRadius: "6px", fontSize: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <b>{log.fromState} ➔ {log.toState}</b>
                <span style={{ color: "#9ca3af" }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
              {log.reason && <div style={{ color: "#9ca3af", marginTop: "4px" }}>{log.reason}</div>}
            </div>
          ))}
          {timeline.length === 0 && <div style={{ color: "#9ca3af", fontStyle: "italic" }}>No active execution runs tracked.</div>}
        </div>
      </div>
    </div>
  )
}
