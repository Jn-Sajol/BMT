"use client"

import React, { useState } from "react"

export default function AdvancedCommentAssistantPage() {
  const [activeTab, setActiveTab] = useState<"PUBLIC" | "REPLY">("PUBLIC")
  const [dailyLimit, setDailyLimit] = useState(25)
  const [replyMode, setReplyMode] = useState("AUTO_SMART")

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">FB Smart Comment Assistant</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Automated public viral post engagement & human-like AI comment reply assistant.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab("PUBLIC")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === "PUBLIC"
                ? "bg-orange-600 text-white"
                : "bg-card border text-muted-foreground hover:bg-muted"
            }`}
          >
            Public Comment Assistant
          </button>
          <button
            onClick={() => setActiveTab("REPLY")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === "REPLY"
                ? "bg-orange-600 text-white"
                : "bg-card border text-muted-foreground hover:bg-muted"
            }`}
          >
            AI Reply Comment Assistant
          </button>
        </div>
      </div>

      {activeTab === "PUBLIC" ? (
        <div className="border bg-card p-6 rounded-xl space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-semibold text-base">Public Comment Assistant Controls</h3>
            <span className="text-xs bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded font-bold">
              Continuous Campaign Active
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Daily Comment Limit / Account</label>
              <input
                type="number"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(Number(e.target.value))}
                className="w-full border rounded-lg p-2.5 text-sm bg-background"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Viral Post Finder Filters</label>
              <div className="text-xs text-muted-foreground p-2.5 border rounded-lg bg-muted/30">
                Min 200+ Likes • Min 20+ Comments • Age 1-24h
              </div>
            </div>
          </div>

          <div className="border p-4 rounded-lg bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900 space-y-2">
            <div className="text-xs font-bold uppercase text-orange-700 dark:text-orange-400">🤖 Human-Like Action Flow Simulation</div>
            <p className="text-xs text-muted-foreground">
              Flow: Open FB → Scroll Feed (10-30s) → Like Post → Wait Random Delay (1-3m) → Post Comment (from 50+ Comment Library) → Pause (2-5m).
            </p>
          </div>

          <button
            onClick={() => alert("Public Comment Assistant Campaign Started!")}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold py-2.5 rounded-lg"
          >
            ▶ Run Public Comment Assistant
          </button>
        </div>
      ) : (
        <div className="border bg-card p-6 rounded-xl space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-semibold text-base">AI Reply Comment Assistant Controls</h3>
            <span className="text-xs bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 px-2.5 py-0.5 rounded font-bold">
              Listening for New Comments
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Reply Operating Mode</label>
            <select
              value={replyMode}
              onChange={(e) => setReplyMode(e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm bg-background"
            >
              <option value="AUTO_SMART">AI Auto Mode (Option B: AI Smart Context Reply)</option>
              <option value="AUTO_SAVED">AI Auto Mode (Option A: 10 Saved Replies Sequence)</option>
              <option value="MANUAL">AI Manual Mode (Inbox Suggestions for User Approval)</option>
            </select>
          </div>

          <div className="border p-4 rounded-lg bg-muted/30 space-y-2">
            <div className="text-xs font-bold uppercase text-muted-foreground">⏱️ Delay & Variation Engine</div>
            <p className="text-xs text-muted-foreground">
              Randomized delays: 30 seconds to 3 minutes. Synonyms, Emojis, and Sentence structures automatically varied.
            </p>
          </div>

          <button
            onClick={() => alert("AI Reply Comment Assistant Enabled!")}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold py-2.5 rounded-lg"
          >
            ▶ Activate AI Reply Comment Assistant
          </button>
        </div>
      )}
    </div>
  )
}
