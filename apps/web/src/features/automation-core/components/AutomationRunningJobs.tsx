"use client"

import React from "react"

export interface RunningJobItem {
  id: string
  jobType: string
  accountId: string
  startedAt: string
  progressPercentage: number
}

interface Props {
  jobs: RunningJobItem[]
}

export function AutomationRunningJobs({ jobs }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
      <h4 style={{ color: "#10b981", margin: "0 0 12px 0" }}>Active Running Automation Jobs ({jobs.length})</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {jobs.map((j) => (
          <div key={j.id} style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: "bold", fontSize: "13px" }}>{j.jobType} <span style={{ fontSize: "11px", color: "#9ca3af" }}>({j.id})</span></div>
              <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>Account: {j.accountId} | Started: {new Date(j.startedAt).toLocaleTimeString()}</div>
            </div>
            <div style={{ width: "100px", background: "rgba(255,255,255,0.1)", height: "8px", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: `${j.progressPercentage}%`, background: "#10b981", height: "100%" }} />
            </div>
          </div>
        ))}
        {jobs.length === 0 && <div style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "12px" }}>No jobs currently executing.</div>}
      </div>
    </div>
  )
}
