"use client"

import React from "react"

interface FacebookAccount {
  id: string
  fbUserId: string
  name: string
  expiresAt: string
}

interface Props {
  accounts: FacebookAccount[]
  onDisconnect: (id: string) => void
}

export function ConnectedAccountsTable({ accounts, onDisconnect }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Connected Facebook Accounts</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Name</th>
            <th style={{ padding: "8px" }}>Facebook User ID</th>
            <th style={{ padding: "8px" }}>Expiration</th>
            <th style={{ padding: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc) => (
            <tr key={acc.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px" }}>{acc.name}</td>
              <td style={{ padding: "8px" }}>{acc.fbUserId}</td>
              <td style={{ padding: "8px" }}>{new Date(acc.expiresAt).toLocaleDateString()}</td>
              <td style={{ padding: "8px" }}>
                <button
                  onClick={() => onDisconnect(acc.id)}
                  style={{ background: "#ef4444", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
                >
                  Disconnect
                </button>
              </td>
            </tr>
          ))}
          {accounts.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>No Facebook accounts connected yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
