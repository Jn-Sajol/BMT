"use client"

import React from "react"

interface Props {
  totalChannels: number
  scheduledVideos: number
  publishedVideos: number
  totalSubscribers: number
  totalViews: number
}

export function YouTubeDashboard({ totalChannels, scheduledVideos, publishedVideos, totalSubscribers, totalViews }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
      <h3 style={{ color: "#ff0000", margin: "0 0 16px 0" }}>YouTube Marketing Console</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "16px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#ff0000" }}>{totalChannels}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>YouTube Channels</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#60a5fa" }}>{scheduledVideos}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Scheduled Uploads</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#10b981" }}>{publishedVideos}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Published Videos</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#f59e0b" }}>{totalSubscribers.toLocaleString()}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Total Subscribers</div>
        </div>
      </div>
    </div>
  )
}
