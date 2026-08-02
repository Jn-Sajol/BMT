"use client"

import React, { useState } from "react"

export default function AdvancedFriendAutomationPage() {
  const [dailyLimit, setDailyLimit] = useState(15)
  const [acceptLimit, setAcceptLimit] = useState(40)
  const [ageRange, setAgeRange] = useState("18-35")
  const [gender, setGender] = useState("Female")
  const [interest, setInterest] = useState("Online Business / Marketing")

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Friend Request & Auto-Accept Engine</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Target audience profile discovery, automated friend requests, auto-accepting incoming requests with human behavior simulation (profile view, scroll, like, pause).
        </p>
      </div>

      <div className="border bg-card p-6 rounded-xl space-y-6 shadow-sm">
        {/* Audience Filter Header */}
        <h3 className="font-semibold text-base border-b pb-2">1. Target Audience Filters</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Target Age Range</label>
            <select
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm bg-background"
            >
              <option value="18-35">18 – 35 Years</option>
              <option value="25-45">25 – 45 Years</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Gender Filter</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm bg-background"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="All">All Genders</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Interest / Category</label>
            <select
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm bg-background"
            >
              <option value="Online Business / Marketing">Online Business / Marketing</option>
              <option value="E-Commerce & Shopping">E-Commerce & Shopping</option>
              <option value="Fashion & Beauty">Fashion & Beauty</option>
            </select>
          </div>
        </div>

        {/* Automation Limits */}
        <h3 className="font-semibold text-base border-b pb-2 pt-2">2. Daily Limits & AI Delay Rules</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Daily Request Limit / Account</label>
            <input
              type="number"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(Number(e.target.value))}
              className="w-full border rounded-lg p-2.5 text-sm bg-background"
            />
            <p className="text-[11px] text-muted-foreground mt-1">2 - 10 min AI Random Delay between requests</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Daily Auto-Accept Limit / Account</label>
            <input
              type="number"
              value={acceptLimit}
              onChange={(e) => setAcceptLimit(Number(e.target.value))}
              className="w-full border rounded-lg p-2.5 text-sm bg-background"
            />
            <p className="text-[11px] text-muted-foreground mt-1">10 - 30 min AI Random Delay before accepting</p>
          </div>
        </div>

        <div className="border p-4 rounded-lg bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900 space-y-2">
          <div className="text-xs font-bold uppercase text-orange-700 dark:text-orange-400">🛡️ Multi-Account Safety & Human Simulation</div>
          <p className="text-xs text-muted-foreground">
            Example: 50 Accounts × 15 Requests = 750 Requests/Day. Each account independently simulates human behavior (Viewing profile, scrolling feed, liking recent post, pausing).
          </p>
        </div>

        <button
          onClick={() => alert("Friend Request & Auto-Accept Engine Started!")}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-lg text-sm transition"
        >
          🤝 Start Friend Automation Engine
        </button>
      </div>
    </div>
  )
}
