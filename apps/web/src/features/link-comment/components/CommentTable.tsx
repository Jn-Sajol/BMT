"use client"

import React from "react"

interface LinkComment {
  id: string
  postId: string
  author: { name: string }
  text: string
  detectedLinks: string[]
  status: string
}

interface Props {
  comments: LinkComment[]
  onSelect: (item: LinkComment) => void
}

export function CommentTable({ comments, onSelect }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Comments with Links Moderation Queue</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Author</th>
            <th style={{ padding: "8px" }}>Comment Context</th>
            <th style={{ padding: "8px" }}>Detected Links</th>
            <th style={{ padding: "8px" }}>Status</th>
            <th style={{ padding: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px", fontWeight: "bold" }}>{item.author.name}</td>
              <td style={{ padding: "8px" }}>{item.text}</td>
              <td style={{ padding: "8px", color: "#60a5fa" }}>
                {item.detectedLinks.map((l, idx) => (
                  <div key={idx} style={{ fontSize: "11px", textDecoration: "underline" }}>{l}</div>
                ))}
              </td>
              <td style={{ padding: "8px" }}>
                <span style={{
                  fontSize: "12px",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  background: item.status === "Deleted" ? "rgba(239,68,68,0.2)" : item.status === "Approved" ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)",
                  color: item.status === "Deleted" ? "#ef4444" : item.status === "Approved" ? "#10b981" : "#f59e0b"
                }}>{item.status}</span>
              </td>
              <td style={{ padding: "8px" }}>
                <button
                  onClick={() => onSelect(item)}
                  style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
                >
                  Review
                </button>
              </td>
            </tr>
          ))}
          {comments.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>No link comments found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
