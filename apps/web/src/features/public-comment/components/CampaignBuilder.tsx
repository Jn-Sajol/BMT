"use client"

import React, { useState } from "react"

interface Props {
  onCreated: () => void
}

export function CampaignBuilder({ onCreated }: Props) {
  const [title, setTitle] = useState("")
  const [country, setCountry] = useState("")
  const [category, setCategory] = useState("")
  const [niche, setNiche] = useState("")
  const [keywords, setKeywords] = useState("")
  const [dailyLimit, setDailyLimit] = useState(10)
  const [executionWindow, setExecutionWindow] = useState("09:00-18:00")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetch("/api/public-comment/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        country,
        category,
        niche,
        keywords: keywords.split(",").map((k) => k.trim()),
        dailyLimit,
        executionWindow,
        accountTargets: [],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(`Campaign created successfully! ID: ${data.id}`)
        onCreated()
      })
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 12px 0" }}>Create Comment Campaign (SAFE Edition)</h4>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "450px" }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Campaign Title" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Target Country Code (e.g. US)" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category Niche" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="Keywords (comma separated)" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <div>
          <label style={{ fontSize: "14px", marginRight: "10px" }}>Daily Limit:</label>
          <input type="number" value={dailyLimit} onChange={(e) => setDailyLimit(Number(e.target.value))} style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", width: "80px" }} />
        </div>
        <input value={executionWindow} onChange={(e) => setExecutionWindow(e.target.value)} placeholder="Execution Window (e.g. 09:00-18:00)" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <button type="submit" style={{ background: "#3b82f6", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Save Campaign Draft</button>
      </form>
    </div>
  )
}
