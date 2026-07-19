"use client"

import React from "react"

interface Message {
  id: string
  sender: string
  text: string
  timestamp: string
  attachmentsMetadata?: string[]
}

interface Props {
  senderName: string
  messages: Message[]
}

export function ConversationThreadPanel({ senderName, messages }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 12px 0" }}>Conversation Thread with {senderName}</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "200px", overflowY: "auto", marginBottom: "10px" }}>
        {messages.map((m) => (
          <div key={m.id} style={{ display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.02)", padding: "8px", borderRadius: "6px" }}>
            <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "bold" }}>{m.sender}</span>
            <span style={{ fontSize: "13px", marginTop: "2px" }}>{m.text}</span>
            {m.attachmentsMetadata && m.attachmentsMetadata.map((att, idx) => (
              <span key={idx} style={{ fontSize: "11px", color: "#60a5fa", marginTop: "4px" }}>📎 Attachment: {att}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
