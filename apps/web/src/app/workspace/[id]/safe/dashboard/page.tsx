"use client"

import React from "react"
import { useRouter, useParams } from "next/navigation"

export default function SafeDashboardPage() {
  const router = useRouter()
  const params = useParams()
  const workspaceId = params?.id || "workspace-1"

  const mockConnectedAccounts = [
    { id: "page-1", name: "NB Hridoy Hossen (Profile)", type: "Facebook Profile", status: "Connected", followers: "5.0K" },
    { id: "page-2", name: "CARE HUB BD", type: "Facebook Page", status: "Connected", followers: "45.2K" },
    { id: "page-3", name: "সাধারণ রান্না বান্না ব্লগ", type: "Facebook Page", status: "Connected", followers: "18.9K" },
  ]

  const mockUpcomingPosts = [
    { id: "post-1", title: "Health & Wellness Special Tips", page: "CARE HUB BD", scheduledFor: "Today, 4:00 PM", status: "Scheduled", type: "Image Post" },
    { id: "post-2", title: "দেশি স্টাইলের খাসির মাংসের রেসিপি", page: "সাধারণ রান্না বান্না ব্লগ", scheduledFor: "Today, 7:30 PM", status: "Scheduled", type: "Reel" },
    { id: "post-3", title: "Official Creator Update 2026", page: "NB Hridoy Hossen (Profile)", scheduledFor: "Tomorrow, 10:00 AM", status: "Scheduled", type: "Text + Link" },
  ]

  const mockActivityLogs = [
    { id: "act-1", user: "Julkar Nayeem (Admin)", action: "Scheduled Master Post with 10 AI Variations", target: "CARE HUB BD", time: "10 mins ago" },
    { id: "act-2", user: "NB Hridoy Hossen", action: "Connected Facebook Page via Official OAuth", target: "CARE HUB BD & সাধারণ রান্না বান্না ব্লগ", time: "Just now" },
    { id: "act-3", user: "System Webhook", action: "Auto-pinned CTA comment on published post", target: "সাধারণ রান্না বান্না ব্লগ", time: "3 hours ago" },
  ]

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Agency Overview Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Central management portal for connected Facebook Pages, post scheduling, and engagement analytics.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push(`/workspace/${workspaceId}/safe/connect-accounts`)}
            className="bg-muted hover:bg-muted/80 text-foreground border text-xs font-semibold px-4 py-2 rounded-lg transition shadow-sm"
          >
            ➕ Connect FB Account (OAuth)
          </button>
          <button
            onClick={() => router.push(`/workspace/${workspaceId}/safe/post-scheduler`)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-sm"
          >
            🚀 Create Master Post
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="border bg-card p-4 rounded-xl shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase">Connected Accounts</span>
          <div className="text-2xl font-extrabold text-foreground">{mockConnectedAccounts.length} Pages</div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">✓ OAuth Tokens Active</span>
        </div>

        <div className="border bg-card p-4 rounded-xl shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase">Today's Scheduled</span>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">2 Posts</div>
          <span className="text-[10px] text-muted-foreground font-medium">Queue Delay Enabled</span>
        </div>

        <div className="border bg-card p-4 rounded-xl shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase">Recent Post Reach</span>
          <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">84.5K</div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">↑ +14.2% this week</span>
        </div>

        <div className="border bg-card p-4 rounded-xl shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase">Avg Engagement</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">6.8%</div>
          <span className="text-[10px] text-muted-foreground font-medium">Likes, Comments & Shares</span>
        </div>
      </div>

      {/* 3. Main Grid: Upcoming Posts & Performance */}
      <div className="grid gap-6 sm:grid-cols-3">
        {/* Upcoming Posts Table */}
        <div className="sm:col-span-2 border bg-card p-5 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-sm">Upcoming Scheduled Posts</h3>
            <button
              onClick={() => router.push(`/workspace/${workspaceId}/safe/post-scheduler`)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View Calendar →
            </button>
          </div>

          <div className="space-y-3">
            {mockUpcomingPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between border p-3 rounded-lg hover:bg-muted/40 transition text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-sm text-foreground block">{post.title}</span>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <span className="bg-muted px-2 py-0.5 rounded font-semibold text-[10px]">{post.page}</span>
                    <span>•</span>
                    <span>{post.type}</span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <span className="bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded text-[10px]">
                    {post.scheduledFor}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connected Accounts Quick List */}
        <div className="border bg-card p-5 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-sm">Connected FB Pages</h3>
            <button
              onClick={() => router.push(`/workspace/${workspaceId}/safe/connect-accounts`)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Manage →
            </button>
          </div>

          <div className="space-y-3">
            {mockConnectedAccounts.map((acc) => (
              <div key={acc.id} className="flex items-center justify-between border p-3 rounded-lg text-xs">
                <div>
                  <span className="font-bold text-foreground block">{acc.name}</span>
                  <span className="text-[10px] text-muted-foreground">{acc.followers} Followers</span>
                </div>
                <span className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded">
                  Connected
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Team Activity Feed */}
      <div className="border bg-card p-5 rounded-xl shadow-sm space-y-4">
        <h3 className="font-bold text-sm border-b pb-3">Team Activity Feed</h3>
        <div className="space-y-3 text-xs">
          {mockActivityLogs.map((log) => (
            <div key={log.id} className="flex items-center justify-between border-b pb-2.5 last:border-0 last:pb-0">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-foreground">{log.user}</span>
                <span className="text-muted-foreground">{log.action} on</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{log.target}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
