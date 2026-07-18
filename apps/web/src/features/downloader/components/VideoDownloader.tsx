"use client"

import React, { useState } from "react"

export function VideoDownloader() {
  const [url, setUrl] = useState("")
  const [platform, setPlatform] = useState<"facebook" | "youtube" | "tiktok">("youtube")
  const [downloadResult, setDownloadResult] = useState<any | null>(null)

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault()
    fetch("/api/downloader/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, platform }),
    })
      .then((res) => res.json())
      .then((data) => setDownloadResult(data))
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "20px" }}>
      <h3 style={{ color: "#60a5fa" }}>Social Media Video Downloader</h3>
      <form onSubmit={handleDownload} style={{ display: "flex", gap: "10px", marginBottom: "20px", maxWidth: "500px" }}>
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter video post link (TikTok/YouTube/FB)" style={{ flexGrow: 1, background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} />
        <select value={platform} onChange={(e) => setPlatform(e.target.value as any)} style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }}>
          <option value="youtube">YouTube</option>
          <option value="facebook">Facebook</option>
          <option value="tiktok">TikTok</option>
        </select>
        <button type="submit" style={{ background: "#3b82f6", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}>Download</button>
      </form>
      {downloadResult && (
        <div style={{ padding: "16px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
          <div style={{ color: "#10b981", fontWeight: "bold" }}>Video Download Successful!</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "6px" }}>Local File Path: {downloadResult.localFilePath}</div>
          <div style={{ fontSize: "12px", color: "#9ca3af" }}>File Size: {(downloadResult.fileSize / (1024 * 1024)).toFixed(2)} MB</div>
        </div>
      )}
    </div>
  )
}
