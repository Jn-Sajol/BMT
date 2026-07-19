"use client"

import React from "react"

interface Props {
  selectedCategory: "Sales Conversion" | "Lead Conversion" | "Visit Conversion"
  onChange: (val: "Sales Conversion" | "Lead Conversion" | "Visit Conversion") => void
}

export function CategorySelector({ selectedCategory, onChange }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "12px" }}>
      <label style={{ marginRight: "10px", fontSize: "14px" }}>Filter Conversation Niche Category:</label>
      <select
        value={selectedCategory}
        onChange={(e) => onChange(e.target.value as any)}
        style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }}
      >
        <option value="Sales Conversion">Sales Conversion</option>
        <option value="Lead Conversion">Lead Conversion</option>
        <option value="Visit Conversion">Visit Conversion</option>
      </select>
    </div>
  )
}
