"use client"

import React, { useState } from "react"

interface Props {
  selectedGroupIds: string[]
  onScheduled: () => void
}

export function GroupPostScheduler({ selectedGroupIds, onScheduled }: Props) {
  const [postId, setPostId] = useState("")
  const [scheduledAt, setScheduledAt] = useState("")
  const [delayMinutes, setDelayMinutes] = useState<5 | 8 | 10 | 15>(10)

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault()
    fetch("/api/facebook-groups/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId,
        groupIds: selectedGroupIds,
        scheduledAt,
        delayMinutes,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(`Group schedule registered. ID: ${data.id}`)
        onScheduled()
      })
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 12px 0" }}>Schedule Master Post to selected Groups</h4>
      <form onSubmit={handleSchedule} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "450px" }}>
        <input value={postId} onChange={(e) => setPostId(e.target.value)} placeholder="Master Post ID" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <div>
          <label style={{ marginRight: "10px", fontSize: "14px" }}>Random Anti-Spam Posting Delay:</label>
          <select value={delayMinutes} onChange={(e) => setDelayMinutes(Number(e.target.value) as any)} style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }}>
            <option value={5}>5 Minutes</option>
            <option value={8}>8 Minutes</option>
            <option value={10}>10 Minutes</option>
            <option value={15}>15 Minutes</option>
          </select>
        </div>
        <button type="submit" style={{ background: "#3b82f6", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Register Group Schedule</button>
      </form>
    </div>
  )
}
