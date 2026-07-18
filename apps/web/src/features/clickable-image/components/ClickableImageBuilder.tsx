"use client"

import React, { useState } from "react"

export function ClickableImageBuilder() {
  const [imageUrl, setImageUrl] = useState("")
  const [destinationUrl, setDestinationUrl] = useState("")
  const [result, setResult] = useState<string | null>(null)

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    fetch("/api/clickable-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl, destinationUrl }),
    })
      .then((res) => res.json())
      .then((data) => setResult(`/api/clickable-image/${data.id}`))
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "20px" }}>
      <h3 style={{ color: "#60a5fa" }}>Clickable Image Redirect Mapping</h3>
      <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image Asset URL" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <input value={destinationUrl} onChange={(e) => setDestinationUrl(e.target.value)} placeholder="Target Destination URL" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <button type="submit" style={{ background: "#3b82f6", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}>Generate Redirect Image Link</button>
      </form>
      {result && (
        <div style={{ marginTop: "16px", padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
          <div>Generated Clickable URL:</div>
          <a href={result} target="_blank" rel="noreferrer" style={{ color: "#60a5fa" }}>{window.location.origin}{result}</a>
        </div>
      )}
    </div>
  )
}
