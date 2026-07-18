"use client"

import React, { useState } from "react"

interface ViralContentResult {
  id: string
  title: string
  platform: string
  url: string
  likesCount: number
  commentCount: number
  engagementScore: number
}

export function ViralContentFinder() {
  const [platform, setPlatform] = useState<"facebook" | "youtube" | "tiktok">("youtube")
  const [country, setCountry] = useState("USA")
  const [category, setCategory] = useState("Marketing")
  const [results, setResults] = useState<ViralContentResult[]>([])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetch(`/api/viral-content/search?platform=${platform}&country=${country}&category=${category}`)
      .then((res) => res.json())
      .then((data) => setResults(data))
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "20px" }}>
      <h3 style={{ color: "#60a5fa" }}>Viral Content Finder</h3>
      <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <select value={platform} onChange={(e) => setPlatform(e.target.value as any)} style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }}>
          <option value="youtube">YouTube</option>
          <option value="facebook">Facebook</option>
          <option value="tiktok">TikTok</option>
        </select>
        <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category Niche" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <button type="submit" style={{ background: "#3b82f6", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}>Find Viral Content</button>
      </form>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "12px" }}>
        {results.map((r) => (
          <div key={r.id} style={{ background: "rgba(255,255,255,0.05)", padding: "16px", borderRadius: "8px" }}>
            <div style={{ fontWeight: "bold", marginBottom: "6px" }}>{r.title}</div>
            <div style={{ fontSize: "12px", color: "#9ca3af" }}>Platform: {r.platform}</div>
            <div style={{ fontSize: "12px", color: "#9ca3af" }}>Engagement Score: {r.engagementScore}%</div>
            <div style={{ fontSize: "12px", color: "#9ca3af" }}>Likes: {r.likesCount} | Comments: {r.commentCount}</div>
            <a href={r.url} target="_blank" rel="noreferrer" style={{ color: "#60a5fa", fontSize: "12px", display: "inline-block", marginTop: "8px" }}>View Raw Post</a>
          </div>
        ))}
      </div>
    </div>
  )
}
