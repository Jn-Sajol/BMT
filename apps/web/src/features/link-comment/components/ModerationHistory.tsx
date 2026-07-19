"use client"

import React from "react"

interface HistoryItem {
  id: string
  commentId: string
  action: string
  moderator: string
  timestamp: string
  reason?: string
}

interface Props {
  history: HistoryItem[]
}

export function ModerationHistory({ history }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Moderation Actions History Audits</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Comment ID</th>
            <th style={{ padding: "8px" }}>Action</th>
            <th style={{ padding: "8px" }}>Moderated By</th>
            <th style={{ padding: "8px" }}>Time</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h) => (
            <tr key={h.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px", fontSize: "12px", fontFamily: "monospace" }}>{h.commentId}</td>
              <td style={{ padding: "8px" }}>{h.action}</td>
              <td style={{ padding: "8px" }}>{h.moderator}</td>
              <td style={{ padding: "8px" }}>{new Date(h.timestamp).toLocaleString()}</td>
            </tr>
          ))}
          {history.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>No moderation actions logged.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
