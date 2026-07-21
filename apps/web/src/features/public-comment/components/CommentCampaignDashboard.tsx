"use client"

import React from "react"

interface Props {
  totalCampaigns: number
  activeCampaigns: number
  failedCampaigns: number
  onStartCampaign: () => void
}

export function CommentCampaignDashboard({ totalCampaigns, activeCampaigns, failedCampaigns, onStartCampaign }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ color: "#10b981", margin: 0 }}>Public Comment Assistant Dashboard</h3>
        <button onClick={onStartCampaign} style={{ background: "#10b981", border: "none", color: "#fff", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Start Campaign</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", textAlign: "center" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>{totalCampaigns}</div>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>Total Campaigns</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#10b981" }}>{activeCampaigns}</div>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>Active Campaigns</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#ef4444" }}>{failedCampaigns}</div>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>Failed Campaigns</span>
        </div>
      </div>
    </div>
  )
}
