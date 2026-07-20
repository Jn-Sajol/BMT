"use client"

import React, { useState } from "react"

interface InstagramProfile {
  id: string
  username: string
  fullName: string
  followerCount: number
}

interface Props {
  profiles: InstagramProfile[]
  onLink: (igUserId: string, username: string, pageId: string, token: string) => void
}

export function AccountSelector({ profiles, onLink }: Props) {
  const [username, setUsername] = useState("")
  const [igUserId, setIgUserId] = useState("")

  const handleLink = (e: React.FormEvent) => {
    e.preventDefault()
    onLink(igUserId || `ig-u-${Date.now()}`, username, "fb-page-mock-id", "mock-access-token")
    setUsername("")
    setIgUserId("")
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px" }}>
      <h4 style={{ color: "#e1306c", margin: "0 0 12px 0" }}>Instagram Accounts Linker</h4>
      <form onSubmit={handleLink} style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Instagram Username (e.g. travel_ig)" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", flex: 1 }} />
        <input value={igUserId} onChange={(e) => setIgUserId(e.target.value)} placeholder="Instagram User ID" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", width: "160px" }} />
        <button type="submit" style={{ background: "#e1306c", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Connect Account</button>
      </form>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {profiles.map((p) => (
          <div key={p.id} style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "6px", display: "flex", justifyContent: "space-between" }}>
            <div>
              <b>@{p.username}</b> ({p.fullName})
            </div>
            <div style={{ color: "#9ca3af" }}>{p.followerCount.toLocaleString()} followers</div>
          </div>
        ))}
      </div>
    </div>
  )
}
