"use client"

import React from "react"

export interface DelayedJobItem {
  id: string
  jobType: string
  reason: string
  resumeAt: string
}

interface Props {
  delayedJobs: DelayedJobItem[]
}

export function AutomationDelayedJobs({ delayedJobs }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
      <h4 style={{ color: "#3b82f6", margin: "0 0 12px 0" }}>HBF Delayed & Paced Jobs ({delayedJobs.length})</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {delayedJobs.map((j) => (
          <div key={j.id} style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "6px", fontSize: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <b>{j.jobType} ({j.id})</b>
              <span style={{ color: "#3b82f6" }}>Resume at {new Date(j.resumeAt).toLocaleTimeString()}</span>
            </div>
            <div style={{ color: "#9ca3af", marginTop: "4px", fontSize: "11px" }}>Reason: {j.reason}</div>
          </div>
        ))}
        {delayedJobs.length === 0 && <div style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "12px" }}>No jobs held in pacing delays.</div>}
      </div>
    </div>
  )
}
