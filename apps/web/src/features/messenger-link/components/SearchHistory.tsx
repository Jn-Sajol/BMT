"use client"

import React from "react"

interface HistoryItem {
  id: string
  keyword: string
  country: string
  language: string
  timestamp: string
}

interface Props {
  history: HistoryItem[]
  onSelect: (keyword: string) => void
}

export function SearchHistory({ history, onSelect }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Recent Search History</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {history.map((h) => (
          <div key={h.id} style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "11px", color: "#9ca3af" }}>{new Date(h.timestamp).toLocaleTimeString()}</span>
              <div style={{ fontSize: "13px", marginTop: "2px" }}>
                Searched: <b>{h.keyword}</b> (Geo: {h.country})
              </div>
            </div>
            <button
              onClick={() => onSelect(h.keyword)}
              style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
            >
              Re-run Search
            </button>
          </div>
        ))}
        {history.length === 0 && <div style={{ color: "#9ca3af", fontSize: "13px" }}>No previous link finder searches run in this session.</div>}
      </div>
    </div>
  )
}
