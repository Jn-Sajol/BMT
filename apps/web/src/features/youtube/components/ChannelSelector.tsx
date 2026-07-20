"use client"

import React, { useState } from "react"

interface YouTubeChannel {
  id: string
  channelId: string
  title: string
  subscriberCount: number
}

interface Props {
  channels: YouTubeChannel[]
  onLink: (channelId: string, title: string, token: string) => void
}

export function ChannelSelector({ channels, onLink }: Props) {
  const [title, setTitle] = useState("")
  const [channelId, setChannelId] = useState("")

  const handleLink = (e: React.FormEvent) => {
    e.preventDefault()
    onLink(channelId || `yt-c-${Date.now()}`, title, "mock-google-access-token")
    setTitle("")
    setChannelId("")
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px" }}>
      <h4 style={{ color: "#ff0000", margin: "0 0 12px 0" }}>YouTube Channels Linker</h4>
      <form onSubmit={handleLink} style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Channel Title (e.g. Agency Vlogs)" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", flex: 1 }} />
        <input value={channelId} onChange={(e) => setChannelId(e.target.value)} placeholder="YouTube Channel ID" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", width: "160px" }} />
        <button type="submit" style={{ background: "#ff0000", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Connect Channel</button>
      </form>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {channels.map((c) => (
          <div key={c.id} style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "6px", display: "flex", justifyContent: "space-between" }}>
            <div>
              <b>{c.title}</b>
            </div>
            <div style={{ color: "#9ca3af" }}>{c.subscriberCount.toLocaleString()} subscribers</div>
          </div>
        ))}
      </div>
    </div>
  )
}
