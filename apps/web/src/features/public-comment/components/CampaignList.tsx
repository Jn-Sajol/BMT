"use client"

import React from "react"

interface Campaign {
  id: string
  title: string
  status: "Draft" | "Active" | "Paused" | "Archived"
  country: string
  category: string
}

interface Props {
  campaigns: Campaign[]
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

export function CampaignList({ campaigns, onDuplicate, onDelete }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Comment Assistant Campaigns</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Campaign Title</th>
            <th style={{ padding: "8px" }}>Country</th>
            <th style={{ padding: "8px" }}>Category</th>
            <th style={{ padding: "8px" }}>Status</th>
            <th style={{ padding: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px" }}>{c.title}</td>
              <td style={{ padding: "8px" }}>{c.country}</td>
              <td style={{ padding: "8px" }}>{c.category}</td>
              <td style={{ padding: "8px" }}>
                <span style={{
                  fontSize: "12px",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  background: c.status === "Active" ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)",
                  color: c.status === "Active" ? "#10b981" : "#f59e0b"
                }}>{c.status}</span>
              </td>
              <td style={{ padding: "8px", display: "flex", gap: "8px" }}>
                <button
                  onClick={() => onDuplicate(c.id)}
                  style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
                >
                  Duplicate
                </button>
                <button
                  onClick={() => onDelete(c.id)}
                  style={{ background: "#ef4444", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
                >
                  Archive
                </button>
              </td>
            </tr>
          ))}
          {campaigns.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>No campaigns configured.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
