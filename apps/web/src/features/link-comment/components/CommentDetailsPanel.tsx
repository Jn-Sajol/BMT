"use client"

import React from "react"

interface LinkComment {
  id: string
  postId: string
  text: string
  status: string
}

interface Props {
  comment: LinkComment | null
}

export function CommentDetailsPanel({ comment }: Props) {
  if (!comment) return <div style={{ color: "#9ca3af", fontStyle: "italic", marginTop: "20px" }}>Select a comment to review details.</div>

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Focused Comment Metadata</h4>
      <div style={{ fontSize: "13px" }}>
        <div><b>Target Post ID:</b> {comment.postId}</div>
        <div><b>Original Text:</b> {comment.text}</div>
        <div><b>Status:</b> {comment.status}</div>
      </div>
    </div>
  )
}
