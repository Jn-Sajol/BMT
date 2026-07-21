"use client"

import React from "react"

interface CommentJob {
  id: string
  status: string
  message: string
}

interface Props {
  jobs: CommentJob[]
}

export function CommentQueueStatus({ jobs }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#10b981", margin: "0 0 10px 0" }}>Comment Queue Status</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {jobs.map((j) => (
          <div key={j.id} style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "6px", display: "flex", justifyContent: "space-between" }}>
            <div>
              <b>Comment ID: {j.id}</b>
              <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>Msg preview: "{j.message}"</div>
            </div>
            <span style={{ fontSize: "12px", background: "rgba(16,185,129,0.15)", color: "#10b981", padding: "2px 8px", borderRadius: "10px", alignSelf: "center" }}>
              {j.status}
            </span>
          </div>
        ))}
        {jobs.length === 0 && <div style={{ color: "#9ca3af", fontStyle: "italic" }}>No active queue runs.</div>}
      </div>
    </div>
  )
}
