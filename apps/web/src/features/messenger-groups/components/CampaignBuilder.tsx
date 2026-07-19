"use client"

import React, { useState } from "react"

interface Props {
  selectedGroupIds: string[]
  onCreated: () => void
}

export function CampaignBuilder({ selectedGroupIds, onCreated }: Props) {
  const [title, setTitle] = useState("")
  const [templateId, setTemplateId] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetch("/api/messenger-groups/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        groupIds: selectedGroupIds,
        templateId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(`Messenger campaign draft created. ID: ${data.id}`)
        onCreated()
      })
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 12px 0" }}>Create Group Message Campaign</h4>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "450px" }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Campaign Title" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <input value={templateId} onChange={(e) => setTemplateId(e.target.value)} placeholder="Message Template ID" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <div style={{ fontSize: "12px", color: "#9ca3af" }}>Targets count: {selectedGroupIds.length} Groups</div>
        <button type="submit" style={{ background: "#3b82f6", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Save Campaign</button>
      </form>
    </div>
  )
}
