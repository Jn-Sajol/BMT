"use client"

import React, { useState, useEffect } from "react"

interface Props {
  inboxId: string
  originalComment: string
  initialReply: string
  onReplied: () => void
}

export function ReplyEditor({ inboxId, originalComment, initialReply, onReplied }: Props) {
  const [replyText, setReplyText] = useState("")

  useEffect(() => {
    setReplyText(initialReply)
  }, [initialReply])

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault()
    fetch("/api/comment-reply/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inboxId,
        originalComment,
        replyText,
        user: "moderator-1",
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Reply manually approved and posted!")
        onReplied()
      })
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Manual Reply Composition</h4>
      <form onSubmit={handlePost} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Selected reply content (you can edit before approving)..."
          style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", height: "80px", maxWidth: "450px" }}
        />
        <button type="submit" style={{ background: "#10b981", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", maxWidth: "200px" }}>Approve & Send Reply</button>
      </form>
    </div>
  )
}
