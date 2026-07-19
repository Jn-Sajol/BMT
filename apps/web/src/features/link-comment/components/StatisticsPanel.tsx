"use client"

import React from "react"

interface Props {
  totalComments: number
  linkComments: number
  reviewed: number
  pending: number
}

export function StatisticsPanel({ totalComments, linkComments, reviewed, pending }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 12px 0" }}>Comments Analytics Summary</h4>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#60a5fa" }}>{totalComments}</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Total Comments</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#a855f7" }}>{linkComments}</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Link Comments</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#10b981" }}>{reviewed}</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Reviewed</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#f59e0b" }}>{pending}</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Pending Action</div>
        </div>
      </div>
    </div>
  )
}
