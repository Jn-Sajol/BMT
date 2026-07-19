"use client"

import React from "react"

interface ReportItem {
  id: string
  requestId: string
  accountId: string
  pageId?: string
  publishTime: string
  facebookPostId?: string
  status: "success" | "failed"
  failureReason?: string
  executionDurationMs: number
}

interface Props {
  reports: ReportItem[]
}

export function PublishingReport({ reports }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Publishing Reports & Audit Log</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Request ID</th>
            <th style={{ padding: "8px" }}>Page/Account</th>
            <th style={{ padding: "8px" }}>Publish Time</th>
            <th style={{ padding: "8px" }}>Facebook Post ID</th>
            <th style={{ padding: "8px" }}>Duration</th>
            <th style={{ padding: "8px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px", fontSize: "12px", fontFamily: "monospace" }}>{item.requestId}</td>
              <td style={{ padding: "8px" }}>{item.pageId || item.accountId}</td>
              <td style={{ padding: "8px" }}>{new Date(item.publishTime).toLocaleString()}</td>
              <td style={{ padding: "8px" }}>{item.facebookPostId || "N/A"}</td>
              <td style={{ padding: "8px" }}>{item.executionDurationMs}ms</td>
              <td style={{ padding: "8px" }}>
                <span style={{
                  fontSize: "12px",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  background: item.status === "success" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
                  color: item.status === "success" ? "#10b981" : "#ef4444"
                }}>{item.status}</span>
              </td>
            </tr>
          ))}
          {reports.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>No publishing history reports.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
