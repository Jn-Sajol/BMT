"use client"

import React from "react"

interface FriendActivity {
  id: string
  friendId: string
  action: string
  user: string
  timestamp: string
}

interface Props {
  activities: FriendActivity[]
}

export function ActivityTimeline({ activities }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Friend Actions Activity Timeline</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {activities.map((a) => (
          <div key={a.id} style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "6px" }}>
            <span style={{ fontSize: "11px", color: "#9ca3af" }}>{new Date(a.timestamp).toLocaleString()}</span>
            <div style={{ fontSize: "13px", marginTop: "2px" }}>
              Action <b>{a.action}</b> on Friend ID {a.friendId} executed by <i>{a.user}</i>.
            </div>
          </div>
        ))}
        {activities.length === 0 && <div style={{ color: "#9ca3af", fontSize: "13px" }}>No friend activities logged.</div>}
      </div>
    </div>
  )
}
