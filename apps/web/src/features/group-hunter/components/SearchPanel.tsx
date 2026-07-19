"use client"

import React, { useState } from "react"

interface Props {
  onSearch: (keyword: string, country: string, language: string) => void
}

export function SearchPanel({ onSearch }: Props) {
  const [keyword, setKeyword] = useState("")
  const [country, setCountry] = useState("US")
  const [lang, setLang] = useState("en")

  const handleTrigger = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(keyword, country, lang)
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 12px 0" }}>Discover Target Facebook Groups</h4>
      <form onSubmit={handleTrigger} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Keywords (e.g. Dropshipping, Real Estate)..." style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", flex: 1 }} />
        <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country Code" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", width: "100px" }} />
        <input value={lang} onChange={(e) => setLang(e.target.value)} placeholder="Lang Code" style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", width: "90px" }} />
        <button type="submit" style={{ background: "#3b82f6", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Search Groups</button>
      </form>
    </div>
  )
}
