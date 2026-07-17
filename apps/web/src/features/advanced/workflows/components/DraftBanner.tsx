"use client"

import React from "react"

interface DraftBannerProps {
  hasChanges: boolean
  onPublish: () => void
  lastSavedAt?: string
}

export default function DraftBanner({ hasChanges, onPublish, lastSavedAt }: DraftBannerProps) {
  if (!hasChanges) return null

  return (
    <div className="bg-orange-600/10 border-b border-orange-500/30 px-4 py-2 flex items-center justify-between text-xs text-orange-400">
      <div className="flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
        <span className="font-mono">Unpublished Draft Changes: Autosaved {lastSavedAt || "just now"}</span>
      </div>
      <button
        onClick={onPublish}
        className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded transition-colors"
      >
        Publish Version
      </button>
    </div>
  )
}
