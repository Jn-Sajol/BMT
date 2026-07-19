"use client"

import React, { useState } from "react"

interface Collection {
  id: string
  name: string
}

interface Props {
  collections: Collection[]
  onAdded: () => void
  onDelete: (id: string) => void
}

export function CollectionManager({ collections, onAdded, onDelete }: Props) {
  const [colName, setColName] = useState("")

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    // Trigger mock category updates
    alert(`Leads collection category folder "${colName}" created successfully!`)
    setColName("")
    onAdded()
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Target Collections Folders</h4>
      <form onSubmit={handleCreate} style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
        <input value={colName} onChange={(e) => setColName(e.target.value)} placeholder="Folder name (e.g. Agency leads)" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <button type="submit" style={{ background: "#10b981", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Add folder</button>
      </form>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {collections.map((c) => (
          <div key={c.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", padding: "6px 12px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>📁 {c.name}</span>
            <button onClick={() => onDelete(c.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "14px" }}>&times;</button>
          </div>
        ))}
      </div>
    </div>
  )
}
