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

export function CommentLibrary({ templates, onDelete }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Comment Templates Library</h4>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "12px" }}>
        {templates.map((t) => (
          <div key={t.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", padding: "12px" }}>
            <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "6px" }}>{t.content}</div>
            <div style={{ fontSize: "11px", color: "#9ca3af" }}>Category: {t.category} | Lang: {t.language}</div>
            <div style={{ display: "flex", gap: "4px", marginTop: "6px", flexWrap: "wrap" }}>
              {t.tags.map((tag, idx) => (
                <span key={idx} style={{ fontSize: "10px", background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "10px" }}>#{tag}</span>
              ))}
            </div>
            <button
              onClick={() => onDelete(t.id)}
              style={{ background: "#ef4444", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontSize: "11px", marginTop: "8px" }}
            >
              Delete
            </button>
          </div>
        ))}
        {templates.length === 0 && <div style={{ color: "#9ca3af", fontSize: "13px" }}>No comment templates found.</div>}
      </div>
    </div>
  )
}
