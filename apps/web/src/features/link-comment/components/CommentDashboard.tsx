"use client"

import React from "react"

interface Props {
  totalComments: number
  linkComments: number
  reviewed: number
  pending: number
  deleted: number
  ignored: number
}

export function CommentDashboard({ totalComments, linkComments, reviewed, pending, deleted, ignored }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
      <h3 style={{ color: "#60a5fa", margin: "0 0 16px 0" }}>Link Comments Moderation Hub</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "16px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#60a5fa" }}>{totalComments}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Total Comments</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#a855f7" }}>{linkComments}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Link Comments</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#10b981" }}>{reviewed}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Reviewed</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#f59e0b" }}>{pending}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Pending</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#ef4444" }}>{deleted}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Deleted</div>
        </div>
      </div>
    </div>
  )
}
