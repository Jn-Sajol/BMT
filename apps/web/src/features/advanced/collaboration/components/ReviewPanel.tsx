"use client"

import React, { useState } from "react"
import ReviewerBadge from "./ReviewerBadge"

interface ReviewProps {
  workflowId: string
  role: "DEVELOPER" | "REVIEWER" | "MANAGER" | "ADMIN"
  status: "DRAFT" | "SUBMITTED" | "IN_REVIEW" | "APPROVED" | "PUBLISHED" | "REJECTED"
  onSubmit: (reviewers: string[]) => void
  onApprove: (comment: string) => void
  onReject: (comment: string) => void
}

export default function ReviewPanel({ workflowId, role, status, onSubmit, onApprove, onReject }: ReviewProps) {
  const [reviewers, setReviewers] = useState("")
  const [comment, setComment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewers.trim()) return
    onSubmit(reviewers.split(",").map((s) => s.trim()))
    setReviewers("")
  }

  return (
    <div className="space-y-4 text-xs font-mono text-slate-300">
      <div className="flex items-center justify-between border-b border-slate-700 pb-2">
        <h4 className="text-sm font-bold text-slate-200">Collaboration Panel</h4>
        <ReviewerBadge role={role} />
      </div>

      <div className="p-3 border border-slate-800 bg-slate-900/40 rounded-lg space-y-2">
        <div className="flex justify-between">
          <span>Workflow Review Status:</span>
          <span className="font-bold text-orange-400">{status}</span>
        </div>
      </div>

      {status === "DRAFT" && role === "DEVELOPER" && (
        <form onSubmit={handleSubmit} className="space-y-2 border border-slate-800 p-3 rounded-lg bg-slate-950/20">
          <div className="font-bold text-slate-200">Submit for Review</div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500">Reviewers (comma-separated usernames):</label>
            <input
              type="text"
              placeholder="e.g. john, alice"
              value={reviewers}
              onChange={(e) => setReviewers(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 outline-none text-slate-300"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded font-semibold transition-colors"
          >
            Submit Review Request
          </button>
        </form>
      )}

      {(status === "SUBMITTED" || status === "IN_REVIEW") && role === "REVIEWER" && (
        <div className="space-y-3 border border-slate-800 p-3 rounded-lg bg-slate-950/20">
          <div className="font-bold text-slate-200">Review Actions</div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500">Review Feedback / Comment:</label>
            <textarea
              placeholder="Provide comments..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full h-16 bg-slate-950 border border-slate-800 rounded px-2 py-1 outline-none text-slate-300 resize-none"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => { onApprove(comment); setComment(""); }}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold"
            >
              Approve
            </button>
            <button
              onClick={() => { onReject(comment); setComment(""); }}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-semibold"
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
