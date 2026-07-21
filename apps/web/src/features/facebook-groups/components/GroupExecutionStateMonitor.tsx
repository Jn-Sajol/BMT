"use client"

import React from "react"

interface Props {
  status: string
  activeQueue: string
  onCancel: () => void
}

export function GroupExecutionStateMonitor({ status, activeQueue, onCancel }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)", marginTop: "20px" }}>
      <h4 style={{ color: "#10b981", margin: "0 0 12px 0" }}>Group Auto-Poster Execution Status</h4>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div>Job Status: <b>{status}</b></div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>Active Queue Pipeline: {activeQueue}</div>
        </div>
        <button
          onClick={onCancel}
          style={{ background: "#ef4444", border: "none", color: "#fff", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}
        >
          Cancel Job
        </button>
      </div>
    </div>
  )
}
