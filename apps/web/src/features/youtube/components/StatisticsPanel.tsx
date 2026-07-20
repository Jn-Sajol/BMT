"use client"

import React from "react"

interface Props {
  totalSubscribers: number
  totalViews: number
}

export function StatisticsPanel({ totalSubscribers, totalViews }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#ff0000", margin: "0 0 12px 0" }}>YouTube Analytics Channel Summary</h4>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ff0000" }}>{totalSubscribers.toLocaleString()}</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Total Subscribers</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#60a5fa" }}>{totalViews.toLocaleString()}</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Lifetime Views</div>
        </div>
      </div>
    </div>
  )
}
