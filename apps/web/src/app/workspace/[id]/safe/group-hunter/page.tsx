"use client"

import React, { useState } from "react"

interface HuntedGroup {
  id: string
  groupName: string
  link: string
  memberCount: string
  activeMembersEst: string
  activityScore: number
  engagementPrediction: number
  category: string
  country: string
}

export default function SafeGroupHunterPage() {
  const [country, setCountry] = useState("Bangladesh")
  const [category, setCategory] = useState("Fashion & E-Commerce")
  const [keyword, setKeyword] = useState("Shopping")
  const [minScoreFilter, setMinScoreFilter] = useState<number>(70)
  const [isScraping, setIsScraping] = useState(false)

  const [huntedGroups, setHuntedGroups] = useState<HuntedGroup[]>([
    {
      id: "grp-1",
      groupName: "Fashion & Lifestyle BD Buyers Hub",
      link: "https://facebook.com/groups/fashionbd-buyers",
      memberCount: "142.5K",
      activeMembersEst: "18.4K Active",
      activityScore: 94,
      engagementPrediction: 91,
      category: "Fashion & E-Commerce",
      country: "Bangladesh",
    },
    {
      id: "grp-2",
      groupName: "Online Business Owners Bangladesh",
      link: "https://facebook.com/groups/onlinebiz-bd",
      memberCount: "89.0K",
      activeMembersEst: "12.1K Active",
      activityScore: 88,
      engagementPrediction: 85,
      category: "E-Commerce",
      country: "Bangladesh",
    },
    {
      id: "grp-3",
      groupName: "Smart Gadgets & Accessories BD",
      link: "https://facebook.com/groups/gadgetsbd-community",
      memberCount: "210.0K",
      activeMembersEst: "28.5K Active",
      activityScore: 78,
      engagementPrediction: 79,
      category: "Electronics",
      country: "Bangladesh",
    },
    {
      id: "grp-4",
      groupName: "Healthy Food & Organic Products BD",
      link: "https://facebook.com/groups/organicfood-bd",
      memberCount: "45.0K",
      activeMembersEst: "4.2K Active",
      activityScore: 65,
      engagementPrediction: 68,
      category: "Food & Grocery",
      country: "Bangladesh",
    },
  ])

  const handleScrapeGroups = () => {
    setIsScraping(true)
    setTimeout(() => {
      setIsScraping(false)
    }, 1000)
  }

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Group Name,Link,Members,Estimated Active,Activity Score,Engagement Prediction\n" +
      filteredGroups.map((g) => `"${g.groupName}","${g.link}","${g.memberCount}","${g.activeMembersEst}",${g.activityScore},${g.engagementPrediction}`).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "bmt_hunted_groups.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportExcel = () => {
    alert("Exporting hunted groups data to Excel (.xlsx)...")
  }

  const filteredGroups = huntedGroups.filter((g) => g.activityScore >= minScoreFilter)

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">FB Group Hunter (Public Group Research)</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Discover high-converting public Facebook groups with calculated Activity & Engagement Prediction Scores (no login required).
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition shadow-sm"
          >
            📥 Export CSV
          </button>
          <button
            onClick={handleExportExcel}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition shadow-sm"
          >
            📊 Export Excel
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="border bg-card p-5 rounded-xl space-y-4 shadow-sm text-xs">
        <h2 className="font-extrabold text-sm border-b pb-2">Scraper & Activity Score Filters</h2>

        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="font-bold block mb-1">Target Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3 py-1.5 border rounded-lg bg-background"
            />
          </div>

          <div>
            <label className="font-bold block mb-1">Category / Niche</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-1.5 border rounded-lg bg-background"
            />
          </div>

          <div>
            <label className="font-bold block mb-1">Keywords</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full px-3 py-1.5 border rounded-lg bg-background"
            />
          </div>
        </div>

        {/* Activity Score Threshold Selector */}
        <div>
          <label className="font-bold block mb-1.5">Activity Score Filter Threshold</label>
          <div className="flex items-center space-x-2">
            {[70, 80, 90].map((score) => (
              <button
                key={score}
                onClick={() => setMinScoreFilter(score)}
                className={`px-4 py-1.5 rounded-lg border font-extrabold text-xs transition ${
                  minScoreFilter === score
                    ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                Score {score}+
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleScrapeGroups}
          disabled={isScraping}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold py-2.5 rounded-lg shadow-sm transition text-xs flex items-center justify-center space-x-2"
        >
          <span>{isScraping ? "Scraping Active Facebook Groups..." : "🔍 Hunt High-Activity Public Groups"}</span>
        </button>
      </div>

      {/* Hunted Groups Table */}
      <div className="border bg-card p-5 rounded-xl space-y-4 shadow-sm text-xs">
        <h2 className="font-extrabold text-sm border-b pb-2">Hunted Active Groups ({filteredGroups.length})</h2>

        <div className="space-y-3">
          {filteredGroups.map((grp) => (
            <div key={grp.id} className="border p-4 rounded-xl space-y-2 bg-muted/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-purple-500 transition">
              <div className="space-y-1">
                <a href={grp.link} target="_blank" rel="noopener noreferrer" className="font-extrabold text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  {grp.groupName} ↗
                </a>
                <div className="flex items-center space-x-3 text-muted-foreground text-[11px]">
                  <span>Members: <strong className="text-foreground">{grp.memberCount}</strong></span>
                  <span>•</span>
                  <span>Est. Active: <strong className="text-emerald-600">{grp.activeMembersEst}</strong></span>
                  <span>•</span>
                  <span>Category: {grp.category}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-right">
                <div className="p-2 border rounded-lg bg-card text-center min-w-[90px]">
                  <span className="text-[10px] font-bold text-muted-foreground block uppercase">Activity Score</span>
                  <span className="text-base font-black text-purple-600 dark:text-purple-400">{grp.activityScore} / 100</span>
                </div>

                <div className="p-2 border rounded-lg bg-card text-center min-w-[90px]">
                  <span className="text-[10px] font-bold text-muted-foreground block uppercase">Engagement</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{grp.engagementPrediction}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
