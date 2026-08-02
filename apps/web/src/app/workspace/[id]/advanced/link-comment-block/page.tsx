"use client"

import React, { useState } from "react"

export default function AdvancedLinkCommentBlockPage() {
  const [isEnabled, setIsEnabled] = useState(true)
  const [deletedCount, setDeletedCount] = useState(48)

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Link Comment Block / Auto-Deleter</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Automatically detect and delete any spam or competitor comments containing external links on your connected Facebook Pages and Accounts.
        </p>
      </div>

      <div className="border bg-card p-6 rounded-xl space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h3 className="font-semibold text-base">Automatic Link Comment Shield</h3>
            <p className="text-xs text-muted-foreground">Scans incoming post comments 24/7</p>
          </div>
          <button
            onClick={() => setIsEnabled(!isEnabled)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              isEnabled
                ? "bg-emerald-600 text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {isEnabled ? "✓ SHIELD ACTIVE" : "OFF"}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="border p-4 rounded-lg bg-muted/20">
            <div className="text-xs font-semibold text-muted-foreground uppercase">Total Link Comments Deleted</div>
            <div className="text-3xl font-bold mt-2 text-red-600 dark:text-red-400">{deletedCount} Deleted</div>
          </div>

          <div className="border p-4 rounded-lg bg-muted/20">
            <div className="text-xs font-semibold text-muted-foreground uppercase">Protection Scope</div>
            <div className="text-sm font-semibold mt-2">All Connected FB Pages & IDs</div>
          </div>
        </div>

        <div className="border p-4 rounded-lg bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900 text-xs text-muted-foreground space-y-1">
          <div className="font-bold text-orange-700 dark:text-orange-400 uppercase">🛡️ Automatic Protection Rule</div>
          <p>
            Any comment containing `http://`, `https://`, `www.`, `.com`, `.net` or domain links will be instantly deleted to prevent spam and link hijacking.
          </p>
        </div>
      </div>
    </div>
  )
}
