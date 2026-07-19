"use client"

import React from "react"

interface HistoryItem {
  id: string
  campaignId: string
  groupIds: string[]
  user: string
  sentTime: string
  status: string
}

interface Props {
  history: HistoryItem[]
}

export function CampaignHistoryTable({ history }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Manual Send Campaigns History</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Campaign ID</th>
            <th style={{ padding: "8px" }}>Target Groups</th>
            <th style={{ padding: "8px" }}>Executed By</th>
            <th style={{ padding: "8px" }}>Dispatch Time</th>
            <th style={{ padding: "8px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h) => (
            <tr key={h.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px", fontSize: "12px", fontFamily: "monospace" }}>{h.campaignId}</td>
              <td style={{ padding: "8px" }}>{h.groupIds.length} groups</td>
              <td style={{ padding: "8px" }}>{h.user}</td>
              <td style={{ padding: "8px" }}>{new Date(h.sentTime).toLocaleString()}</td>
              <td style={{ padding: "8px" }}>
                <span style={{ fontSize: "12px", padding: "2px 8px", borderRadius: "12px", background: "rgba(16,185,129,0.2)", color: "#10b981" }}>{h.status}</span>
              </td>
            </tr>
          ))}
          {history.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>No group messaging dispatch history.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
