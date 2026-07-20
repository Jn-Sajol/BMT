"use client"

import React, { useState } from "react"

interface Props {
  channelId: string
  onSchedule: (videoUrl: string, title: string, description: string, type: "Video" | "Short", scheduledFor?: string) => void
}

export function VideoComposer({ channelId, onSchedule }: Props) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [type, setType] = useState<"Video" | "Short">("Video")
  const [scheduleTime, setScheduleTime] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSchedule(videoUrl, title, description, type, scheduleTime || undefined)
    setTitle("")
    setDescription("")
    setVideoUrl("")
    setScheduleTime("")
  }

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px" }}>
      <h4 style={{ color: "#ff0000", margin: "0 0 12px 0" }}>Schedule Video Upload</h4>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="S3 MP4 Video URL..." style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} required />
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Video Title..." style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px" }} required />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Video Description & Tags..." style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", height: "80px" }} required />
        <div style={{ display: "flex", gap: "10px" }}>
          <select value={type} onChange={(e) => setType(e.target.value as any)} style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", flex: 1 }}>
            <option value="Video">YouTube Standard Video</option>
            <option value="Short">YouTube Short</option>
          </select>
          <input type="datetime-local" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} style={{ background: "#2d3748", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", colorScheme: "dark" }} />
        </div>
        <button type="submit" style={{ background: "#ff0000", border: "none", color: "#fff", padding: "10px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Publish / Schedule Video</button>
      </form>
    </div>
  )
}
