"use client"

import React from "react"

export interface RetryJobItem {
  id: string
  jobType: string
  retryCount: number
  maxRetries: number
  lastError: string
  nextAttemptInSec: number
}

interface Props {
  retryJobs: RetryJobItem[]
}

export function AutomationRetryQueue({ retryJobs }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
      <h4 style={{ color: "#f59e0b", margin: "0 0 12px 0" }}>Retry Backoff Queue ({retryJobs.length})</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {retryJobs.map((j) => (
          <div key={j.id} style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "6px", fontSize: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <b>{j.jobType} ({j.id})</b>
              <span style={{ color: "#f59e0b" }}>Attempt {j.retryCount}/{j.maxRetries}</span>
            </div>
            <div style={{ color: "#ef4444", marginTop: "4px", fontSize: "11px" }}>Error: {j.lastError}</div>
            <div style={{ color: "#9ca3af", marginTop: "2px", fontSize: "10px" }}>Next retry attempt in ~{j.nextAttemptInSec}s</div>
          </div>
        ))}
        {retryJobs.length === 0 && <div style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "12px" }}>No jobs currently in retry backoff.</div>}
      </div>
    </div>
  )
}
