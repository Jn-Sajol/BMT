"use client"

import React from "react"

interface Props {
  activeStep: "Preparation" | "Delay" | "Execution" | "Verification" | "Reporting" | "Done"
}

export function CommentExecutionTimeline({ activeStep }: Props) {
  const steps = ["Preparation", "Delay", "Execution", "Verification", "Reporting", "Done"]

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px" }}>
      <h4 style={{ color: "#10b981", margin: "0 0 12px 0" }}>Comment Pipeline Timeline</h4>
      <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
        {steps.map((s, idx) => {
          const isCompleted = steps.indexOf(activeStep) >= idx
          return (
            <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, position: "relative" }}>
              <div style={{
                width: "24px", height: "24px", borderRadius: "50%",
                background: isCompleted ? "#10b981" : "#4b5563",
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: "bold", fontSize: "12px", zIndex: 2
              }}>
                {idx + 1}
              </div>
              <span style={{ fontSize: "11px", color: isCompleted ? "#10b981" : "#9ca3af", marginTop: "6px" }}>{s}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
