"use client"

import React from "react"

interface FriendProfile {
  id: string
  name: string
  category: string
  status: string
  lastInteractionAt: string
}

interface Props {
  friend: FriendProfile | null
  onClose: () => void
}

export function FriendProfileDrawer({ friend, onClose }: Props) {
  if (!friend) return null

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, width: "320px", height: "100%",
      background: "#1f2937", borderLeft: "1px solid rgba(255,255,255,0.1)",
      padding: "20px", zIndex: 100, color: "#fff", fontFamily: "sans-serif"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h4 style={{ margin: 0, color: "#60a5fa" }}>Connection Overview</h4>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "18px" }}>&times;</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <label style={{ fontSize: "11px", color: "#9ca3af" }}>Name</label>
          <div style={{ fontSize: "16px", fontWeight: "bold" }}>{friend.name}</div>
        </div>
        <div>
          <label style={{ fontSize: "11px", color: "#9ca3af" }}>Niche Tag Category</label>
          <div style={{ fontSize: "14px" }}>{friend.category}</div>
        </div>
        <div>
          <label style={{ fontSize: "11px", color: "#9ca3af" }}>Interaction Status</label>
          <div style={{ fontSize: "14px" }}>{friend.status}</div>
        </div>
        <div>
          <label style={{ fontSize: "11px", color: "#9ca3af" }}>Last Active interaction</label>
          <div style={{ fontSize: "14px" }}>{new Date(friend.lastInteractionAt).toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}
