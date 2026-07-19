"use client"

import React from "react"

interface FriendRequest {
  id: string
  name: string
  type: "incoming" | "outgoing"
  status: string
}

interface Props {
  requests: FriendRequest[]
  onAccept: (id: string) => void
  onReject: (id: string) => void
  onCancel: (id: string) => void
}

export function FriendRequestTable({ requests, onAccept, onReject, onCancel }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Pending Requests Queue</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Name</th>
            <th style={{ padding: "8px" }}>Flow</th>
            <th style={{ padding: "8px" }}>Status</th>
            <th style={{ padding: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px", fontWeight: "bold" }}>{item.name}</td>
              <td style={{ padding: "8px" }}>{item.type}</td>
              <td style={{ padding: "8px" }}>{item.status}</td>
              <td style={{ padding: "8px", display: "flex", gap: "8px" }}>
                {item.type === "incoming" && item.status === "pending" && (
                  <>
                    <button onClick={() => onAccept(item.id)} style={{ background: "#10b981", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}>Accept</button>
                    <button onClick={() => onReject(item.id)} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}>Reject</button>
                  </>
                )}
                {item.type === "outgoing" && item.status === "pending" && (
                  <button onClick={() => onCancel(item.id)} style={{ background: "#f59e0b", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}>Cancel Request</button>
                )}
              </td>
            </tr>
          ))}
          {requests.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>No pending requests.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
