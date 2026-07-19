"use client"

import React from "react"

interface LinkComment {
  id: string
  postId: string
  author: { name: string; fbUserId: string }
  text: string
  detectedLinks: string[]
  status: string
}

interface Props {
  comment: LinkComment | null
  onClose: () => void
  onApprove: (id: string) => void
  onDelete: (id: string) => void
  onIgnore: (id: string) => void
  onArchive: (id: string) => void
}

export function CommentReviewDrawer({ comment, onClose, onApprove, onDelete, onIgnore, onArchive }: Props) {
  if (!comment) return null

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, width: "340px", height: "100%",
      background: "#1f2937", borderLeft: "1px solid rgba(255,255,255,0.1)",
      padding: "20px", zIndex: 100, color: "#fff", fontFamily: "sans-serif"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h4 style={{ margin: 0, color: "#60a5fa" }}>Review Comment Links</h4>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "18px" }}>&times;</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <label style={{ fontSize: "11px", color: "#9ca3af" }}>Author Details</label>
          <div style={{ fontSize: "14px", fontWeight: "bold" }}>{comment.author.name} (FB: {comment.author.fbUserId})</div>
        </div>
        <div>
          <label style={{ fontSize: "11px", color: "#9ca3af" }}>Original Comment Text</label>
          <div style={{ fontSize: "13px", background: "rgba(0,0,0,0.1)", padding: "8px", borderRadius: "6px" }}>{comment.text}</div>
        </div>
        <div>
          <label style={{ fontSize: "11px", color: "#9ca3af" }}>Detected Link Destinations</label>
          <div style={{ fontSize: "13px", color: "#60a5fa" }}>
            {comment.detectedLinks.map((l, i) => <div key={i}>{l}</div>)}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "16px" }}>
          <button onClick={() => onApprove(comment.id)} style={{ background: "#10b981", color: "#fff", border: "none", padding: "8px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Approve & Keep</button>
          <button onClick={() => onDelete(comment.id)} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "8px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Delete Comment</button>
          <button onClick={() => onIgnore(comment.id)} style={{ background: "#f59e0b", color: "#fff", border: "none", padding: "8px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Ignore Alert</button>
          <button onClick={() => onArchive(comment.id)} style={{ background: "#6b7280", color: "#fff", border: "none", padding: "8px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Archive Alert</button>
        </div>
      </div>
    </div>
  )
}
