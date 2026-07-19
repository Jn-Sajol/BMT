"use client"

import React from "react"

interface FacebookPermission {
  id: string
  name: string
  status: "granted" | "declined"
}

interface Props {
  permissions: FacebookPermission[]
}

export function PermissionCard({ permissions }: Props) {
  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.02)",
      border: "1px solid rgba(255, 255, 255, 0.05)",
      borderRadius: "12px",
      padding: "16px",
      color: "#fff",
      fontFamily: "sans-serif",
      marginTop: "20px"
    }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 12px 0" }}>Graph API OAuth Permissions Status</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {permissions.map((p) => (
          <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "14px" }}>{p.name}</span>
            <span style={{
              fontSize: "12px",
              padding: "2px 8px",
              borderRadius: "12px",
              background: p.status === "granted" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
              color: p.status === "granted" ? "#10b981" : "#ef4444"
            }}>{p.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
