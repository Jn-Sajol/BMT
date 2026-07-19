"use client"

import React from "react"

interface HistoryItem {
  id: string
  inboxId: string
  originalMessage: string
  selectedSuggestion: string
  editedMessage?: string
  user: string
  timestamp: string
}

interface Props {
  history: HistoryItem[]
}

export function ReplyHistoryTable({ history }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Manual Reply Execution History</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Original Message</th>
            <th style={{ padding: "8px" }}>Approved Reply</th>
            <th style={{ padding: "8px" }}>User</th>
            <th style={{ padding: "8px" }}>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h) => (
            <tr key={h.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px" }}>{h.originalMessage}</td>
              <td style={{ padding: "8px" }}>{h.editedMessage || h.selectedSuggestion}</td>
              <td style={{ padding: "8px" }}>{h.user}</td>
              <td style={{ padding: "8px" }}>{new Date(h.timestamp).toLocaleString()}</td>
            </tr>
          ))}
          {history.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>No replies logged in history.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
