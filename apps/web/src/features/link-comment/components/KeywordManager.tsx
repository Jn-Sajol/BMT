"use client"

import React, { useState } from "react"

interface Props {
  initialKeywords: string[]
  onUpdated: (words: string[]) => void
}

export function KeywordManager({ initialKeywords, onUpdated }: Props) {
  const [words, setWords] = useState(initialKeywords.join(", "))

  const handleSave = () => {
    const list = words.split(",").map((w) => w.trim()).filter(Boolean)
    fetch("/api/link-comments/settings/filters/keywords", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keywords: list }),
    }).then(() => {
      alert("Blocked keywords updated!")
      onUpdated(list)
    })
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Moderation Blocked Keywords Filter</h4>
      <div style={{ display: "flex", gap: "10px" }}>
        <input value={words} onChange={(e) => setWords(e.target.value)} placeholder="spam, discount, buy..." style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", width: "260px" }} />
        <button onClick={handleSave} style={{ background: "#10b981", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Update list</button>
      </div>
    </div>
  )
}
