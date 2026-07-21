"use client"

import React from "react"

interface StateTransitionLog {
  jobId: string
  fromState: string
  toState: string
  timestamp: string
  notes?: string
}

interface Props {
  currentState: string
  timeline: StateTransitionLog[]
}

export function ExecutionStateMonitor({ currentState, timeline }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px" }}>
      <h4 style={{ color: "#3b82f6", margin: "0 0 12px 0" }}>Job Execution State Monitor</h4>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <span>Current State:</span>
        <span style={{ fontSize: "12px", background: "rgba(59,130,246,0.15)", color: "#3b82f6", padding: "4px 10px", borderRadius: "10px", fontWeight: "bold" }}>
          {currentState.toUpperCase()}
        </span>
      </div>
      <div style={{ fontSize: "13px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px" }}>
        <span style={{ color: "#9ca3af", display: "block", marginBottom: "8px" }}>Audit Trail History:</span>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {timeline.map((log, idx) => (
            <div key={idx} style={{ background: "rgba(255,255,255,0.03)", padding: "8px", borderRadius: "6px", fontSize: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <b>{log.fromState} ➔ {log.toState}</b>
                <span style={{ color: "#9ca3af" }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
              {log.notes && <div style={{ color: "#9ca3af", marginTop: "4px" }}>{log.notes}</div>}
            </div>
          ))}
          {timeline.length === 0 && <div style={{ color: "#9ca3af", fontStyle: "italic" }}>No transition logs recorded.</div>}
        </div>
      </div>
    </div>
  )
}
