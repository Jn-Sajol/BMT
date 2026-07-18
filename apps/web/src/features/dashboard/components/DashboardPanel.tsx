"use client"

import React, { useEffect, useState } from "react"

interface DashboardMetrics {
  totalLibraryItemsCount: number
  totalClickableImagesCount: number
  totalLandingPagesCount: number
  totalDownloadedVideosCount: number
  timestamp: string
}

export function DashboardPanel() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)

  useEffect(() => {
    fetch("/api/dashboard/metrics")
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch((err) => console.error("Error loading metrics:", err))
  }, [])

  if (!metrics) {
    return <div style={{ color: "#fff", padding: "20px" }}>Loading metrics aggregator...</div>
  }

  return (
    <div style={{
      background: "rgba(30, 30, 40, 0.75)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "16px",
      padding: "24px",
      color: "#fff",
      fontFamily: "sans-serif"
    }}>
      <h2 style={{ margin: "0 0 16px 0", color: "#60a5fa" }}>BMT Analytics Aggregator</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "16px", borderRadius: "12px" }}>
          <div style={{ fontSize: "12px", color: "#9ca3af" }}>Library Assets</div>
          <div style={{ fontSize: "28px", fontWeight: "bold", margin: "8px 0" }}>{metrics.totalLibraryItemsCount}</div>
        </div>
        <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "16px", borderRadius: "12px" }}>
          <div style={{ fontSize: "12px", color: "#9ca3af" }}>Clickable Images</div>
          <div style={{ fontSize: "28px", fontWeight: "bold", margin: "8px 0" }}>{metrics.totalClickableImagesCount}</div>
        </div>
        <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "16px", borderRadius: "12px" }}>
          <div style={{ fontSize: "12px", color: "#9ca3af" }}>Landing Pages</div>
          <div style={{ fontSize: "28px", fontWeight: "bold", margin: "8px 0" }}>{metrics.totalLandingPagesCount}</div>
        </div>
        <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "16px", borderRadius: "12px" }}>
          <div style={{ fontSize: "12px", color: "#9ca3af" }}>Downloaded Videos</div>
          <div style={{ fontSize: "28px", fontWeight: "bold", margin: "8px 0" }}>{metrics.totalDownloadedVideosCount}</div>
        </div>
      </div>
    </div>
  )
}
