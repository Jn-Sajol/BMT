"use client"

import React, { useState } from "react"

interface Message {
  id: string
  senderUsername: string
  text: string
}

interface Thread {
  id: string
  participantUsername: string
  messages: Message[]
}

interface Props {
  threads: Thread[]
  onSend: (threadId: string, text: string) => void
}

export function DirectInbox({ threads, onSend }: Props) {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(threads[0]?.id || null)
  const [text, setText] = useState("")

  const activeThread = threads.find(t => t.id === selectedThreadId)

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedThreadId || !text.trim()) return
    onSend(selectedThreadId, text)
    setText("")
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px", display: "grid", gridTemplateColumns: "180px 1fr", gap: "16px", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px" }}>
      <div style={{ borderRight: "1px solid rgba(255,255,255,0.1)", paddingRight: "12px" }}>
        <h5 style={{ margin: "0 0 10px 0", color: "#e1306c" }}>Active Chats</h5>
        {threads.map(t => (
          <div
            key={t.id}
            onClick={() => setSelectedThreadId(t.id)}
            style={{ padding: "8px", background: t.id === selectedThreadId ? "rgba(225,48,108,0.2)" : "rgba(255,255,255,0.03)", borderRadius: "4px", marginBottom: "6px", cursor: "pointer", fontSize: "13px" }}
          >
            @{t.participantUsername}
          </div>
        ))}
      </div>
      <div>
        {activeThread ? (
          <div style={{ display: "flex", flexDirection: "column", height: "240px", justifyContent: "space-between" }}>
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", paddingBottom: "10px" }}>
              {activeThread.messages.map(m => (
                <div key={m.id} style={{ alignSelf: m.senderUsername === "me" ? "flex-end" : "flex-start", background: m.senderUsername === "me" ? "#e1306c" : "rgba(255,255,255,0.08)", padding: "8px 12px", borderRadius: "8px", maxWidth: "70%", fontSize: "13px" }}>
                  {m.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleSend} style={{ display: "flex", gap: "8px" }}>
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message reply..." style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", flex: 1 }} />
              <button type="submit" style={{ background: "#e1306c", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Send</button>
            </form>
          </div>
        ) : (
          <div style={{ color: "#9ca3af", fontStyle: "italic", textAlign: "center", paddingTop: "80px" }}>Select a chat conversation thread.</div>
        )}
      </div>
    </div>
  )
}
