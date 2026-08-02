"use client"

import React, { useState } from "react"

interface BlockedLinkLog {
  id: string
  commentId: string
  userName: string
  detectedLink: string
  postTitle: string
  blockedAt: string
  action: "Auto Deleted"
}

export default function SafeLinkCommentBlockPage() {
  const [isShieldActive, setIsShieldActive] = useState(true)

  const [blockedLogs, setBlockedLogs] = useState<BlockedLinkLog[]>([
    { id: "blk-1", commentId: "comment_9981231", userName: "Spam Bot 2026", detectedLink: "https://spam-phishing-site.com/offer", postTitle: "Eid Special Premium Watch Collection Offer 2026", blockedAt: "4 mins ago", action: "Auto Deleted" },
    { id: "blk-2", commentId: "comment_8871239", userName: "Unknown User", detectedLink: "http://bit.ly/fake-deal-link", postTitle: "Top 5 Gaming Laptops in 2026", blockedAt: "18 mins ago", action: "Auto Deleted" },
    { id: "blk-3", commentId: "comment_7723912", userName: "Scam Account", detectedLink: "https://t.me/crypto_scam_group", postTitle: "Fresh Organic Honey Arrival", blockedAt: "1 hour ago", action: "Auto Deleted" },
  ])

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">24/7 Link Comment Block Shield</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time Webhook comment monitoring for links/URLs and automatic deletion via official Graph API (DELETE /comment-id).
          </p>
        </div>

        {/* Shield Toggle */}
        <button
          onClick={() => setIsShieldActive(!isShieldActive)}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold transition flex items-center space-x-2 ${
            isShieldActive
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              : "bg-muted text-muted-foreground border"
          }`}
        >
          <span>{isShieldActive ? "🛡️ Shield Active (Auto Delete ON)" : "⏸️ Shield Paused"}</span>
        </button>
      </div>

      {/* Metrics Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border bg-card p-4 rounded-xl shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase">Total Blocked Link Comments</span>
          <div className="text-2xl font-extrabold text-red-600 dark:text-red-400">{blockedLogs.length + 42}</div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">100% Graph API Cleaned</span>
        </div>

        <div className="border bg-card p-4 rounded-xl shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase">Monitored FB Pages</span>
          <div className="text-2xl font-extrabold text-foreground">3 Pages</div>
          <span className="text-[10px] text-muted-foreground font-medium">Webhook Real-Time Stream</span>
        </div>

        <div className="border bg-card p-4 rounded-xl shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase">Average Delete Latency</span>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">&lt; 1.2 sec</div>
          <span className="text-[10px] text-muted-foreground font-medium">Instant Deletion</span>
        </div>
      </div>

      {/* Blocked Comments Logs Table */}
      <div className="border bg-card p-5 rounded-xl space-y-4 shadow-sm text-xs">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="font-extrabold text-sm">Recent Blocked & Deleted Link Comments</h2>
          <span className="text-[10px] bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 font-bold px-2 py-0.5 rounded">
            Live Webhook Log
          </span>
        </div>

        <div className="space-y-3">
          {blockedLogs.map((log) => (
            <div key={log.id} className="border p-3.5 rounded-lg space-y-1.5 bg-muted/10">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-foreground">{log.userName}</span>
                <span className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded">
                  {log.action} (Graph API)
                </span>
              </div>
              <p className="text-red-500 font-mono text-[11px]">Detected Link: {log.detectedLink}</p>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t">
                <span>Post: {log.postTitle}</span>
                <span>{log.blockedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
