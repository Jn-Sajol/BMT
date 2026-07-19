"use client"

import React from "react"

interface Target {
  id: string
  name: string
  type: "Account" | "Page"
}

interface Props {
  targets: Target[]
  selectedIds: string[]
  onChange: (selectedIds: string[]) => void
}

export function TargetSelector({ targets, selectedIds, onChange }: Props) {
  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((i) => i !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "16px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Select Publishing Targets</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {targets.map((t) => (
          <label key={t.id} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input type="checkbox" checked={selectedIds.includes(t.id)} onChange={() => handleToggle(t.id)} />
            <span>{t.name} ({t.type})</span>
          </label>
        ))}
        {targets.length === 0 && <div style={{ color: "#9ca3af", fontSize: "13px" }}>No connected accounts/pages available as targets.</div>}
      </div>
    </div>
  )
}
