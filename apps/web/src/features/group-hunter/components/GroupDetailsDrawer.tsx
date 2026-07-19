"use client"

import React from "react"

interface DiscoveredGroup {
  id: string
  groupId: string
  name: string
  description: string
  memberCount: number
  privacy: string
  language: string
  country: string
  tags: string[]
  notes?: string
}

interface Props {
  group: DiscoveredGroup | null
  onClose: () => void
}

export function GroupDetailsDrawer({ group, onClose }: Props) {
  if (!group) return null

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, width: "320px", height: "100%",
      background: "#1f2937", borderLeft: "1px solid rgba(255,255,255,0.1)",
      padding: "20px", zIndex: 100, color: "#fff", fontFamily: "sans-serif"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h4 style={{ margin: 0, color: "#60a5fa" }}>FB Group Hunter Insights</h4>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "18px" }}>&times;</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <label style={{ fontSize: "11px", color: "#9ca3af" }}>Group Name</label>
          <div style={{ fontSize: "15px", fontWeight: "bold" }}>{group.name}</div>
        </div>
        <div>
          <label style={{ fontSize: "11px", color: "#9ca3af" }}>FB Group ID</label>
          <div style={{ fontSize: "13px", fontFamily: "monospace" }}>{group.groupId}</div>
        </div>
        <div>
          <label style={{ fontSize: "11px", color: "#9ca3af" }}>About Group</label>
          <div style={{ fontSize: "13px" }}>{group.description}</div>
        </div>
        <div>
          <label style={{ fontSize: "11px", color: "#9ca3af" }}>Custom Tags</label>
          <div style={{ display: "flex", gap: "4px", marginTop: "4px", flexWrap: "wrap" }}>
            {group.tags.map((tag, idx) => (
              <span key={idx} style={{ fontSize: "10px", background: "rgba(96,165,250,0.15)", padding: "2px 6px", borderRadius: "10px", color: "#60a5fa" }}>#{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
