"use client"

import React, { useState } from "react"

export default function AdvancedGroupHunterPage() {
  const [activeTab, setActiveTab] = useState<"FB" | "MESSENGER">("FB")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Group & Messenger Hunter Engine</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Scan and discover public auto-approval Facebook groups and Messenger group links with activity scoring & CSV/Excel export.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab("FB")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "FB"
                ? "bg-orange-600 text-white"
                : "bg-card border text-muted-foreground hover:bg-muted"
            }`}
          >
            Facebook Groups
          </button>
          <button
            onClick={() => setActiveTab("MESSENGER")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "MESSENGER"
                ? "bg-orange-600 text-white"
                : "bg-card border text-muted-foreground hover:bg-muted"
            }`}
          >
            Messenger Group Links
          </button>
        </div>
      </div>

      <div className="border bg-card p-6 rounded-xl space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-semibold text-base">
            {activeTab === "FB" ? "Facebook Active Group Finder" : "Messenger Group Link Finder"}
          </h3>
          <button
            onClick={() => alert("Downloading CSV / Excel data export...")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg"
          >
            📊 Download CSV / Excel
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Target Country</label>
            <select className="w-full border rounded-lg p-2.5 text-sm bg-background">
              <option>United States (USA)</option>
              <option>Bangladesh (BD)</option>
              <option>United Kingdom (UK)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Niche / Category</label>
            <select className="w-full border rounded-lg p-2.5 text-sm bg-background">
              <option>E-Commerce & Digital Business</option>
              <option>Affiliate & Promo Deals</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Min Score Filter</label>
            <select className="w-full border rounded-lg p-2.5 text-sm bg-background">
              <option>Score 70+ (Good)</option>
              <option>Score 80+ (High)</option>
              <option>Score 90+ (Ultra Active)</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => alert("Scanning public auto-approval groups...")}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold py-2.5 rounded-lg"
        >
          🔍 Scan & Collect Active Group Links
        </button>
      </div>
    </div>
  )
}
