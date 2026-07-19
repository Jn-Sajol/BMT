"use client"

import React from "react"

interface CollectedLead {
  id: string
  type: string
  name: string
  targetUrl: string
  memberCount: number
  activityScore: number
  isFavorite: boolean
  tags: string[]
}

interface Props {
  leads: CollectedLead[]
  onToggleFavorite: (id: string) => void
  onSelect: (lead: CollectedLead) => void
}

export function LeadsTable({ leads, onToggleFavorite, onSelect }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Collected Leads Directory Queue</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Lead Name</th>
            <th style={{ padding: "8px" }}>Type</th>
            <th style={{ padding: "8px" }}>Target URL</th>
            <th style={{ padding: "8px" }}>Members</th>
            <th style={{ padding: "8px" }}>Activity Score</th>
            <th style={{ padding: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px" }}>
                <span onClick={() => onSelect(l)} style={{ fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }}>{l.name}</span>
              </td>
              <td style={{ padding: "8px" }}>
                <span style={{ fontSize: "11px", background: l.type === "group" ? "rgba(96,165,250,0.15)" : "rgba(245,158,11,0.15)", padding: "2px 6px", borderRadius: "4px", color: l.type === "group" ? "#60a5fa" : "#f59e0b" }}>{l.type.toUpperCase()}</span>
              </td>
              <td style={{ padding: "8px", fontFamily: "monospace", fontSize: "11px", color: "#60a5fa" }}>{l.targetUrl}</td>
              <td style={{ padding: "8px" }}>{l.memberCount.toLocaleString()}</td>
              <td style={{ padding: "8px" }}>{l.activityScore} / 100</td>
              <td style={{ padding: "8px", display: "flex", gap: "6px" }}>
                <button
                  onClick={() => onToggleFavorite(l.id)}
                  style={{
                    background: l.isFavorite ? "#eab308" : "rgba(255,255,255,0.1)",
                    color: l.isFavorite ? "#000" : "#fff",
                    border: "none",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px"
                  }}
                >
                  {l.isFavorite ? "★ Favorite" : "☆ Fav"}
                </button>
              </td>
            </tr>
          ))}
          {leads.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>No collected leads profiles found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
