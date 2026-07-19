"use client"

import React from "react"

interface Props {
  totalFriends: number
  pendingRequests: number
  acceptedRequests: number
  inactiveFriends: number
}

export function FriendDashboard({ totalFriends, pendingRequests, acceptedRequests, inactiveFriends }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
      <h3 style={{ color: "#60a5fa", margin: "0 0 16px 0" }}>Facebook Friend Management Hub</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#60a5fa" }}>{totalFriends}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Total Friends</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#f59e0b" }}>{pendingRequests}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Pending Requests</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#10b981" }}>{acceptedRequests}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Accepted Requests</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#ef4444" }}>{inactiveFriends}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Inactive Friends</div>
        </div>
      </div>
    </div>
  )
}
