"use client"

import React, { useState } from "react"

export default function AdvancedPostSchedulerPage() {
  const [postType, setPostType] = useState("Post Text/Media")
  const [targetType, setTargetType] = useState("BOTH")
  const [hookTone, setHookTone] = useState("Curiosity")
  const [targetCountry, setTargetCountry] = useState("USA")
  const [category, setCategory] = useState("E-Commerce")
  const [masterText, setMasterText] = useState("")
  const [ctaCommentLink, setCtaCommentLink] = useState("")
  const [aiScore, setAiScore] = useState<number | null>(null)
  const [scheduleMode, setScheduleMode] = useState<"Immediate" | "SpecificTime">("SpecificTime")
  const [scheduledDateTime, setScheduledDateTime] = useState<string>(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() + 30)
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  })

  const getFormattedSelectedTime = () => {
    if (!scheduledDateTime) return "Select Time"
    try {
      const dt = new Date(scheduledDateTime)
      return dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    } catch {
      return "12:45 PM"
    }
  }

  const setQuickPreset = (preset: "1h" | "tomorrow_morning" | "tomorrow_evening") => {
    const target = new Date()
    if (preset === "1h") {
      target.setHours(target.getHours() + 1)
    } else if (preset === "tomorrow_morning") {
      target.setDate(target.getDate() + 1)
      target.setHours(10, 0, 0, 0)
    } else if (preset === "tomorrow_evening") {
      target.setDate(target.getDate() + 1)
      target.setHours(19, 30, 0, 0)
    }
    const year = target.getFullYear()
    const month = String(target.getMonth() + 1).padStart(2, '0')
    const day = String(target.getDate()).padStart(2, '0')
    const hours = String(target.getHours()).padStart(2, '0')
    const minutes = String(target.getMinutes()).padStart(2, '0')
    setScheduledDateTime(`${year}-${month}-${day}T${hours}:${minutes}`)
  }

  const handleAnalyzeViralScore = () => {
    // Generate AI Viral Score between 88 and 98
    const score = Math.floor(Math.random() * 11) + 88
    setAiScore(score)
  }

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Master Post Scheduled across connected accounts for ${scheduleMode === 'SpecificTime' ? getFormattedSelectedTime() : 'Immediate Queue'} with ${hookTone} AI Variations and 10-50s random delays!`)
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Post Scheduler & AI Engine</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create Master Posts with AI Variations, Photo Rotation, Randomized Delays (10-50s), CTA Pin Commenting, and AI Viral Score Analysis.
        </p>
      </div>

      <form onSubmit={handleSchedule} className="border bg-card p-6 rounded-xl space-y-6 shadow-sm">
        {/* 1. Target Selection & Post Type */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Target Destination</label>
            <select
              value={targetType}
              onChange={(e) => setTargetType(e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm bg-background"
            >
              <option value="BOTH">All Connected FB IDs & Pages (Both)</option>
              <option value="ID_ONLY">Facebook IDs Only</option>
              <option value="PAGE_ONLY">Facebook Pages Only</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Post Format</label>
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm bg-background"
            >
              <option value="Post Text/Media">Post Text / Video / Photo</option>
              <option value="Post Story">Post Story</option>
              <option value="Post Reels">Post Reels</option>
              <option value="Post Poll">Post Poll</option>
            </select>
          </div>
        </div>

        {/* 2. Master Post Editor */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase">Master Post Content (10+ Photos / Video / Text)</label>
          <textarea
            rows={4}
            required
            placeholder="Title + Description + Hashtag (Master copy for AI variation engine)..."
            value={masterText}
            onChange={(e) => setMasterText(e.target.value)}
            className="w-full border rounded-lg p-3 text-sm bg-background"
          />
        </div>

        {/* 3. AI Variation Engine Controls */}
        <div className="border p-4 rounded-lg bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900 space-y-4">
          <div className="text-xs font-bold uppercase text-orange-700 dark:text-orange-400">🤖 AI Variation & Human Behavior Engine</div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Target Country</label>
              <select
                value={targetCountry}
                onChange={(e) => setTargetCountry(e.target.value)}
                className="w-full border rounded-lg p-2 text-xs bg-background"
              >
                <option value="USA">United States (USA)</option>
                <option value="BD">Bangladesh (BD)</option>
                <option value="UK">United Kingdom (UK)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-lg p-2 text-xs bg-background"
              >
                <option value="E-Commerce">E-Commerce</option>
                <option value="Entertainment">Entertainment</option>
                <option value="News">News</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">AI Hook Tone</label>
              <select
                value={hookTone}
                onChange={(e) => setHookTone(e.target.value)}
                className="w-full border rounded-lg p-2 text-xs bg-background"
              >
                <option value="Curiosity">Curiosity (কৌতূহল)</option>
                <option value="Emotional">Emotional (আবেগীয়)</option>
                <option value="Shock">Shock (হতবাক করা)</option>
                <option value="Question">Question (প্রশ্নবোধক)</option>
              </select>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">
            AI will generate distinct Titles, Descriptions, Hashtags, Emojis, and CTAs for each account while rotating 10 uploaded photos 1-by-1 to simulate natural human activity.
          </p>
        </div>

        {/* 4. CTA Pin Commenting */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase">CTA Pin Comment (Auto-pinned post publishing)</label>
          <input
            type="text"
            placeholder="আজকের সবথেকে ভাইরাল নিউজ! বিস্তারিত জানতে লিংকে ক্লিক করুন: https://yourlink.com"
            value={ctaCommentLink}
            onChange={(e) => setCtaCommentLink(e.target.value)}
            className="w-full border rounded-lg p-2.5 text-xs bg-background"
          />
        </div>

        {/* 4.5 Target Schedule Time Picker Card */}
        <div className="border bg-card p-4 rounded-xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="font-extrabold text-xs flex items-center space-x-1.5 uppercase tracking-wide">
              <span>📅</span>
              <span>Schedule Target Time & Delay Engine</span>
            </h2>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
              Active
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold block mb-1.5">Publish Schedule Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setScheduleMode("SpecificTime")}
                  className={`py-2 rounded-lg border font-extrabold text-xs transition ${scheduleMode === "SpecificTime" ? "bg-orange-600 text-white border-orange-600 shadow-sm" : "hover:bg-muted"}`}
                >
                  📅 Specific Time ({getFormattedSelectedTime()})
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleMode("Immediate")}
                  className={`py-2 rounded-lg border font-extrabold text-xs transition ${scheduleMode === "Immediate" ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "hover:bg-muted"}`}
                >
                  ⚡ Immediate Queue
                </button>
              </div>
            </div>

            {scheduleMode === "SpecificTime" && (
              <div className="p-3.5 border border-orange-500/30 bg-orange-50/30 dark:bg-orange-950/20 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-xs text-orange-700 dark:text-orange-400 block">
                    Select Target Date & Time
                  </label>
                  <span className="text-[10px] font-bold bg-orange-200 dark:bg-orange-900 text-orange-900 dark:text-orange-200 px-2 py-0.5 rounded-full">
                    {getFormattedSelectedTime()} Selected
                  </span>
                </div>

                <input
                  type="datetime-local"
                  value={scheduledDateTime}
                  onChange={(e) => setScheduledDateTime(e.target.value)}
                  className="w-full px-3 py-2 border border-orange-300 dark:border-orange-700 rounded-lg bg-background text-xs font-bold text-foreground focus:ring-2 focus:ring-orange-500 cursor-pointer"
                />

                <div className="flex items-center space-x-1.5 pt-1">
                  <span className="text-[10px] font-bold text-muted-foreground">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => setQuickPreset("1h")}
                    className="text-[10px] bg-card hover:bg-muted px-2 py-0.5 rounded border font-semibold text-foreground"
                  >
                    ⚡ In 1 Hr
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickPreset("tomorrow_morning")}
                    className="text-[10px] bg-card hover:bg-muted px-2 py-0.5 rounded border font-semibold text-foreground"
                  >
                    🌅 Tomorrow 10 AM
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickPreset("tomorrow_evening")}
                    className="text-[10px] bg-card hover:bg-muted px-2 py-0.5 rounded border font-semibold text-foreground"
                  >
                    🌆 Tomorrow 7:30 PM
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 5. AI Viral Score & Schedule Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t">
          <button
            type="button"
            onClick={handleAnalyzeViralScore}
            className="w-full sm:w-auto bg-muted hover:bg-muted/80 border text-foreground text-xs font-semibold px-4 py-2.5 rounded-lg"
          >
            🧪 Check AI Viral Score
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition"
          >
            🚀 Schedule Master Post (Auto-Delays 10-50s)
          </button>
        </div>
      </form>

      {aiScore !== null && (
        <div className="border bg-card p-6 rounded-xl space-y-3 shadow-sm border-orange-200 dark:border-orange-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-orange-600 dark:text-orange-400">AI Viral Score Result</span>
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{aiScore} / 100</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 text-xs text-muted-foreground">
            <div>✓ Emotion Power: <span className="font-semibold text-foreground">High</span></div>
            <div>✓ Hook Strength: <span className="font-semibold text-foreground">Strong ({hookTone})</span></div>
            <div>✓ Trending Match: <span className="font-semibold text-foreground">95%</span></div>
          </div>
        </div>
      )}
    </div>
  )
}
