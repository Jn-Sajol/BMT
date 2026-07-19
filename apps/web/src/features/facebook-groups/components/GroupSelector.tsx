"use client"

import React from "react"

interface FacebookGroup {
  id: string
  name: string
}

interface Props {
  groups: FacebookGroup[]
  selectedGroupIds: string[]
  onChange: (ids: string[]) => void
}

export function GroupSelector({ groups, selectedGroupIds, onChange }: Props) {
  const handleToggle = (id: string) => {
    if (selectedGroupIds.includes(id)) {
      onChange(selectedGroupIds.filter((i) => i !== id))
    } else {
      onChange([...selectedGroupIds, id])
    }
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "16px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Select Targets Joined Groups</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "150px", overflowY: "auto", background: "rgba(0,0,0,0.1)", padding: "10px", borderRadius: "8px" }}>
        {groups.map((g) => (
          <label key={g.id} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input type="checkbox" checked={selectedGroupIds.includes(g.id)} onChange={() => handleToggle(g.id)} />
            <span>{g.name}</span>
          </label>
        ))}
        {groups.length === 0 && <div style={{ color: "#9ca3af", fontSize: "13px" }}>No joined groups available. Sync first.</div>}
      </div>
    </div>
  )
}
