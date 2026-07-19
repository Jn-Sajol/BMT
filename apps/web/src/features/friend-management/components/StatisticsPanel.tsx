"use client"

import React from "react"

interface Props {
  totalFriends: number
  pendingRequests: number
  acceptedRequests: number
  inactiveFriends: number
}

export function StatisticsPanel({ totalFriends, pendingRequests, acceptedRequests, inactiveFriends }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 12px 0" }}>Friend Connections Analytics Summary</h4>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#60a5fa" }}>{totalFriends}</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Active Friends</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#f59e0b" }}>{pendingRequests}</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Pending Requests</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#10b981" }}>{acceptedRequests}</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Accepted Requests</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ef4444" }}>{inactiveFriends}</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Inactive friends</div>
        </div>
      </div>
    </div>
  )
}
