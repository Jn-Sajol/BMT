"use client"

import React, { useState } from "react"

interface Props {
  initialNotes: string
  onSave: (val: string) => void
}

export function NotesEditor({ initialNotes, onSave }: Props) {
  const [notes, setNotes] = useState(initialNotes)

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "12px" }}>
      <label style={{ fontSize: "13px", display: "block", marginBottom: "6px" }}>Group Notes (SAFE Research):</label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Enter research details, admin contact options, posting rules..."
        style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", width: "100%", height: "70px", boxSizing: "border-box" }}
      />
      <button
        onClick={() => {
          onSave(notes)
          alert("Notes updated successfully!")
        }}
        style={{ background: "#10b981", border: "none", color: "#fff", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", marginTop: "6px" }}
      >
        Save Notes
      </button>
    </div>
  )
}
