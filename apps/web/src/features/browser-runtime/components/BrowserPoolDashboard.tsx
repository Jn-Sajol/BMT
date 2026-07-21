"use client"

import React from "react"

interface BrowserInstance {
  id: string
  profileId: string
  status: string
  memoryUsageMb: number
  cpuPercentage: number
}

interface Props {
  instances: BrowserInstance[]
  onStart: (profileId: string) => void
  onStop: (id: string) => void
}

export function BrowserPoolDashboard({ instances, onStart, onStop }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
      <h3 style={{ color: "#60a5fa", margin: "0 0 16px 0" }}>Active Browser Pool Dashboard</h3>
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        <button onClick={() => onStart("prof-1")} style={{ background: "#10b981", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Launch Browser Instance</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {instances.map((ins) => (
          <div key={ins.id} style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <b>Instance ID: {ins.id}</b>
              <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>Profile: {ins.profileId} | Status: {ins.status}</div>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "11px", background: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: "4px" }}>RAM: {ins.memoryUsageMb}MB | CPU: {ins.cpuPercentage}%</span>
              <button onClick={() => onStop(ins.id)} style={{ background: "#ef4444", border: "none", color: "#fff", padding: "4px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>Stop</button>
            </div>
          </div>
        ))}
        {instances.length === 0 && <div style={{ color: "#9ca3af", fontStyle: "italic", textAlign: "center" }}>No active browser processes in the pool.</div>}
      </div>
    </div>
  )
}
