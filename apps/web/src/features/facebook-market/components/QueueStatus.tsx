"use client"

import React from "react"

interface AutomationJob {
  id: string
  title: string
  status: string
  timestamp: string
}

interface Props {
  jobs: AutomationJob[]
}

export function QueueStatus({ jobs }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#3b82f6", margin: "0 0 10px 0" }}>Automation Queue Pipelines</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {jobs.map((j) => (
          <div key={j.id} style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "6px", display: "flex", justifyContent: "space-between" }}>
            <div>
              <b>{j.title}</b>
              <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>Job ID: {j.id}</div>
            </div>
            <span style={{ fontSize: "12px", background: "rgba(59,130,246,0.15)", color: "#3b82f6", padding: "2px 8px", borderRadius: "10px", alignSelf: "center" }}>
              {j.status}
            </span>
          </div>
        ))}
        {jobs.length === 0 && <div style={{ color: "#9ca3af", fontStyle: "italic" }}>No active queue runs.</div>}
      </div>
    </div>
  )
}
