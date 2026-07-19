"use client"

import React from "react"

export function FacebookConnectButton() {
  const handleConnect = () => {
    console.log("[FacebookConnectButton] Initializing OAuth flow...")
    alert("OAuth redirect initialized. Fetching auth token...")
  }

  return (
    <button
      onClick={handleConnect}
      style={{
        background: "#1877f2",
        color: "#fff",
        border: "none",
        padding: "10px 20px",
        borderRadius: "8px",
        fontWeight: "bold",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        fontFamily: "sans-serif"
      }}
    >
      <span style={{ fontSize: "16px" }}>f</span> Connect Facebook Profile
    </button>
  )
}
