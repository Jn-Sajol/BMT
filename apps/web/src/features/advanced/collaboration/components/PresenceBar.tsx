"use client"

import React from "react"

interface PresenceItem {
  userId: string
  action: "EDITING" | "REVIEWING" | "IDLE"
}

interface PresenceBarProps {
  users: PresenceItem[]
}

export default function PresenceBar({ users }: PresenceBarProps) {
  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs font-mono">
      <div className="flex items-center space-x-2 text-slate-400">
        <span>Presence:</span>
        {users.length === 0 ? (
          <span className="text-slate-600">No other users online.</span>
        ) : (
          <div className="flex -space-x-1 overflow-hidden">
            {users.map((u) => (
              <span
                key={u.userId}
                title={`${u.userId} (${u.action})`}
                className={`w-6 h-6 rounded-full flex items-center justify-center border border-slate-800 text-[10px] font-bold uppercase ${
                  u.action === "EDITING" ? "bg-orange-600 text-white" : "bg-blue-600 text-white"
                }`}
              >
                {u.userId.substring(0, 2)}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="text-[10px] text-slate-500">Live Syncing Enabled</div>
    </div>
  )
}
