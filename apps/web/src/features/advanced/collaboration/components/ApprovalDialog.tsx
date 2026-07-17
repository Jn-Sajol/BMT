"use client"

import React, { useState } from "react"

interface ApprovalDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (comment: string) => void
  title: string
}

export default function ApprovalDialog({ isOpen, onClose, onConfirm, title }: ApprovalDialogProps) {
  const [comment, setComment] = useState("")

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm(comment || "Approval override")
    setComment("")
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 w-full max-w-sm space-y-4 text-xs font-mono">
        <div>
          <h4 className="text-sm font-bold text-slate-200">{title}</h4>
          <p className="text-slate-500 mt-1">This operation will record your review feedback in the immutable log.</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-400">Approval Comment:</label>
          <input
            type="text"
            placeholder="Type comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-slate-950 text-slate-300 border border-slate-800 rounded px-2 py-1.5 outline-none placeholder:text-slate-700"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded font-semibold"
          >
            Confirm Approval
          </button>
        </div>
      </div>
    </div>
  )
}
