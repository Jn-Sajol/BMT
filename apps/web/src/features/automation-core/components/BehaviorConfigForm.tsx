"use client"

import React, { useState } from "react"

interface Props {
  onSave: (config: any) => void
}

export function BehaviorConfigForm({ onSave }: Props) {
  const [startHour, setStartHour] = useState(9)
  const [endHour, setEndHour] = useState(17)
  const [minCooldown, setMinCooldown] = useState(5)
  const [minDelay, setMinDelay] = useState(1)
  const [maxDelay, setMaxDelay] = useState(5)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      workingHours: { startHour, endHour },
      minCooldownMinutes: minCooldown,
      randomDelayRange: { minSeconds: minDelay, maxSeconds: maxDelay }
    })
    alert("HBF timing parameters updated successfully!")
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px" }}>
      <h4 style={{ color: "#10b981", margin: "0 0 12px 0" }}>HBF Timing & Pacing Configuration</h4>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "4px" }}>Start Hour (0-23)</label>
            <input type="number" value={startHour} onChange={(e) => setStartHour(Number(e.target.value))} style={{ width: "100%", background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} min={0} max={23} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "4px" }}>End Hour (0-23)</label>
            <input type="number" value={endHour} onChange={(e) => setEndHour(Number(e.target.value))} style={{ width: "100%", background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} min={0} max={23} />
          </div>
        </div>
        <div>
          <label style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "4px" }}>Min Cooldown Timer (minutes)</label>
          <input type="number" value={minCooldown} onChange={(e) => setMinCooldown(Number(e.target.value))} style={{ width: "100%", background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} min={1} />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "4px" }}>Random Delay Min (sec)</label>
            <input type="number" value={minDelay} onChange={(e) => setMinDelay(Number(e.target.value))} style={{ width: "100%", background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} min={1} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "4px" }}>Random Delay Max (sec)</label>
            <input type="number" value={maxDelay} onChange={(e) => setMaxDelay(Number(e.target.value))} style={{ width: "100%", background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} min={1} />
          </div>
        </div>
        <button type="submit" style={{ background: "#10b981", border: "none", color: "#fff", padding: "10px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Save Behavior Parameters</button>
      </form>
    </div>
  )
}
