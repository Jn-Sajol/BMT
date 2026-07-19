"use client"

import React from "react"

interface ReportItem {
  id: string
  totalCommentsCount: number
  linkCommentsCount: number
  deletedCommentsCount: number
  ignoredCommentsCount: number
  topDomains: string[]
}

interface Props {
  reports: ReportItem[]
}

export function CommentReport({ reports }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Moderation Daily Growth Reports</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Total comments scan</th>
            <th style={{ padding: "8px" }}>Link Comments</th>
            <th style={{ padding: "8px" }}>Deleted Comments</th>
            <th style={{ padding: "8px" }}>Ignored Comments</th>
            <th style={{ padding: "8px" }}>Spam Domains</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px" }}>{r.totalCommentsCount}</td>
              <td style={{ padding: "8px" }}>{r.linkCommentsCount}</td>
              <td style={{ padding: "8px" }}>{r.deletedCommentsCount} Deleted</td>
              <td style={{ padding: "8px" }}>{r.ignoredCommentsCount} Ignored</td>
              <td style={{ padding: "8px", fontSize: "11px" }}>{r.topDomains.join(", ")}</td>
            </tr>
          ))}
          {reports.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>No daily moderation reports compiled.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
