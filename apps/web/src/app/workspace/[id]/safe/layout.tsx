"use client"

import React from "react"
import { useWorkspace } from "../../../../hooks/useWorkspace"
import { useAuth } from "../../../../hooks/useAuth"
import { useTheme } from "../../../../hooks/useTheme"
import { useRouter, usePathname } from "next/navigation"

export default function SafeLayout({ children }: { children: React.ReactNode }) {
  const { activeWorkspace } = useWorkspace()
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()

  const workspaceId = activeWorkspace?.id || "workspace-1"

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  const isActive = (path: string) => pathname.includes(path)

  const navItems = [
    {
      category: "Main & Accounts",
      items: [
        { label: "📊 Overview Dashboard", path: `/workspace/${workspaceId}/safe/dashboard` },
        { label: "🔗 Connect FB Pages (OAuth)", path: `/workspace/${workspaceId}/safe/connect-accounts` },
        { label: "📁 Asset Library", path: `/workspace/${workspaceId}/safe/library` },
      ],
    },
    {
      category: "Post Suite & Content",
      items: [
        { label: "🚀 AI Post Scheduler", path: `/workspace/${workspaceId}/safe/post-scheduler` },
        { label: "🖼️ Clickable Image Generator", path: `/workspace/${workspaceId}/safe/clickable-image` },
        { label: "📄 Landing Page Builder", path: `/workspace/${workspaceId}/safe/landing-page` },
        { label: "📥 Media Downloader", path: `/workspace/${workspaceId}/safe/downloader` },
      ],
    },
    {
      category: "Engagement & Moderation",
      items: [
        { label: "👥 Post A Group", path: `/workspace/${workspaceId}/safe/group-poster` },
        { label: "📌 CTA Pin Comment", path: `/workspace/${workspaceId}/safe/cta-pin-comment` },
        { label: "💬 AI Comment Assistant", path: `/workspace/${workspaceId}/safe/comment-assistant` },
        { label: "🛡️ Link Comment Block", path: `/workspace/${workspaceId}/safe/link-comment-block` },
        { label: "📥 AI Inbox Reply Assistant", path: `/workspace/${workspaceId}/safe/inbox-assistant` },
      ],
    },
    {
      category: "Research & Intelligence",
      items: [
        { label: "🔥 Viral Content Finder", path: `/workspace/${workspaceId}/safe/viral-content` },
        { label: "🔎 FB Group Hunter", path: `/workspace/${workspaceId}/safe/group-hunter` },
        { label: "🩺 Risk Score Detector", path: `/workspace/${workspaceId}/safe/risk-detector` },
      ],
    },
    {
      category: "Agency & Team",
      items: [
        { label: "👥 Team & Client Roles", path: `/workspace/${workspaceId}/safe/team` },
      ],
    },
  ]

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* 1. Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col justify-between p-4 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 px-2 py-1">
            <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
              BMT
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight block leading-none">BMT SAFE</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Official Graph API</span>
            </div>
          </div>

          <nav className="space-y-4 overflow-y-auto max-h-[calc(100vh-210px)] pr-1 text-xs">
            {navItems.map((group, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-0.5">
                  {group.category}
                </div>
                {group.items.map((item) => {
                  const active = isActive(item.path)
                  return (
                    <button
                      key={item.path}
                      onClick={() => router.push(item.path)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md transition font-medium text-xs flex items-center justify-between ${
                        active
                          ? "bg-blue-600 text-white font-semibold shadow-sm"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </div>
            ))}
          </nav>
        </div>

        <div className="space-y-3 pt-3 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span className="truncate font-medium">Workspace: {activeWorkspace?.name || "Corporate"}</span>
          </div>

          <button
            onClick={() => router.push(`/workspace/${workspaceId}/advanced/connect-accounts`)}
            className="w-full rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900 py-1.5 text-xs font-bold transition flex items-center justify-center space-x-1"
          >
            <span>⚡ Switch to ADVANCED</span>
          </button>
        </div>
      </aside>

      {/* 2. Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-14 border-b bg-card flex items-center justify-between px-6">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">BMT Marketing OS</span>
            <span>/</span>
            <span className="bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded text-[10px]">
              SAFE Version
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-1.5 border rounded-lg hover:bg-muted text-xs transition"
              title="Toggle Light/Dark Theme"
            >
              {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            {/* Profile Info */}
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1.5">
                <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                  {user?.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <span className="font-semibold">{user?.name || "Agency Admin"}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-2.5 py-1 border rounded-md text-xs hover:bg-destructive/10 text-destructive font-medium transition"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* View content */}
        <main className="flex-1 overflow-auto p-6 bg-muted/10">
          {children}
        </main>
      </div>
    </div>
  )
}
