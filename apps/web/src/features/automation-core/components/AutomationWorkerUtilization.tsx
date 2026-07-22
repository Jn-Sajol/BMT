"use client"

import React from "react"

interface Props {
  activeWorkers: number
  totalCapacity: number
  utilizationPercentage: number
  avgCpuUsagePercent: number
  avgMemoryUsageMb: number
}

export function AutomationWorkerUtilization({
  activeWorkers,
  totalCapacity,
  utilizationPercentage,
  avgCpuUsagePercent,
  avgMemoryUsageMb
}: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
      <h4 style={{ color: "#10b981", margin: "0 0 12px 0" }}>Worker Pool Utilization</h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", textAlign: "center" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>{activeWorkers}/{totalCapacity}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Active Workers</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#10b981" }}>{utilizationPercentage}%</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Utilization</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>{avgCpuUsagePercent}% CPU / {avgMemoryUsageMb}MB</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Resource Load</span>
        </div>
      </div>
    </div>
  )
}
