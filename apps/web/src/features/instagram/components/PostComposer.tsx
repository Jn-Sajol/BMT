"use client"

import React, { useState } from "react"

interface Props {
  profileId: string
  onSchedule: (mediaUrl: string, caption: string, type: "Feed" | "Story" | "Reel", scheduledFor?: string) => void
}

export function PostComposer({ profileId, onSchedule }: Props) {
  const [caption, setCaption] = useState("")
  const [mediaUrl, setMediaUrl] = useState("")
  const [type, setType] = useState<"Feed" | "Story" | "Reel">("Feed")
  const [scheduleTime, setScheduleTime] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSchedule(mediaUrl, caption, type, scheduleTime || undefined)
    setCaption("")
    setMediaUrl("")
    setScheduleTime("")
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px" }}>
      <h4 style={{ color: "#e1306c", margin: "0 0 12px 0" }}>Create & Schedule Instagram Post</h4>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="S3 Media URL (e.g. image.jpg, video.mp4)..." style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} required />
        <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Instagram Caption & Hashtags..." style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", height: "80px" }} required />
        <div style={{ display: "flex", gap: "10px" }}>
          <select value={type} onChange={(e) => setType(e.target.value as any)} style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", flex: 1 }}>
            <option value="Feed">Instagram Feed Post</option>
            <option value="Story">Instagram Story</option>
            <option value="Reel">Instagram Reel</option>
          </select>
          <input type="datetime-local" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", colorScheme: "dark" }} />
        </div>
        <button type="submit" style={{ background: "#e1306c", border: "none", color: "#fff", padding: "10px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Publish / Schedule Post</button>
      </form>
    </div>
  )
}
