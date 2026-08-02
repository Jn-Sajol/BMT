"use client"

import React, { useState } from "react"

export default function AdvancedGroupPosterPage() {
  const [groupLimit, setGroupLimit] = useState(5)
  const [delayInterval, setDelayInterval] = useState("5-15")
  const [masterText, setMasterText] = useState("")

  const handlePostGroup = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Bulk Group Post Launched! ${groupLimit} groups selected per account across connected IDs. Randomized delays (${delayInterval} min) activated.`)
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Post A Group Engine</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Post to joined Facebook Groups across connected accounts in bulk (3-5 groups/account) with AI variations, photo rotation, and 5-15 min random delays.
        </p>
      </div>

      <form onSubmit={handlePostGroup} className="border bg-card p-6 rounded-xl space-y-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Groups Per Account Limit (3-5 Groups)</label>
            <select
              value={groupLimit}
              onChange={(e) => setGroupLimit(Number(e.target.value))}
              className="w-full border rounded-lg p-2.5 text-sm bg-background"
            >
              <option value={3}>3 Groups / Account (300 Total Posts)</option>
              <option value={5}>5 Groups / Account (500 Total Posts)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Group Delay Posting System</label>
            <select
              value={delayInterval}
              onChange={(e) => setDelayInterval(e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm bg-background"
            >
              <option value="5-15">Random 5, 8, 10, 15 Minutes (Safe Mode)</option>
              <option value="10-20">Random 10 - 20 Minutes (Ultra Safe)</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase">Master Group Post Text</label>
          <textarea
            rows={4}
            required
            placeholder="Write master group post content..."
            value={masterText}
            onChange={(e) => setMasterText(e.target.value)}
            className="w-full border rounded-lg p-3 text-sm bg-background"
          />
        </div>

        <div className="border p-4 rounded-lg bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900 space-y-2">
          <div className="text-xs font-bold uppercase text-orange-700 dark:text-orange-400">👥 Group Offload & Invites</div>
          <p className="text-xs text-muted-foreground">
            Optionally invite all friends and followers across connected accounts to join your custom group.
          </p>
          <button
            type="button"
            onClick={() => alert("Inviting all connected account followers & friends to your custom group...")}
            className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
          >
            ➕ Invite All Followers to Custom Group
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-lg text-sm transition"
        >
          👥 Launch Group Post Campaign
        </button>
      </form>
    </div>
  )
}
