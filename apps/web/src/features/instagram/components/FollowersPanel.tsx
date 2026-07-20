"use client"

import React from "react"

export function FollowersPanel() {
  const demographics = [
    { country: "United States", percentage: "45%", count: 5625 },
    { country: "Canada", percentage: "18%", count: 2250 },
    { country: "United Kingdom", percentage: "12%", count: 1500 },
    { country: "Germany", percentage: "8%", count: 1000 },
  ]

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#e1306c", margin: "0 0 10px 0" }}>Followers Geo Targets Demographics</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Country Target</th>
            <th style={{ padding: "8px" }}>Percentage</th>
            <th style={{ padding: "8px" }}>Follower Count</th>
          </tr>
        </thead>
        <tbody>
          {demographics.map((d, idx) => (
            <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px", fontWeight: "bold" }}>{d.country}</td>
              <td style={{ padding: "8px" }}>{d.percentage}</td>
              <td style={{ padding: "8px" }}>{d.count.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
