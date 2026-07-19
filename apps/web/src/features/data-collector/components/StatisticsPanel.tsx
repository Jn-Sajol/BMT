"use client"

import React from "react"

interface Props {
  totalLeads: number
  groupLeads: number
  linkLeads: number
  favoriteLeads: number
}

export function StatisticsPanel({ totalLeads, groupLeads, linkLeads, favoriteLeads }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 12px 0" }}>Extractor Lead Mining Summary</h4>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#60a5fa" }}>{totalLeads}</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Total Leads</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#10b981" }}>{groupLeads}</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Group Channels</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#f59e0b" }}>{linkLeads}</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Messenger Links</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#a855f7" }}>{favoriteLeads}</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Favorite Saved</div>
        </div>
      </div>
    </div>
  )
}
