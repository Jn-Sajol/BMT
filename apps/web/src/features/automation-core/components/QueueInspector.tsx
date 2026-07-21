"use client"

import React from "react"

interface AutomationJob {
  id: string
  correlationId: string
  jobType: string
  status: string
  retryCount: number
}

interface Props {
  jobs: AutomationJob[]
  queueName: string
}

export function QueueInspector({ jobs, queueName }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#10b981", margin: "0 0 10px 0" }}>Pipeline Inspector: {queueName.toUpperCase()}</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Job ID</th>
            <th style={{ padding: "8px" }}>Correlation ID</th>
            <th style={{ padding: "8px" }}>Action Type</th>
            <th style={{ padding: "8px" }}>Retries</th>
            <th style={{ padding: "8px" }}>State</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px", fontFamily: "monospace", fontSize: "12px" }}>{j.id}</td>
              <td style={{ padding: "8px", fontFamily: "monospace", fontSize: "12px", color: "#9ca3af" }}>{j.correlationId}</td>
              <td style={{ padding: "8px" }}>{j.jobType}</td>
              <td style={{ padding: "8px" }}>{j.retryCount}</td>
              <td style={{ padding: "8px" }}>
                <span style={{ fontSize: "11px", background: "rgba(16,185,129,0.2)", color: "#10b981", padding: "2px 6px", borderRadius: "4px" }}>{j.status}</span>
              </td>
            </tr>
          ))}
          {jobs.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>No active jobs in this pipeline stage.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
