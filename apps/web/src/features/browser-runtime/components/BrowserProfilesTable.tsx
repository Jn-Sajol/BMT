"use client"

import React from "react"

interface BrowserProfile {
  id: string
  profileName: string
  browserEngine: string
  storageLocation: string
  status: string
}

interface Props {
  profiles: BrowserProfile[]
  onSelect: (p: BrowserProfile) => void
  onArchive: (id: string) => void
}

export function BrowserProfilesTable({ profiles, onSelect, onArchive }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Persistent Browser Profiles</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Profile Name</th>
            <th style={{ padding: "8px" }}>Browser Engine</th>
            <th style={{ padding: "8px" }}>S3 Storage Target</th>
            <th style={{ padding: "8px" }}>Status</th>
            <th style={{ padding: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((p) => (
            <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px" }}>
                <span onClick={() => onSelect(p)} style={{ fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }}>{p.profileName}</span>
              </td>
              <td style={{ padding: "8px" }}>
                <span style={{ fontSize: "11px", background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: "4px" }}>{p.browserEngine.toUpperCase()}</span>
              </td>
              <td style={{ padding: "8px", fontFamily: "monospace", fontSize: "11px", color: "#60a5fa" }}>{p.storageLocation}</td>
              <td style={{ padding: "8px" }}>
                <span style={{
                  fontSize: "12px",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  background: p.status === "Active" ? "rgba(16,185,129,0.2)" : "rgba(156,163,175,0.2)",
                  color: p.status === "Active" ? "#10b981" : "#9ca3af"
                }}>{p.status}</span>
              </td>
              <td style={{ padding: "8px" }}>
                <button
                  onClick={() => onArchive(p.id)}
                  style={{ background: "#ef4444", border: "none", color: "#fff", padding: "2px 8px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                  disabled={p.status === "Archived"}
                >
                  Archive
                </button>
              </td>
            </tr>
          ))}
          {profiles.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>No active browser profiles found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
