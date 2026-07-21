"use client"

import React from "react"

interface Props {
  preparationSize: number
  schedulerSize: number
  executionSize: number
  dlqSize: number
  uptimeSeconds: number
}

export function MetricsDashboard({ preparationSize, schedulerSize, executionSize, dlqSize, uptimeSeconds }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
      <h3 style={{ color: "#10b981", margin: "0 0 16px 0" }}>Automation Core Controller</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "16px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#60a5fa" }}>{preparationSize}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Prep Queue</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#f59e0b" }}>{schedulerSize}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Scheduler Queue</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#10b981" }}>{executionSize}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Execution Pool</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#ef4444" }}>{dlqSize}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Dead Letters (DLQ)</div>
        </div>
      </div>
      <div style={{ marginTop: "12px", fontSize: "12px", color: "#9ca3af" }}>
        Engine Uptime: {Math.floor(uptimeSeconds / 60)}m {Math.floor(uptimeSeconds % 60)}s
      </div>
    </div>
  )
}
