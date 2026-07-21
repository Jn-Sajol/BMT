"use client"

import React, { useState } from "react"

interface Props {
  onGenerate: (title: string, desc: string) => Promise<{ title: string; desc: string }>
}

export function AIVariationPreview({ onGenerate }: Props) {
  const [origTitle, setOrigTitle] = useState("Mountain Bike")
  const [origDesc, setOrigDesc] = useState("Decent condition, pick up only")
  const [genTitle, setGenTitle] = useState("")
  const [genDesc, setGenDesc] = useState("")

  const handleGenerate = async () => {
    const res = await onGenerate(origTitle, origDesc)
    setGenTitle(res.title)
    setGenDesc(res.desc)
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px" }}>
      <h4 style={{ color: "#3b82f6", margin: "0 0 12px 0" }}>AI Variations Previewer</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <label style={{ fontSize: "11px", color: "#9ca3af" }}>Listing Title:</label>
          <input type="text" value={origTitle} onChange={(e) => setOrigTitle(e.target.value)} style={{ width: "100%", background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        </div>
        <div>
          <label style={{ fontSize: "11px", color: "#9ca3af" }}>Description:</label>
          <textarea value={origDesc} onChange={(e) => setOrigDesc(e.target.value)} style={{ width: "100%", background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", height: "45px" }} />
        </div>
        <button onClick={handleGenerate} style={{ background: "#10b981", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Generate AI Variations</button>
        {genTitle && (
          <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "6px" }}>
            <span style={{ fontSize: "11px", color: "#9ca3af" }}>AI Output Title:</span>
            <div style={{ fontWeight: "bold", fontSize: "14px", color: "#10b981" }}>{genTitle}</div>
            <span style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginTop: "8px" }}>AI Output Description:</span>
            <div style={{ fontSize: "13px", whiteSpace: "pre-wrap" }}>{genDesc}</div>
          </div>
        )}
      </div>
    </div>
  )
}
