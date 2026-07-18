"use client"

import React, { useEffect, useState } from "react"

interface LibraryItem {
  id: string
  name: string
  type: string
  category: string
  url?: string
}

export function LibraryPanel() {
  const [items, setItems] = useState<LibraryItem[]>([])
  const [name, setName] = useState("")
  const [type, setType] = useState("image")
  const [category, setCategory] = useState("General")

  useEffect(() => {
    fetch("/api/library")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Error loading library:", err))
  }, [])

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    fetch("/api/library/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type, category, url: "http://asset/mock.png" }),
    })
      .then((res) => res.json())
      .then((newItem) => setItems([...items, newItem]))
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "20px" }}>
      <h3 style={{ color: "#60a5fa" }}>BMT Asset Library</h3>
      <form onSubmit={handleUpload} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Asset Name" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <select value={type} onChange={(e) => setType(e.target.value)} style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }}>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="text">Text</option>
        </select>
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <button type="submit" style={{ background: "#3b82f6", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}>Upload</button>
      </form>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
        {items.map((item) => (
          <div key={item.id} style={{ background: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "8px" }}>
            <div style={{ fontWeight: "bold" }}>{item.name}</div>
            <div style={{ fontSize: "12px", color: "#9ca3af" }}>{item.type} | {item.category}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
