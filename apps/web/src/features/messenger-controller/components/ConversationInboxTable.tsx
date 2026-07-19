"use client"

import React from "react"

interface InboxItem {
  id: string
  fbConversationId: string
  senderName: string
  lastMessageText: string
  status: "Pending" | "Replied" | "Archived"
  category: string
}

interface Props {
  inbox: InboxItem[]
  onSelect: (item: InboxItem) => void
}

export function ConversationInboxTable({ inbox, onSelect }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Messenger Conversation Inbox</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Sender</th>
            <th style={{ padding: "8px" }}>Last Message</th>
            <th style={{ padding: "8px" }}>Category</th>
            <th style={{ padding: "8px" }}>Status</th>
            <th style={{ padding: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inbox.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px", fontWeight: "bold" }}>{item.senderName}</td>
              <td style={{ padding: "8px" }}>{item.lastMessageText}</td>
              <td style={{ padding: "8px" }}>{item.category}</td>
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
                  View Chat
                </button>
              </td>
            </tr>
          ))}
          {inbox.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>Inbox is empty.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
