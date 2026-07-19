"use client"

import React from "react"

interface FacebookGroup {
  id: string
  groupId: string
  name: string
  memberCount: number
  privacy: string
}

interface Props {
  groups: FacebookGroup[]
  onSync: () => void
}

export function JoinedGroupsTable({ groups, onSync }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <h4 style={{ color: "#60a5fa", margin: 0 }}>My Joined Facebook Groups</h4>
        <button
          onClick={onSync}
          style={{ background: "#10b981", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}
        >
          Sync Joined Groups
        </button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Group Name</th>
            <th style={{ padding: "8px" }}>Group ID</th>
            <th style={{ padding: "8px" }}>Members</th>
            <th style={{ padding: "8px" }}>Privacy</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => (
            <tr key={g.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px" }}>{g.name}</td>
              <td style={{ padding: "8px" }}>{g.groupId}</td>
              <td style={{ padding: "8px" }}>{g.memberCount.toLocaleString()}</td>
              <td style={{ padding: "8px" }}>{g.privacy}</td>
            </tr>
          ))}
          {groups.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>No joined groups synced yet. Click sync above.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
