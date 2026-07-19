"use client"

import React, { useState } from "react"

interface Props {
  tags: string[]
  onUpdate: (tags: string[]) => void
}

export function TagManager({ tags, onUpdate }: Props) {
  const [inputVal, setInputVal] = useState(tags.join(", "))

  const handleUpdate = () => {
    const list = inputVal.split(",").map((t) => t.trim()).filter(Boolean)
    onUpdate(list)
    alert("Custom group classification tags updated!")
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "12px" }}>
      <label style={{ fontSize: "13px", display: "block", marginBottom: "6px" }}>Group Tags:</label>
      <div style={{ display: "flex", gap: "10px" }}>
        <input value={inputVal} onChange={(e) => setInputVal(e.target.value)} placeholder="tech, saas, promo" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "6px", borderRadius: "4px", flex: 1 }} />
        <button onClick={handleUpdate} style={{ background: "#3b82f6", border: "none", color: "#fff", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}>Set Tags</button>
      </div>
    </div>
  )
}
