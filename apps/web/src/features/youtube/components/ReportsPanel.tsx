"use client"

import React from "react"

interface YouTubeReport {
  id: string
  channelId: string
  totalVideos: number
  totalViews: number
  watchTimeHours: number
  subscriberGrowth: number
}

interface Props {
  reports: YouTubeReport[]
}

export function ReportsPanel({ reports }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#ff0000", margin: "0 0 10px 0" }}>YouTube Channel Growth Reports</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Channel ID</th>
            <th style={{ padding: "8px" }}>Uploaded Videos</th>
            <th style={{ padding: "8px" }}>Total Views</th>
            <th style={{ padding: "8px" }}>Watch Time (hrs)</th>
            <th style={{ padding: "8px" }}>Sub Growth</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px", fontFamily: "monospace", fontSize: "12px" }}>{r.channelId}</td>
              <td style={{ padding: "8px" }}>{r.totalVideos}</td>
              <td style={{ padding: "8px" }}>{r.totalViews.toLocaleString()}</td>
              <td style={{ padding: "8px" }}>{r.watchTimeHours.toLocaleString()}</td>
              <td style={{ padding: "8px", color: "#10b981", fontWeight: "bold" }}>+{r.subscriberGrowth}</td>
            </tr>
          ))}
          {reports.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>No channel performance reports compiled.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
