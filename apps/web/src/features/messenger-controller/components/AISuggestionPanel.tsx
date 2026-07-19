"use client"

import React from "react"

interface Props {
  suggestions: string[]
  onSelect: (val: string) => void
}

export function AISuggestionPanel({ suggestions, onSelect }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "16px" }}>
      <h4 style={{ color: "#a855f7", margin: "0 0 10px 0" }}>AI Suggested Replies (SAFE Copilot)</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {suggestions.map((s, idx) => (
          <div
            key={idx}
            onClick={() => onSelect(s)}
            style={{
              background: "rgba(168,85,247,0.05)",
              border: "1px solid rgba(168,85,247,0.15)",
              padding: "10px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
              transition: "background 0.2s"
            }}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  )
}
