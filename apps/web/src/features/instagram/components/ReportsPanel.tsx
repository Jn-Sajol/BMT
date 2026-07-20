"use client"

import React from "react"

interface InstagramReport {
  id: string
  profileId: string
  totalPosts: number
  totalImpressions: number
  totalReach: number
  totalEngagement: number
  followerGrowth: number
}

interface Props {
  reports: InstagramReport[]
}

export function ReportsPanel({ reports }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#e1306c", margin: "0 0 10px 0" }}>Instagram Profile Performance Reports</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Profile ID</th>
            <th style={{ padding: "8px" }}>Total Posts</th>
            <th style={{ padding: "8px" }}>Impressions</th>
            <th style={{ padding: "8px" }}>Reach</th>
            <th style={{ padding: "8px" }}>Engagement</th>
            <th style={{ padding: "8px" }}>Follower Growth</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px", fontFamily: "monospace", fontSize: "12px" }}>{r.profileId}</td>
              <td style={{ padding: "8px" }}>{r.totalPosts}</td>
              <td style={{ padding: "8px" }}>{r.totalImpressions.toLocaleString()}</td>
              <td style={{ padding: "8px" }}>{r.totalReach.toLocaleString()}</td>
              <td style={{ padding: "8px" }}>{r.totalEngagement.toLocaleString()}</td>
              <td style={{ padding: "8px", color: "#10b981", fontWeight: "bold" }}>+{r.followerGrowth}</td>
            </tr>
          ))}
          {reports.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>No performance reports compiled.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
