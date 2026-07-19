"use client"

import React, { useState } from "react"

interface Props {
  onAdded: () => void
}

export function TemplateEditor({ onAdded }: Props) {
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState("")
  const [language, setLanguage] = useState("en")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetch("/api/messenger-controller/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        category,
        tags: tags.split(",").map((t) => t.trim()),
        language,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Message template saved to library!")
        setContent("")
        setCategory("")
        setTags("")
        onAdded()
      })
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Add Message Template</h4>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
        <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Template content..." style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma separated)" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="Language" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <button type="submit" style={{ background: "#10b981", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Save Template</button>
      </form>
    </div>
  )
}
