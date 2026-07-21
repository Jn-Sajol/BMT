"use client"

import React, { useState } from "react"

interface Props {
  initialAdvancedEnabled: boolean
  onToggle: (key: string, value: boolean) => void
}

export function FeatureFlagManager({ initialAdvancedEnabled, onToggle }: Props) {
  const [advancedEnabled, setAdvancedEnabled] = useState(initialAdvancedEnabled)

  const handleToggle = () => {
    const nextVal = !advancedEnabled
    setAdvancedEnabled(nextVal)
    onToggle("system.advanced_automation", nextVal)
    alert(`Automation flag "system.advanced_automation" updated to ${nextVal ? "ON" : "OFF"}`)
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px" }}>
      <h4 style={{ color: "#10b981", margin: "0 0 12px 0" }}>System Core Feature Flags</h4>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: "bold" }}>Advanced Automation Core</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>Enable/disable background async queue workers globally</div>
        </div>
        <button
          onClick={handleToggle}
          style={{
            background: advancedEnabled ? "#10b981" : "#ef4444",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          {advancedEnabled ? "ENABLED" : "DISABLED"}
        </button>
      </div>
    </div>
  )
}
