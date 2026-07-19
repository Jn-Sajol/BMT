"use client"

import React from "react"

interface SavedMessengerLink {
  id: string
  discoveredLink: {
    groupName: string
    inviteUrl: string
    memberCount: number
  }
  isFavorite: boolean
}

interface Props {
  savedList: SavedMessengerLink[]
  onToggleFavorite: (id: string) => void
}

export function SavedLinksTable({ savedList, onToggleFavorite }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Saved Invite Links Directory</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Chat Group Name</th>
            <th style={{ padding: "8px" }}>Invite Destination URL</th>
            <th style={{ padding: "8px" }}>Active Members</th>
            <th style={{ padding: "8px" }}>Favorite</th>
          </tr>
        </thead>
        <tbody>
          {savedList.map((l) => (
            <tr key={l.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px", fontWeight: "bold" }}>{l.discoveredLink.groupName}</td>
              <td style={{ padding: "8px", fontFamily: "monospace", fontSize: "11px", color: "#60a5fa" }}>{l.discoveredLink.inviteUrl}</td>
              <td style={{ padding: "8px" }}>{l.discoveredLink.memberCount} members</td>
              <td style={{ padding: "8px" }}>
                <button
                  onClick={() => onToggleFavorite(l.id)}
                  style={{
                    background: l.isFavorite ? "#eab308" : "rgba(255,255,255,0.1)",
                    color: l.isFavorite ? "#000" : "#fff",
                    border: "none",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  {l.isFavorite ? "★ Starred" : "☆ Star"}
                </button>
              </td>
            </tr>
          ))}
          {savedList.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>Saved library links directory is empty.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
