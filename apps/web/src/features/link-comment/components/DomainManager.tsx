"use client"

import React, { useState } from "react"

interface Props {
  initialDomains: string[]
  onUpdated: (domains: string[]) => void
}

export function DomainManager({ initialDomains, onUpdated }: Props) {
  const [domains, setDomains] = useState(initialDomains.join(", "))

  const handleSave = () => {
    const list = domains.split(",").map((d) => d.trim()).filter(Boolean)
    fetch("/api/link-comments/settings/filters/domains", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domains: list }),
    }).then(() => {
      alert("Blocked domains updated!")
      onUpdated(list)
    })
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Moderation Blocked Domains Filter</h4>
      <div style={{ display: "flex", gap: "10px" }}>
        <input value={domains} onChange={(e) => setDomains(e.target.value)} placeholder="spam.ru, malicious.com..." style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", width: "260px" }} />
        <button onClick={handleSave} style={{ background: "#10b981", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Update domains</button>
      </div>
    </div>
  )
}
