"use client"

import React, { useState } from "react"

interface Props {
  onSave: (config: any) => void
}

export function DelayConfiguration({ onSave }: Props) {
  const [pacingMinutes, setPacingMinutes] = useState(15)
  const [dailyCap, setDailyCap] = useState(20)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ pacingMinutes, dailyCap })
    alert("Pacing configurations saved successfully!")
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px" }}>
      <h4 style={{ color: "#3b82f6", margin: "0 0 12px 0" }}>Pacing Configuration</h4>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <label style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "4px" }}>Pacing delay (minutes between posts)</label>
          <input type="number" value={pacingMinutes} onChange={(e) => setPacingMinutes(Number(e.target.value))} style={{ width: "100%", background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} min={1} />
        </div>
        <div>
          <label style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "4px" }}>Daily listing cap (max posts per day)</label>
          <input type="number" value={dailyCap} onChange={(e) => setDailyCap(Number(e.target.value))} style={{ width: "100%", background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} min={1} />
        </div>
        <button type="submit" style={{ background: "#3b82f6", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Update pacing</button>
      </form>
    </div>
  )
}
