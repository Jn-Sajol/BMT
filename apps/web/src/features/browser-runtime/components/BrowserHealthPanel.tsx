"use client"

import React from "react"

interface HealthMetricReport {
  instanceId: string
  status: string
  memoryUsageMb: number
  cpuPercentage: number
  recommendation: string
}

interface Props {
  reports: HealthMetricReport[]
  onRecover: (id: string) => void
}

export function BrowserHealthPanel({ reports, onRecover }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Browser System Health Metrics</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {reports.map((r) => (
          <div key={r.instanceId} style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "6px", display: "flex", justifyContent: "space-between" }}>
            <div>
              <b>Instance ID: {r.instanceId}</b>
              <div style={{ fontSize: "12px", color: r.status === "Crashed" ? "#ef4444" : "#10b981", marginTop: "2px" }}>Status: {r.status}</div>
              <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>RAM: {r.memoryUsageMb}MB | CPU: {r.cpuPercentage}%</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
              <span style={{ fontSize: "11px", background: r.recommendation === "KeepRunning" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: r.recommendation === "KeepRunning" ? "#10b981" : "#ef4444", padding: "2px 8px", borderRadius: "4px" }}>
                {r.recommendation}
              </span>
              {r.status === "Crashed" && (
                <button onClick={() => onRecover(r.instanceId)} style={{ background: "#eab308", border: "none", color: "#000", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontSize: "11px", fontWeight: "bold" }}>
                  Recover Instance
                </button>
              )}
            </div>
          </div>
        ))}
        {reports.length === 0 && <div style={{ color: "#9ca3af", fontSize: "13px" }}>No running browsers metrics to report.</div>}
      </div>
    </div>
  )
}
