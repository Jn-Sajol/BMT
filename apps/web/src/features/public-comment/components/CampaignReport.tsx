"use client"

import React from "react"

interface SummaryReport {
  id: string
  campaignId: string
  campaignTitle: string
  status: string
  templateCount: number
  targetCount: number
  createdTime: string
  updatedTime: string
  commentsPostedCount: number
}

interface Props {
  reports: SummaryReport[]
}

export function CampaignReport({ reports }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Campaign Summary Reports & Status</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Campaign Title</th>
            <th style={{ padding: "8px" }}>Templates</th>
            <th style={{ padding: "8px" }}>Targets Count</th>
            <th style={{ padding: "8px" }}>Posted Comments</th>
            <th style={{ padding: "8px" }}>Last Update</th>
            <th style={{ padding: "8px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px" }}>{r.campaignTitle}</td>
              <td style={{ padding: "8px" }}>{r.templateCount}</td>
              <td style={{ padding: "8px" }}>{r.targetCount}</td>
              <td style={{ padding: "8px" }}>{r.commentsPostedCount}</td>
              <td style={{ padding: "8px" }}>{new Date(r.updatedTime).toLocaleString()}</td>
              <td style={{ padding: "8px" }}>
                <span style={{ fontSize: "12px", padding: "2px 8px", borderRadius: "12px", background: "rgba(96,165,250,0.2)", color: "#60a5fa" }}>{r.status}</span>
              </td>
            </tr>
          ))}
          {reports.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>No campaign reports available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
