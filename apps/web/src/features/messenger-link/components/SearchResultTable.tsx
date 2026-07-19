"use client"

import React from "react"

interface DiscoveredMessengerLink {
  id: string
  groupId: string
  groupName: string
  inviteUrl: string
  memberCount: number
  messageFrequencyDaily: number
  status: string
  country: string
  language: string
  tags: string[]
}

interface Props {
  results: DiscoveredMessengerLink[]
  onSave: (link: DiscoveredMessengerLink) => void
  onSelect: (link: DiscoveredMessengerLink) => void
}

export function SearchResultTable({ results, onSave, onSelect }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Discovered Messenger Invite Links</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Chat Group Name</th>
            <th style={{ padding: "8px" }}>Members</th>
            <th style={{ padding: "8px" }}>Daily Msgs</th>
            <th style={{ padding: "8px" }}>Invite Destination</th>
            <th style={{ padding: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {results.map((l) => (
            <tr key={l.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px" }}>
                <span onClick={() => onSelect(l)} style={{ fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }}>{l.groupName}</span>
              </td>
              <td style={{ padding: "8px" }}>{l.memberCount}</td>
              <td style={{ padding: "8px" }}>{l.messageFrequencyDaily} / day</td>
              <td style={{ padding: "8px", fontFamily: "monospace", fontSize: "11px", color: "#60a5fa" }}>{l.inviteUrl}</td>
              <td style={{ padding: "8px" }}>
                <button
                  onClick={() => onSave(l)}
                  style={{ background: "#10b981", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
                >
                  Save Link
                </button>
              </td>
            </tr>
          ))}
          {results.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>No search results. Trigger scan above.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
