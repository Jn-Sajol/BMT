"use client"

import React, { useState } from "react"

interface Props {
  onExport: (type: "group" | "link", format: "CSV" | "Excel") => void
  onClose: () => void
}

export function ExportOptionsModal({ onExport, onClose }: Props) {
  const [type, setType] = useState<"group" | "link">("group")
  const [format, setFormat] = useState<"CSV" | "Excel">("CSV")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onExport(type, format)
  }

  return (
    <div style={{
      position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
      background: "#1f2937", border: "1px solid rgba(255,255,255,0.1)",
      padding: "24px", zIndex: 100, color: "#fff", fontFamily: "sans-serif", borderRadius: "8px", width: "300px"
    }}>
      <h4 style={{ margin: "0 0 16px 0", color: "#60a5fa" }}>Trigger Lead Exporter</h4>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "4px" }}>Lead Extraction Niche</label>
          <select value={type} onChange={(e) => setType(e.target.value as any)} style={{ width: "100%", background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }}>
            <option value="group">Facebook Groups Leads</option>
            <option value="link">Messenger Invite Links</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "4px" }}>Output Export Format</label>
          <select value={format} onChange={(e) => setFormat(e.target.value as any)} style={{ width: "100%", background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }}>
            <option value="CSV">Comma Separated CSV</option>
            <option value="Excel">Microsoft Excel sheet</option>
          </select>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
          <button type="button" onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", padding: "8px 12px", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
          <button type="submit" style={{ background: "#10b981", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Export Now</button>
        </div>
      </form>
    </div>
  )
}
