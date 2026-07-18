"use client"

import React, { useState } from "react"

export function LandingPageBuilder() {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("Fashion")
  const [sectionTitle, setSectionTitle] = useState("")
  const [sectionContent, setSectionContent] = useState("")
  const [adSlot, setAdSlot] = useState("")

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    fetch("/api/landing-page", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        category,
        sections: [{ title: sectionTitle, content: sectionContent }],
        adSlots: [adSlot],
      }),
    })
      .then((res) => res.json())
      .then((data) => alert(`Landing Page Created. ID: ${data.id}`))
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "20px" }}>
      <h3 style={{ color: "#60a5fa" }}>Landing Page Builder</h3>
      <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "450px" }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Landing Page Name" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category Niche" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <input value={sectionTitle} onChange={(e) => setSectionTitle(e.target.value)} placeholder="Section Hero Title" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <textarea value={sectionContent} onChange={(e) => setSectionContent(e.target.value)} placeholder="Section Hero Content" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", height: "80px" }} />
        <input value={adSlot} onChange={(e) => setAdSlot(e.target.value)} placeholder="HTML Ad Slot tag (e.g. <div>Ad Banner</div>)" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <button type="submit" style={{ background: "#3b82f6", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}>Save Landing Page Template</button>
      </form>
    </div>
  )
}
