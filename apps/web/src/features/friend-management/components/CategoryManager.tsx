"use client"

import React, { useState } from "react"

interface Props {
  friendId: string
  currentCategory: string
  onUpdated: () => void
}

export function CategoryManager({ friendId, currentCategory, onUpdated }: Props) {
  const [cat, setCat] = useState(currentCategory)

  const handleSave = () => {
    fetch("/api/friend-management/friends", {
      method: "POST", // Simulating updates endpoint routing
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendId, category: cat }),
    }).then(() => {
      alert("Friend category tag updated successfully!")
      onUpdated()
    })
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
      <label style={{ fontSize: "13px" }}>Set Category:</label>
      <select value={cat} onChange={(e) => setCat(e.target.value)} style={{ background: "#2d3748", border: "none", color: "#fff", padding: "6px", borderRadius: "4px" }}>
        <option value="Favorites">Favorites</option>
        <option value="Customers">Customers</option>
        <option value="Leads">Leads</option>
        <option value="Personal">Personal</option>
        <option value="Business">Business</option>
      </select>
      <button onClick={handleSave} style={{ background: "#10b981", border: "none", color: "#fff", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}>Save</button>
    </div>
  )
}
