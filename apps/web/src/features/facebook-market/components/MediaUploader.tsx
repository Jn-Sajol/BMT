"use client"

import React from "react"

interface MediaAsset {
  id: string
  name: string
  url: string
}

interface Props {
  selectedAssetId?: string
  onSelect: (id: string) => void
}

export function MediaUploader({ selectedAssetId, onSelect }: Props) {
  // Simulates pulling from BMT Media Library
  const mockMediaLibrary: MediaAsset[] = [
    { id: "m-1", name: "Black Friday Banner.png", url: "http://asset/bf.png" },
    { id: "m-2", name: "Winter Promo Video.mp4", url: "http://asset/winter.mp4" },
  ]

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "16px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>BMT Media Library Assets Selection</h4>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
        {mockMediaLibrary.map((media) => (
          <div
            key={media.id}
            onClick={() => onSelect(media.id)}
            style={{
              background: selectedAssetId === media.id ? "rgba(96,165,250,0.2)" : "rgba(255,255,255,0.02)",
              border: selectedAssetId === media.id ? "2px solid #60a5fa" : "1px solid rgba(255,255,255,0.05)",
              padding: "10px",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "border 0.2s"
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: "13px" }}>{media.name}</div>
            <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Click to select</div>
          </div>
        ))}
      </div>
    </div>
  )
}
