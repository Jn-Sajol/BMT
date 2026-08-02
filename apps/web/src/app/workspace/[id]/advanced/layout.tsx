"use client"

import React from "react"
import { useWorkspace } from "../../../../hooks/useWorkspace"
import { useAuth } from "../../../../hooks/useAuth"
import { useTheme } from "../../../../hooks/useTheme"
import { useRouter } from "next/navigation"

export default function AdvancedLayout({ children }: { children: React.ReactNode }) {
  const { activeWorkspace, selectMode } = useWorkspace()
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  const handleModeSwitch = () => {
    selectMode("SAFE")
    router.push(`/workspace/${activeWorkspace?.id || "workspace-1"}/safe/dashboard`)
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* 1. Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col justify-between p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded bg-orange-600" />
            <span className="font-bold text-lg">BMT ADVANCED</span>
          </div>

          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 px-3 py-1">Active Automations (Risk Mode)</div>
            <button
              onClick={() => router.push(`/workspace/${activeWorkspace?.id || "workspace-1"}/advanced/designer`)}
              className="w-full text-left px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 font-semibold text-xs"
            >
              🎨 Topological Workflow Designer
            </button>
            <button
              onClick={() => router.push(`/workspace/${activeWorkspace?.id || "workspace-1"}/advanced/connect-accounts`)}
              className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-muted text-muted-foreground text-xs font-medium"
            >
              🔐 Connect Accounts (100 FB/Pages)
            </button>
            <button
              onClick={() => router.push(`/workspace/${activeWorkspace?.id || "workspace-1"}/advanced/post-scheduler`)}
              className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-muted text-muted-foreground text-xs font-medium"
            >
              📢 Post Scheduler & AI Variations
            </button>
            <button
              onClick={() => router.push(`/workspace/${activeWorkspace?.id || "workspace-1"}/advanced/group-poster`)}
              className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-muted text-muted-foreground text-xs font-medium"
            >
              👥 Post A Group Engine
            </button>
            <button
              onClick={() => router.push(`/workspace/${activeWorkspace?.id || "workspace-1"}/advanced/comment-assistant`)}
              className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-muted text-muted-foreground text-xs font-medium"
            >
              💬 Smart Comment Assistant
            </button>
            <button
              onClick={() => router.push(`/workspace/${activeWorkspace?.id || "workspace-1"}/advanced/messenger-controller`)}
              className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-muted text-muted-foreground text-xs font-medium"
            >
              📬 Messenger Controller Bot
            </button>
            <button
              onClick={() => router.push(`/workspace/${activeWorkspace?.id || "workspace-1"}/advanced/friend-automation`)}
              className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-muted text-muted-foreground text-xs font-medium"
            >
              🤝 Friend Request & Accept Engine
            </button>
            <button
              onClick={() => router.push(`/workspace/${activeWorkspace?.id || "workspace-1"}/advanced/unfriend-inactive`)}
              className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-muted text-muted-foreground text-xs font-medium"
            >
              🧹 Unfriend Inactive Users
            </button>
            <button
              onClick={() => router.push(`/workspace/${activeWorkspace?.id || "workspace-1"}/advanced/link-comment-block`)}
              className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-muted text-muted-foreground text-xs font-medium"
            >
              🚫 Link Comment Auto-Deleter
            </button>
            <button
              onClick={() => router.push(`/workspace/${activeWorkspace?.id || "workspace-1"}/advanced/group-hunter`)}
              className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-muted text-muted-foreground text-xs font-medium"
            >
              🎯 Active Group & Link Hunter
            </button>
          </nav>
        </div>

        <div className="space-y-4">
          <div className="text-xs text-muted-foreground">
            Workspace: {activeWorkspace?.name || "Corporate"}
          </div>
          <button
            onClick={handleModeSwitch}
            className="w-full rounded bg-blue-600 hover:bg-blue-700 text-white py-1.5 text-xs font-semibold"
          >
            Switch to SAFE
          </button>
        </div>
      </aside>

      {/* 2. Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-8">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Workspace</span>
            <span>/</span>
            <span className="font-semibold text-foreground">{activeWorkspace?.name}</span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 border rounded-lg hover:bg-muted text-sm"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            {/* Profile Dropdown */}
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-medium">{user?.name || "Corporate User"}</span>
              <button
                onClick={handleLogout}
                className="px-2.5 py-1 border rounded text-xs hover:bg-destructive/10 text-destructive"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* View content */}
        <main className="flex-1 overflow-auto p-8 bg-muted/10">
          {children}
        </main>
      </div>
    </div>
  )
}
