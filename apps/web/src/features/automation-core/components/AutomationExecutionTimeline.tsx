"use client"

import React from "react"

export interface TimelineStep {
  name: string
  status: "Completed" | "In_Progress" | "Pending" | "Failed"
  timestamp?: string
}

interface Props {
  steps: TimelineStep[]
}

export function AutomationExecutionTimeline({ steps }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
      <h4 style={{ color: "#10b981", margin: "0 0 12px 0" }}>Framework Pipeline Lifecycle Timeline</h4>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
        {steps.map((step, idx) => {
          const color = step.status === "Completed" ? "#10b981" : step.status === "In_Progress" ? "#3b82f6" : step.status === "Failed" ? "#ef4444" : "#4b5563"
          return (
            <div key={step.name} style={{ flex: 1, textAlign: "center", position: "relative" }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: color, margin: "0 auto", color: "#fff", fontSize: "11px", lineHeight: "20px", fontWeight: "bold" }}>
                {idx + 1}
              </div>
              <div style={{ fontSize: "10px", marginTop: "6px", color }}>{step.name}</div>
              {step.timestamp && <div style={{ fontSize: "9px", color: "#9ca3af" }}>{new Date(step.timestamp).toLocaleTimeString()}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
