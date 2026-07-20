"use client"

import React from "react"

interface InstagramPost {
  id: string
  caption: string
  type: string
  status: string
  scheduledFor?: Date
}

interface Props {
  posts: InstagramPost[]
}

export function PostHistoryTable({ posts }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#e1306c", margin: "0 0 10px 0" }}>Instagram Publication Queue History</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Caption</th>
            <th style={{ padding: "8px" }}>Media Type</th>
            <th style={{ padding: "8px" }}>Scheduled Time</th>
            <th style={{ padding: "8px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px" }}>{p.caption}</td>
              <td style={{ padding: "8px" }}>
                <span style={{ fontSize: "11px", background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: "4px" }}>{p.type.toUpperCase()}</span>
              </td>
              <td style={{ padding: "8px" }}>{p.scheduledFor ? new Date(p.scheduledFor).toLocaleString() : "Immediate"}</td>
              <td style={{ padding: "8px" }}>
                <span style={{
                  fontSize: "12px",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  background: p.status === "Published" ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)",
                  color: p.status === "Published" ? "#10b981" : "#f59e0b"
                }}>{p.status}</span>
              </td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>No post history logged.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
