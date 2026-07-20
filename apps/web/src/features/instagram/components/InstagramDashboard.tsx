"use client"

import React from "react"

interface Props {
  totalProfiles: number
  scheduledPosts: number
  publishedPosts: number
  inboxThreads: number
  totalFollowers: number
}

export function InstagramDashboard({ totalProfiles, scheduledPosts, publishedPosts, inboxThreads, totalFollowers }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
      <h3 style={{ color: "#e1306c", margin: "0 0 16px 0" }}>Instagram Marketing Console</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "16px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#e1306c" }}>{totalProfiles}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>IG Profiles Linked</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#60a5fa" }}>{scheduledPosts}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Scheduled Posts</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#10b981" }}>{publishedPosts}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Published Feed</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#f59e0b" }}>{inboxThreads}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Inbox Threads</div>
        </div>
      </div>
    </div>
  )
}
