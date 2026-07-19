"use client"

import React, { useState } from "react"

export function MasterPostEditor() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [ctaLink, setCtaLink] = useState("")
  const [pinComment, setPinComment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetch("/api/facebook-market/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        assets: [{ type: "Text", content: description }],
        targets: [],
        ctaLink,
        pinCommentText: pinComment,
      }),
    })
      .then((res) => res.json())
      .then((data) => alert(`Master Post saved as Draft. ID: ${data.id}`))
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "20px" }}>
      <h3 style={{ color: "#60a5fa" }}>Master Post Creator (SAFE Edition)</h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "500px" }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post Title" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Post Description Content" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", height: "100px" }} />
        <input value={ctaLink} onChange={(e) => setCtaLink(e.target.value)} placeholder="Call to Action Link (CTA)" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <input value={pinComment} onChange={(e) => setPinComment(e.target.value)} placeholder="Pin Comment Text (Optional)" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <button type="submit" style={{ background: "#1877f2", border: "none", color: "#fff", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Save Master Post</button>
      </form>
    </div>
  )
}
