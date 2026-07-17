"use client"

import React from "react"

interface ConflictDialogProps {
  isOpen: boolean
  onClose: () => void
  onReload: () => void
  onMerge: () => void
  onDiscard: () => void
}

export default function ConflictDialog({ isOpen, onClose, onReload, onMerge, onDiscard }: ConflictDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 w-full max-w-sm space-y-4 text-xs font-mono">
        <div>
          <h4 className="text-sm font-bold text-red-400">Concurrent Edits Conflict</h4>
          <p className="text-slate-500 mt-1">
            This draft has been modified by another editor since you opened it. Please select an action to resolve the conflict.
          </p>
        </div>

        <div className="flex flex-col space-y-2 pt-2">
          <button
            onClick={onReload}
            className="w-full py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded font-semibold transition-colors"
          >
            Reload Latest Draft
          </button>
          <button
            onClick={onMerge}
            className="w-full py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded font-semibold transition-colors"
          >
            Merge Changes
          </button>
          <button
            onClick={onDiscard}
            className="w-full py-1.5 bg-red-900/30 hover:bg-red-900/40 text-red-400 rounded font-semibold transition-colors"
          >
            Discard My Changes
          </button>
        </div>
      </div>
    </div>
  )
}
