"use client"

import React, { useState } from "react"

interface Target {
  id: string
  postId: string
  postUrl: string
  authorName: string
}

interface Props {
  targets: Target[]
  onAdd: (target: Target) => void
}

export function TargetConfiguration({ targets, onAdd }: Props) {
  const [postId, setPostId] = useState("")
  const [postUrl, setPostUrl] = useState("")
  const [authorName, setAuthorName] = useState("")

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (postId && postUrl) {
      onAdd({
        id: `targ-${Date.now()}`,
        postId,
        postUrl,
        authorName,
      })
      setPostId("")
      setPostUrl("")
      setAuthorName("")
    }
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Manual Targeting Configuration (No Auto-Discovery)</h4>
      <form onSubmit={handleAdd} style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
        <input value={postId} onChange={(e) => setPostId(e.target.value)} placeholder="Facebook Post ID" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <input value={postUrl} onChange={(e) => setPostUrl(e.target.value)} placeholder="Post URL" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <input value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Author Name" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <button type="submit" style={{ background: "#3b82f6", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Add Target Post</button>
      </form>
      <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "8px" }}>
        <h5 style={{ margin: "0 0 8px 0" }}>Configured Target Posts</h5>
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          {targets.map((t) => (
            <li key={t.id} style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "4px" }}>
              Post: {t.postId} | URL: <a href={t.postUrl} target="_blank" rel="noreferrer" style={{ color: "#60a5fa" }}>Link</a> {t.authorName && `| Author: ${t.authorName}`}
            </li>
          ))}
          {targets.length === 0 && <div style={{ color: "#9ca3af", fontSize: "12px" }}>No manually targeted posts configured yet.</div>}
        </ul>
      </div>
    </div>
  )
}
