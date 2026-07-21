"use client"

import React from "react"

interface BrowserProfile {
  id: string
  profileName: string
  browserEngine: string
  storageLocation: string
  status: string
}

interface Props {
  profile: BrowserProfile | null
  onClose: () => void
}

export function BrowserProfileDrawer({ profile, onClose }: Props) {
  if (!profile) return null

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, width: "300px", height: "100%",
      background: "#1f2937", borderLeft: "1px solid rgba(255,255,255,0.1)",
      padding: "20px", zIndex: 100, color: "#fff", fontFamily: "sans-serif"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px" }}>
        <h4 style={{ margin: 0, color: "#60a5fa" }}>Profile Config</h4>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", fontSize: "20px", cursor: "pointer" }}>&times;</button>
      </div>
      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>Profile ID</span>
          <div style={{ fontSize: "14px", fontFamily: "monospace" }}>{profile.id}</div>
        </div>
        <div>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>Display Name</span>
          <div style={{ fontSize: "14px", fontWeight: "bold" }}>{profile.profileName}</div>
        </div>
        <div>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>Engine Target</span>
          <div style={{ fontSize: "14px" }}>{profile.browserEngine}</div>
        </div>
        <div>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>Storage URI</span>
          <div style={{ fontSize: "12px", fontFamily: "monospace", color: "#60a5fa" }}>{profile.storageLocation}</div>
        </div>
        <div>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>Status</span>
          <div style={{ fontSize: "14px" }}>{profile.status}</div>
        </div>
      </div>
    </div>
  )
}
