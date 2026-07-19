"use client"

import React from "react"

interface InboxItem {
  id: string
  fbPostId: string
  commentId: string
  authorName: string
  content: string
  status: "Pending" | "Replied" | "Archived"
}

interface Props {
  inbox: InboxItem[]
  onSelect: (item: InboxItem) => void
}

export function CommentInboxTable({ inbox, onSelect }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Comment Reply Inbox</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Author</th>
            <th style={{ padding: "8px" }}>Original Comment</th>
            <th style={{ padding: "8px" }}>Status</th>
            <th style={{ padding: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inbox.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px", fontWeight: "bold" }}>{item.authorName}</td>
              <td style={{ padding: "8px" }}>{item.content}</td>
              <td style={{ padding: "8px" }}>
                <span style={{
                  fontSize: "12px",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  background: item.status === "Replied" ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)",
                  color: item.status === "Replied" ? "#10b981" : "#f59e0b"
                }}>{item.status}</span>
              </td>
              <td style={{ padding: "8px" }}>
                <button
                  onClick={() => onSelect(item)}
                  style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
                >
                  Open Thread
                </button>
              </td>
            </tr>
          ))}
          {inbox.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>Inbox is empty.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
