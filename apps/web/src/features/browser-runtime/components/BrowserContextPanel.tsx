"use client"

import React from "react"

interface BrowserContextConfig {
  id: string
  locale: string
  timezone: string
  viewport: {
    width: number
    height: number
  }
  userAgent: string
}

interface Props {
  context: BrowserContextConfig | null
  onDispose: (id: string) => void
}

export function BrowserContextPanel({ context, onDispose }: Props) {
  if (!context) return null

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px", marginBottom: "12px" }}>
        <h4 style={{ margin: 0, color: "#60a5fa" }}>Active Browser Context Metadata</h4>
        <button
          onClick={() => onDispose(context.id)}
          style={{ background: "#ef4444", border: "none", color: "#fff", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontSize: "11px" }}
        >
          Dispose Context
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "13px" }}>
        <div>
          <span style={{ color: "#9ca3af", display: "block" }}>Locale config:</span>
          <b>{context.locale}</b>
        </div>
        <div>
          <span style={{ color: "#9ca3af", display: "block" }}>Timezone target:</span>
          <b>{context.timezone}</b>
        </div>
        <div>
          <span style={{ color: "#9ca3af", display: "block" }}>Viewport resolution:</span>
          <b>{context.viewport.width} x {context.viewport.height}</b>
        </div>
        <div style={{ gridColumn: "span 2" }}>
          <span style={{ color: "#9ca3af", display: "block" }}>User-Agent:</span>
          <span style={{ fontSize: "11px", fontFamily: "monospace" }}>{context.userAgent}</span>
        </div>
      </div>
    </div>
  )
}
