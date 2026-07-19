"use client"

import React, { useEffect, useState } from "react"

interface CalendarEvent {
  postId: string
  groupIds: string[]
  scheduledAt: string
  status: string
}

export function GroupContentCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([])

  useEffect(() => {
    fetch("/api/facebook-groups/queue")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error loading group calendar:", err))
  }, [])

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Group Content Calendar Schedule</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {events.map((e, idx) => (
          <div key={idx} style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: "bold" }}>Post ID: {e.postId}</div>
              <div style={{ fontSize: "11px", color: "#9ca3af" }}>Target Groups Count: {e.groupIds.length} | Time: {new Date(e.scheduledAt).toLocaleString()}</div>
            </div>
            <span style={{ fontSize: "12px", padding: "2px 8px", borderRadius: "12px", background: "rgba(96,165,250,0.2)", color: "#60a5fa" }}>{e.status}</span>
          </div>
        ))}
        {events.length === 0 && <div style={{ color: "#9ca3af", fontSize: "13px" }}>No group scheduled posts.</div>}
      </div>
    </div>
  )
}
