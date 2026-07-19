"use client"

import React from "react"

interface MessengerGroup {
  id: string
  groupId: string
  name: string
  memberCount: number
  status: string
}

interface Props {
  groups: MessengerGroup[]
  onSync: () => void
}

export function MessengerGroupTable({ groups, onSync }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <h4 style={{ color: "#60a5fa", margin: 0 }}>Synced Messenger Groups</h4>
        <button
          onClick={onSync}
          style={{ background: "#10b981", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}
        >
          Sync Chat Groups
        </button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Group Name</th>
            <th style={{ padding: "8px" }}>Group ID</th>
            <th style={{ padding: "8px" }}>Members</th>
            <th style={{ padding: "8px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => (
            <tr key={g.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px" }}>{g.name}</td>
              <td style={{ padding: "8px" }}>{g.groupId}</td>
              <td style={{ padding: "8px" }}>{g.memberCount}</td>
              <td style={{ padding: "8px" }}>
                <span style={{ fontSize: "12px", padding: "2px 8px", borderRadius: "12px", background: "rgba(16,185,129,0.2)", color: "#10b981" }}>{g.status}</span>
              </td>
            </tr>
          ))}
          {groups.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>No messenger groups synced.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
