"use client"

import React from "react"

interface YouTubeVideo {
  id: string
  title: string
  type: string
  status: string
  scheduledFor?: Date
}

interface Props {
  videos: YouTubeVideo[]
}

export function VideoHistoryTable({ videos }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#ff0000", margin: "0 0 10px 0" }}>YouTube Video Upload Queue</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Video Title</th>
            <th style={{ padding: "8px" }}>Type</th>
            <th style={{ padding: "8px" }}>Scheduled Time</th>
            <th style={{ padding: "8px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((v) => (
            <tr key={v.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px" }}>{v.title}</td>
              <td style={{ padding: "8px" }}>
                <span style={{ fontSize: "11px", background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: "4px" }}>{v.type.toUpperCase()}</span>
              </td>
              <td style={{ padding: "8px" }}>{v.scheduledFor ? new Date(v.scheduledFor).toLocaleString() : "Immediate"}</td>
              <td style={{ padding: "8px" }}>
                <span style={{
                  fontSize: "12px",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  background: v.status === "Published" ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)",
                  color: v.status === "Published" ? "#10b981" : "#f59e0b"
                }}>{v.status}</span>
              </td>
            </tr>
          ))}
          {videos.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>No video upload history logged.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
