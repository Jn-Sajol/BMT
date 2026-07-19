"use client"

import React from "react"

interface DiscoveredMessengerLink {
  id: string
  groupId: string
  groupName: string
  inviteUrl: string
  memberCount: number
  messageFrequencyDaily: number
  status: string
  country: string
  language: string
  tags: string[]
  notes?: string
}

interface Props {
  linkItem: DiscoveredMessengerLink | null
  onClose: () => void
}

export function LinkDetailsDrawer({ linkItem, onClose }: Props) {
  if (!linkItem) return null

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, width: "320px", height: "100%",
      background: "#1f2937", borderLeft: "1px solid rgba(255,255,255,0.1)",
      padding: "20px", zIndex: 100, color: "#fff", fontFamily: "sans-serif"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h4 style={{ margin: 0, color: "#60a5fa" }}>Messenger Link Insights</h4>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "18px" }}>&times;</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <label style={{ fontSize: "11px", color: "#9ca3af" }}>Chat Group Name</label>
          <div style={{ fontSize: "15px", fontWeight: "bold" }}>{linkItem.groupName}</div>
        </div>
        <div>
          <label style={{ fontSize: "11px", color: "#9ca3af" }}>Invite Destination URL</label>
          <div style={{ fontSize: "12px", fontFamily: "monospace", color: "#60a5fa", wordBreak: "break-all" }}>{linkItem.inviteUrl}</div>
        </div>
        <div>
          <label style={{ fontSize: "11px", color: "#9ca3af" }}>Daily Messages Frequency</label>
          <div style={{ fontSize: "13px" }}>{linkItem.messageFrequencyDaily} messages / day</div>
        </div>
        <div>
          <label style={{ fontSize: "11px", color: "#9ca3af" }}>Niche Tags</label>
          <div style={{ display: "flex", gap: "4px", marginTop: "4px", flexWrap: "wrap" }}>
            {linkItem.tags.map((tag, idx) => (
              <span key={idx} style={{ fontSize: "10px", background: "rgba(96,165,250,0.15)", padding: "2px 6px", borderRadius: "10px", color: "#60a5fa" }}>#{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
