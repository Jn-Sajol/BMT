"use client"

import React from "react"

interface Props {
  totalFollowers: number
  totalFollowing: number
}

export function StatisticsPanel({ totalFollowers, totalFollowing }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#e1306c", margin: "0 0 12px 0" }}>Instagram Profile Growth Summary</h4>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#e1306c" }}>{totalFollowers}</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Total Followers</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#60a5fa" }}>{totalFollowing}</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Following Accounts</div>
        </div>
      </div>
    </div>
  )
}
