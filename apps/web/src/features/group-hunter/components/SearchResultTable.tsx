"use client"

import React from "react"

interface DiscoveredGroup {
  id: string
  groupId: string
  name: string
  description: string
  memberCount: number
  privacy: string
  language: string
  country: string
  tags: string[]
}

interface Props {
  results: DiscoveredGroup[]
  onSave: (group: DiscoveredGroup) => void
  onSelect: (group: DiscoveredGroup) => void
}

export function SearchResultTable({ results, onSave, onSelect }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Discovered FB Groups Results</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Group Name</th>
            <th style={{ padding: "8px" }}>Members</th>
            <th style={{ padding: "8px" }}>Privacy</th>
            <th style={{ padding: "8px" }}>Geo Target</th>
            <th style={{ padding: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {results.map((g) => (
            <tr key={g.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px" }}>
                <span onClick={() => onSelect(g)} style={{ fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }}>{g.name}</span>
              </td>
              <td style={{ padding: "8px" }}>{g.memberCount.toLocaleString()}</td>
              <td style={{ padding: "8px" }}>{g.privacy}</td>
              <td style={{ padding: "8px" }}>{g.country} ({g.language})</td>
              <td style={{ padding: "8px" }}>
                <button
                  onClick={() => onSave(g)}
                  style={{ background: "#10b981", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
                >
                  Save Group
                </button>
              </td>
            </tr>
          ))}
          {results.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>No search results. Trigger search above.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
