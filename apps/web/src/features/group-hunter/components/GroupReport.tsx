"use client"

import React from "react"

interface ReportItem {
  id: string
  totalDiscovered: number
  totalSaved: number
  categoryDistribution: Record<string, number>
  countryDistribution: Record<string, number>
}

interface Props {
  reports: ReportItem[]
}

export function GroupReport({ reports }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Group Hunter Discovery Statistics</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Groups Discovered</th>
            <th style={{ padding: "8px" }}>Saved Library</th>
            <th style={{ padding: "8px" }}>Top Niche Tag</th>
            <th style={{ padding: "8px" }}>Top Country</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px" }}>{r.totalDiscovered}</td>
              <td style={{ padding: "8px" }}>{r.totalSaved}</td>
              <td style={{ padding: "8px" }}>{Object.keys(r.categoryDistribution).join(", ")}</td>
              <td style={{ padding: "8px" }}>{Object.keys(r.countryDistribution).join(", ")}</td>
            </tr>
          ))}
          {reports.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>No group discovery reports compiled.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
