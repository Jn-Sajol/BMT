"use client"

import React, { useState } from "react"

export default function PreferencesPanel() {
  const [channels, setChannels] = useState({
    inApp: true,
    email: true,
    slack: false,
    webhook: false,
  })

  const [events, setEvents] = useState({
    workflowFailed: true,
    workflowApproved: true,
    mention: true,
    aiSuggestion: false,
    reviewRequest: true,
  })

  const toggleChannel = (key: keyof typeof channels) => {
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleEvent = (key: keyof typeof events) => {
    setEvents((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-4 text-xs font-mono text-slate-300 p-4 border border-slate-800 bg-slate-900/30 rounded-lg">
      <div className="border-b border-slate-800 pb-2 mb-4">
        <h4 className="text-sm font-bold text-slate-200">Alerts Settings & Delivery Channels</h4>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Channels */}
        <div className="space-y-2">
          <div className="font-bold text-orange-400">Delivery Channels</div>
          <div className="space-y-1">
            {Object.keys(channels).map((key) => {
              const k = key as keyof typeof channels
              return (
                <label key={k} className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={channels[k]}
                    onChange={() => toggleChannel(k)}
                    className="accent-orange-500 rounded bg-slate-950 border-slate-850"
                  />
                  <span className="capitalize">{k}</span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Events */}
        <div className="space-y-2">
          <div className="font-bold text-orange-400">Notification Triggers</div>
          <div className="space-y-1">
            {Object.keys(events).map((key) => {
              const k = key as keyof typeof events
              return (
                <label key={k} className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={events[k]}
                    onChange={() => toggleEvent(k)}
                    className="accent-orange-500 rounded bg-slate-950 border-slate-850"
                  />
                  <span className="capitalize">{k.replace(/([A-Z])/g, " $1")}</span>
                </label>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
