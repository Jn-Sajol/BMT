"use client"

import React, { useState } from "react"

interface Props {
  onEncrypt: (raw: string) => Promise<string>
}

export function CookieVaultPanel({ onEncrypt }: Props) {
  const [raw, setRaw] = useState("")
  const [encryptedResult, setEncryptedResult] = useState("")

  const handleEncrypt = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!raw.trim()) return
    const res = await onEncrypt(raw)
    setEncryptedResult(res)
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 12px 0" }}>Security Cookie Vault Encrypter</h4>
      <form onSubmit={handleEncrypt} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="Raw JSON Cookies payload (e.g. [{'name':'c_user','value':'...'}])..."
          style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", height: "60px", boxSizing: "border-box" }}
        />
        <button type="submit" style={{ background: "#10b981", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Encrypt Cookies</button>
      </form>
      {encryptedResult && (
        <div style={{ marginTop: "12px" }}>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>Encrypted Output:</span>
          <div style={{ fontSize: "11px", background: "rgba(255,255,255,0.05)", padding: "8px", borderRadius: "4px", fontFamily: "monospace", overflowX: "auto", maxWidth: "100%", wordBreak: "break-all" }}>{encryptedResult}</div>
        </div>
      )}
    </div>
  )
}
