"use client"

import React from "react"

interface ActivityItem {
  id: string
  action: string
  userId: string
  role: string
  timestamp: string
}

interface ActivityTimelineProps {
  activities: ActivityItem[]
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <div className="space-y-4 text-xs font-mono text-slate-300">
      <div className="flex items-center justify-between border-b border-slate-700 pb-2">
        <h4 className="text-sm font-bold text-slate-200">Collaboration Activity History</h4>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {activities.length === 0 ? (
          <div className="text-slate-500 text-center py-4">No recent collaboration activity.</div>
        ) : (
          activities.map((a) => (
            <div key={a.id} className="flex items-start space-x-2 border-l border-slate-800 pl-3 py-1 relative">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700 absolute -left-[4px] top-2" />
              <div className="flex-1">
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span className="font-bold text-slate-300">@{a.userId} ({a.role})</span>
                  <span>{a.timestamp}</span>
                </div>
                <div className="text-slate-400 mt-0.5">{a.action}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
