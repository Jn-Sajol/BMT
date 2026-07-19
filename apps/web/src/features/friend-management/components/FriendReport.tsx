"use client"

import React from "react"

interface ReportItem {
  id: string
  totalFriendsCount: number
  pendingRequestsCount: number
  acceptanceRatePercentage: number
  removalsCount: number
}

interface Props {
  reports: ReportItem[]
}

export function FriendReport({ reports }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Friend Growth Reports & Statistics</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Total Active Friends</th>
            <th style={{ padding: "8px" }}>Pending Requests</th>
            <th style={{ padding: "8px" }}>Acceptance Rate</th>
            <th style={{ padding: "8px" }}>Manual Removals</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px" }}>{r.totalFriendsCount}</td>
              <td style={{ padding: "8px" }}>{r.pendingRequestsCount}</td>
              <td style={{ padding: "8px" }}>{r.acceptanceRatePercentage}%</td>
              <td style={{ padding: "8px" }}>{r.removalsCount} Removed</td>
            </tr>
          ))}
          {reports.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>No friend reports compiled.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
