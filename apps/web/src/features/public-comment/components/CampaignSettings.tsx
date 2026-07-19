"use client"

import React, { useState } from "react"

export function CampaignSettings() {
  const [maxDailyComments, setMaxDailyComments] = useState(50)
  const [retryIntervalMinutes, setRetryIntervalMinutes] = useState(30)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Centralized comment settings saved. Max Daily limit: ${maxDailyComments}`)
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Global Post commenting thresholds</h4>
      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "350px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <label style={{ fontSize: "14px" }}>Max Daily Comments per Profile:</label>
          <input type="number" value={maxDailyComments} onChange={(e) => setMaxDailyComments(Number(e.target.value))} style={{ background: "#2d3748", border: "none", color: "#fff", padding: "6px", borderRadius: "4px", width: "80px" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <label style={{ fontSize: "14px" }}>Retry on Graph Limit Failure (mins):</label>
          <input type="number" value={retryIntervalMinutes} onChange={(e) => setRetryIntervalMinutes(Number(e.target.value))} style={{ background: "#2d3748", border: "none", color: "#fff", padding: "6px", borderRadius: "4px", width: "80px" }} />
        </div>
        <button type="submit" style={{ background: "#10b981", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Save Settings</button>
      </form>
    </div>
  )
}
