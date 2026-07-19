"use client"

import React from "react"

interface FacebookPage {
  id: string
  pageId: string
  name: string
}

interface Props {
  pages: FacebookPage[]
}

export function ConnectedPagesTable({ pages }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Connected Facebook Pages</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Page Name</th>
            <th style={{ padding: "8px" }}>Page ID</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((p) => (
            <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px" }}>{p.name}</td>
              <td style={{ padding: "8px" }}>{p.pageId}</td>
            </tr>
          ))}
          {pages.length === 0 && (
            <tr>
              <td colSpan={2} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>No Facebook pages connected.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
