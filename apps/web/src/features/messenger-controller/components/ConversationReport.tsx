"use client"

import React from "react"

interface ReportItem {
  id: string
  totalInboxCount: number
  repliesApprovedCount: number
  repliesSentCount: number
  averageResponseTimeSeconds: number
  categoryDistribution: Record<string, number>
}

interface Props {
  reports: ReportItem[]
}

export function ConversationReport({ reports }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Conversation Efficiency Reports & Status</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Total Chats</th>
            <th style={{ padding: "8px" }}>Approved Replies</th>
            <th style={{ padding: "8px" }}>Sent Replies</th>
            <th style={{ padding: "8px" }}>Average Response Time</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px" }}>{r.totalInboxCount}</td>
              <td style={{ padding: "8px" }}>{r.repliesApprovedCount}</td>
              <td style={{ padding: "8px" }}>{r.repliesSentCount}</td>
              <td style={{ padding: "8px" }}>{r.averageResponseTimeSeconds} Seconds</td>
            </tr>
          ))}
          {reports.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>No conversation reports compiled yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
