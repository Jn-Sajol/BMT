"use client"

import React from "react"

interface SavedGroup {
  id: string
  discoveredGroup: {
    name: string
    groupId: string
    privacy: string
  }
  isFavorite: boolean
}

interface Props {
  savedList: SavedGroup[]
  onToggleFavorite: (id: string) => void
}

export function SavedGroupsTable({ savedList, onToggleFavorite }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Saved Groups Library Directory</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Group Name</th>
            <th style={{ padding: "8px" }}>Group ID</th>
            <th style={{ padding: "8px" }}>Privacy</th>
            <th style={{ padding: "8px" }}>Favorite</th>
          </tr>
        </thead>
        <tbody>
          {savedList.map((g) => (
            <tr key={g.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px", fontWeight: "bold" }}>{g.discoveredGroup.name}</td>
              <td style={{ padding: "8px" }}>{g.discoveredGroup.groupId}</td>
              <td style={{ padding: "8px" }}>{g.discoveredGroup.privacy}</td>
              <td style={{ padding: "8px" }}>
                <button
                  onClick={() => onToggleFavorite(g.id)}
                  style={{
                    background: g.isFavorite ? "#eab308" : "rgba(255,255,255,0.1)",
                    color: g.isFavorite ? "#000" : "#fff",
                    border: "none",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  {g.isFavorite ? "★ Starred" : "☆ Star"}
                </button>
              </td>
            </tr>
          ))}
          {savedList.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>Saved library is empty.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
