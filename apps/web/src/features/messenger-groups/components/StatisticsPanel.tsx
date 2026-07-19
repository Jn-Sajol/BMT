"use client"

import React from "react"

interface Props {
  totalGroups: number
  totalCampaigns: number
  pendingCampaigns: number
  completedCampaigns: number
}

export function StatisticsPanel({ totalGroups, totalCampaigns, pendingCampaigns, completedCampaigns }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 12px 0" }}>Messenger Group Analytics Summary</h4>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#60a5fa" }}>{totalGroups}</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Synced Groups</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#a855f7" }}>{totalCampaigns}</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Total Campaigns</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#f59e0b" }}>{pendingCampaigns}</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Scheduled Blasts</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#10b981" }}>{completedCampaigns}</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Sent Blasts</div>
        </div>
      </div>
    </div>
  )
}
