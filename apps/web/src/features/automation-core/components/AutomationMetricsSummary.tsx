"use client"

import React from "react"

interface Props {
  totalJobsProcessed: number
  avgQueueWaitMs: number
  avgExecutionDurationMs: number
  avgPacingDelayMs: number
  failureRatePercentage: number
  retryRatePercentage: number
}

export function AutomationMetricsSummary({
  totalJobsProcessed,
  avgQueueWaitMs,
  avgExecutionDurationMs,
  avgPacingDelayMs,
  failureRatePercentage,
  retryRatePercentage
}: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
      <h4 style={{ color: "#10b981", margin: "0 0 12px 0" }}>Automation Metrics Summary</h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", textAlign: "center" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>{totalJobsProcessed}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Jobs Processed</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>{avgExecutionDurationMs}ms</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Avg Exec Duration</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#3b82f6" }}>{avgPacingDelayMs}ms</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Avg Pacing Delay</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: failureRatePercentage > 10 ? "#ef4444" : "#10b981" }}>
            {failureRatePercentage}%
          </div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Failure Rate</span>
        </div>
      </div>
    </div>
  )
}
