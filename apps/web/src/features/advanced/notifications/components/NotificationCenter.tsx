"use client"

import React, { useState } from "react"

interface NotificationItem {
  id: string
  title: string
  content: string
  channel: string
  isRead: boolean
  createdAt: string
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: "notif-1", title: "Workflow Failed", content: "Meta Sync failed with timeout.", channel: "email", isRead: false, createdAt: "5 mins ago" },
    { id: "notif-2", title: "Review Approved", content: "Workflow v1.0 approved by reviewer.", channel: "in-app", isRead: false, createdAt: "20 mins ago" },
  ])

  const [filterRead, setFilterRead] = useState<string>("ALL")

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const filtered = notifications.filter((n) => {
    if (filterRead === "UNREAD") return !n.isRead
    if (filterRead === "READ") return n.isRead
    return true
  })

  return (
    <div className="space-y-4 text-xs font-mono text-slate-300 p-4 border border-slate-800 bg-slate-900/30 rounded-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h4 className="text-sm font-bold text-slate-200">User Alerts Notification Center</h4>
        <button
          onClick={handleMarkAllRead}
          className="text-[10px] text-orange-400 hover:underline font-semibold"
        >
          Mark All Read
        </button>
      </div>

      <div className="flex items-center space-x-2 bg-slate-950 px-2 py-1 rounded border border-slate-850">
        <span className="text-slate-500">Filter:</span>
        <button
          onClick={() => setFilterRead("ALL")}
          className={`px-2 py-0.5 rounded text-[10px] ${
            filterRead === "ALL" ? "bg-slate-800 text-slate-200" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterRead("UNREAD")}
          className={`px-2 py-0.5 rounded text-[10px] ${
            filterRead === "UNREAD" ? "bg-slate-800 text-slate-200" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          Unread
        </button>
        <button
          onClick={() => setFilterRead("READ")}
          className={`px-2 py-0.5 rounded text-[10px] ${
            filterRead === "READ" ? "bg-slate-800 text-slate-200" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          Read
        </button>
      </div>

      <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="text-slate-600 text-center py-4">No recent notifications matches.</div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className={`p-3 border rounded-lg space-y-1 relative transition-all ${
                n.isRead ? "border-slate-850 bg-slate-950/20 text-slate-500" : "border-slate-800 bg-slate-950/60 text-slate-200"
              }`}
            >
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold">{n.title}</span>
                <span>{n.createdAt}</span>
              </div>
              <p>{n.content}</p>
              <div className="text-[10px] text-slate-600 flex justify-between pt-1">
                <span>Channel: {n.channel}</span>
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="text-orange-400 hover:underline"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
