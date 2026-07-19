"use client"

import React from "react"

interface Props {
  totalGroups: number
  savedGroups: number
  favoriteGroups: number
  collections: number
  recentSearches: number
  projects: number
}

export function HunterDashboard({ totalGroups, savedGroups, favoriteGroups, collections, recentSearches, projects }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
      <h3 style={{ color: "#60a5fa", margin: "0 0 16px 0" }}>Facebook Group Hunter Dashboard</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "16px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#60a5fa" }}>{totalGroups}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Total Discovered</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#10b981" }}>{savedGroups}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Saved Groups</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#f59e0b" }}>{favoriteGroups}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Favorites</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#a855f7" }}>{collections}</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Collections</div>
        </div>
      </div>
    </div>
  )
}
