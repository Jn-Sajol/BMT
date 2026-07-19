"use client"

import React from "react"

interface Props {
  totalLeads: number
  groupLeads: number
  linkLeads: number
  favoriteLeads: number
  totalExports: number
}

export function CollectorDashboard({ totalLeads, groupLeads, linkLeads, favoriteLeads, totalExports }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
      <h3 style={{ color: "#60a5fa", margin: "0 0 16px 0" }}>Facebook Data Collector Console</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "16px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#60a5fa" }}>{totalLeads}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Total Mined Leads</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#10b981" }}>{groupLeads}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Facebook Groups</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#f59e0b" }}>{linkLeads}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Messenger Links</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#a855f7" }}>{totalExports}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Triggered Exports</div>
        </div>
      </div>
    </div>
  )
}
