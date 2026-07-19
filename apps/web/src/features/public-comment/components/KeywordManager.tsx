"use client"

import React, { useState } from "react"

interface Props {
  keywords: string[]
  onUpdate: (keywords: string[]) => void
}

export function KeywordManager({ keywords, onUpdate }: Props) {
  const [newKeyword, setNewKeyword] = useState("")

  const handleAdd = () => {
    if (newKeyword && !keywords.includes(newKeyword)) {
      onUpdate([...keywords, newKeyword])
      setNewKeyword("")
    }
  }

  const handleRemove = (kw: string) => {
    onUpdate(keywords.filter((k) => k !== kw))
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "16px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Targeting Keywords Manager</h4>
      <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
        <input value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)} placeholder="Add keyword" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <button onClick={handleAdd} style={{ background: "#3b82f6", border: "none", color: "#fff", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Add</button>
      </div>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {keywords.map((kw, idx) => (
          <span key={idx} style={{ background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: "12px", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
            {kw}
            <span onClick={() => handleRemove(kw)} style={{ cursor: "pointer", color: "#ef4444", fontWeight: "bold" }}>×</span>
          </span>
        ))}
        {keywords.length === 0 && <span style={{ color: "#9ca3af", fontSize: "13px" }}>No keywords registered.</span>}
      </div>
    </div>
  )
}
