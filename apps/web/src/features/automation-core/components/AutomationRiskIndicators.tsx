"use client"

import React from "react"

interface Props {
  riskLevel: "Low" | "Medium" | "High"
  accountHealthScore: number
  pacingMultiplier: number
  warnings: string[]
}

export function AutomationRiskIndicators({
  riskLevel,
  accountHealthScore,
  pacingMultiplier,
  warnings
}: Props) {
  const riskColor = riskLevel === "High" ? "#ef4444" : riskLevel === "Medium" ? "#f59e0b" : "#10b981"

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
      <h4 style={{ color: riskColor, margin: "0 0 12px 0" }}>HBF Risk Profile & Health Indicators</h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", textAlign: "center" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: riskColor }}>{riskLevel}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Risk Level</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: accountHealthScore > 80 ? "#10b981" : "#f59e0b" }}>
            {accountHealthScore}/100
          </div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Account Health Score</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>{pacingMultiplier}x</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Pacing Delay Multiplier</span>
        </div>
      </div>
      {warnings.length > 0 && (
        <div style={{ marginTop: "12px", background: "rgba(239,68,68,0.1)", padding: "8px", borderRadius: "6px", fontSize: "11px", color: "#fca5a5" }}>
          {warnings.map((w, idx) => (
            <div key={idx}>⚠️ {w}</div>
          ))}
        </div>
      )}
    </div>
  )
}
