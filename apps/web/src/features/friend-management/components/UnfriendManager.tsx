"use client"

import React from "react"

interface UnfriendCandidate {
  id: string
  friendId: string
  name: string
  daysInactive: number
}

interface Props {
  candidates: UnfriendCandidate[]
  onRemove: (friendId: string) => void
}

export function UnfriendManager({ candidates, onRemove }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#ef4444", margin: "0 0 10px 0" }}>Unfriend Suggestion Candidates (Inactive Over 60 Days)</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Name</th>
            <th style={{ padding: "8px" }}>Days Inactive</th>
            <th style={{ padding: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c) => (
            <tr key={c.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px", fontWeight: "bold" }}>{c.name}</td>
              <td style={{ padding: "8px" }}>{c.daysInactive} days</td>
              <td style={{ padding: "8px" }}>
                <button
                  onClick={() => onRemove(c.friendId)}
                  style={{ background: "#ef4444", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
                >
                  Unfriend Profile
                </button>
              </td>
            </tr>
          ))}
          {candidates.length === 0 && (
            <tr>
              <td colSpan={3} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>No inactive friend candidates found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
