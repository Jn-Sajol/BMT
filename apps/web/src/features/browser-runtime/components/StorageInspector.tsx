"use client"

import React from "react"

interface StorageMetadata {
  cookiesCount: number
  localStorageKeys: string[]
  sessionStorageKeys: string[]
  indexedDbSizeKb: number
  cacheSizeKb: number
}

interface Props {
  metadata: StorageMetadata | null
}

export function StorageInspector({ metadata }: Props) {
  if (!metadata) return null

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 12px 0" }}>Storage Cache Inspector</h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "13px" }}>
        <div>
          <span style={{ color: "#9ca3af", display: "block" }}>IndexedDB Footprint:</span>
          <b>{metadata.indexedDbSizeKb} KB</b>
        </div>
        <div>
          <span style={{ color: "#9ca3af", display: "block" }}>Cache size:</span>
          <b>{metadata.cacheSizeKb} KB</b>
        </div>
        <div>
          <span style={{ color: "#9ca3af", display: "block" }}>Session keys:</span>
          <b>{metadata.sessionStorageKeys.join(", ")}</b>
        </div>
        <div>
          <span style={{ color: "#9ca3af", display: "block" }}>Local keys:</span>
          <b>{metadata.localStorageKeys.join(", ")}</b>
        </div>
      </div>
    </div>
  )
}
