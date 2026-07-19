"use client"

import React from "react"

interface Template {
  id: string
  content: string
  category: string
  tags: string[]
  language: string
}

interface Props {
  templates: Template[]
  onDelete: (id: string) => void
}

export function MessageLibrary({ templates, onDelete }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Message Library Templates</h4>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "10px" }}>
        {templates.map((t) => (
          <div key={t.id} style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontSize: "13px", fontWeight: "bold" }}>{t.content}</div>
            <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>{t.category} | Lang: {t.language}</div>
            <button
              onClick={() => onDelete(t.id)}
              style={{ background: "#ef4444", color: "#fff", border: "none", padding: "2px 6px", borderRadius: "4px", cursor: "pointer", fontSize: "11px", marginTop: "8px" }}
            >
              Delete
            </button>
          </div>
        ))}
        {templates.length === 0 && <div style={{ color: "#9ca3af", fontSize: "13px" }}>No message templates configured.</div>}
      </div>
    </div>
  )
}
