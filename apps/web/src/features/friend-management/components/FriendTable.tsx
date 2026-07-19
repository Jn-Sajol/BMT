"use client"

import React from "react"

interface FriendProfile {
  id: string
  name: string
  category: string
  status: string
  lastInteractionAt: string
}

interface Props {
  friends: FriendProfile[]
  onSelect: (item: FriendProfile) => void
}

export function FriendTable({ friends, onSelect }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Friends Connections Directory</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Name</th>
            <th style={{ padding: "8px" }}>Category</th>
            <th style={{ padding: "8px" }}>Status</th>
            <th style={{ padding: "8px" }}>Last Interacted</th>
            <th style={{ padding: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {friends.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px", fontWeight: "bold" }}>{item.name}</td>
              <td style={{ padding: "8px" }}>{item.category}</td>
              <td style={{ padding: "8px" }}>
                <span style={{
                  fontSize: "12px",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  background: item.status === "Active" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
                  color: item.status === "Active" ? "#10b981" : "#ef4444"
                }}>{item.status}</span>
              </td>
              <td style={{ padding: "8px" }}>{new Date(item.lastInteractionAt).toLocaleDateString()}</td>
              <td style={{ padding: "8px" }}>
                <button
                  onClick={() => onSelect(item)}
                  style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
          {friends.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>No friends connected yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
