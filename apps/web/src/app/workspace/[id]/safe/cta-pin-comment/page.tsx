"use client"

import React, { useState } from "react"

interface CTATemplate {
  id: string
  title: string
  commentText: string
  linkUrl: string
  assignedPage: string
  autoPin: boolean
}

export default function SafeCtaPinCommentPage() {
  const [templates, setTemplates] = useState<CTATemplate[]>([
    { id: "cta-1", title: "Care Hub Order Now Direct Link", commentText: "👉 হেলথ ও কেয়ার ডিসকাউন্ট অফারে অর্ডার করতে ভিসিট করুন: https://bmt.link/care-hub-order 🎁", linkUrl: "https://bmt.link/care-hub-order", assignedPage: "CARE HUB BD", autoPin: true },
    { id: "cta-2", title: "Cooking Blog Customer Care", commentText: "📞 স্পেশাল রেসিপি বুক পেতে সরাসরি মেসেজ দিন: https://wa.me/8801700000000 ⚡", linkUrl: "https://wa.me/8801700000000", assignedPage: "সাধারণ রান্না বান্না ব্লগ", autoPin: true },
    { id: "cta-3", title: "Official Creator Update Link", commentText: "🛒 আমার অফিসিয়াল প্রোফাইল ফলো করুন: https://bmt.link/nb-hridoy 🌿", linkUrl: "https://bmt.link/nb-hridoy", assignedPage: "NB Hridoy Hossen (Profile)", autoPin: true },
  ])

  const [newTitle, setNewTitle] = useState("")
  const [newCommentText, setNewCommentText] = useState("")
  const [newLinkUrl, setNewLinkUrl] = useState("")
  const [newAssignedPage, setNewAssignedPage] = useState("CARE HUB BD")

  const handleAddTemplate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle || !newCommentText) return

    const newItem: CTATemplate = {
      id: `cta-${Date.now()}`,
      title: newTitle,
      commentText: newCommentText,
      linkUrl: newLinkUrl,
      assignedPage: newAssignedPage,
      autoPin: true,
    }

    setTemplates([newItem, ...templates])
    setNewTitle("")
    setNewCommentText("")
    setNewLinkUrl("")
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-extrabold tracking-tight">CTA Pin Comment Automation</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Automatically post a CTA comment upon publication and pin it (pinned: true) using official Facebook Graph API endpoints.
        </p>
      </div>

      {/* Graph API Flow Architecture Card */}
      <div className="border bg-card p-5 rounded-xl space-y-3 shadow-sm">
        <h2 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground">Automatic Execution Flow</h2>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-center">
          <div className="p-2.5 border rounded-lg bg-muted/20 flex-1">1. Post Published (Graph API)</div>
          <span>➔</span>
          <div className="p-2.5 border rounded-lg bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 flex-1">2. Auto Comment Triggered</div>
          <span>➔</span>
          <div className="p-2.5 border rounded-lg bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex-1">3. Graph API: pinned: true Executed</div>
        </div>
      </div>

      {/* Templates Management */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Create Template Form */}
        <div className="border bg-card p-5 rounded-xl space-y-4 shadow-sm text-xs">
          <h2 className="font-extrabold text-sm border-b pb-2">Add New CTA Template</h2>
          <form onSubmit={handleAddTemplate} className="space-y-3">
            <div>
              <label className="font-bold block mb-1">Template Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Summer Special WhatsApp CTA"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Comment Body *</label>
              <textarea
                rows={3}
                required
                placeholder="Write CTA text..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Link URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Assign to Page</label>
              <select
                value={newAssignedPage}
                onChange={(e) => setNewAssignedPage(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background font-semibold"
              >
                <option value="CARE HUB BD">CARE HUB BD</option>
                <option value="সাধারণ রান্না বান্না ব্লগ">সাধারণ রান্না বান্না ব্লগ</option>
                <option value="NB Hridoy Hossen (Profile)">NB Hridoy Hossen (Profile)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg shadow-sm transition"
            >
              Save CTA Template
            </button>
          </form>
        </div>

        {/* Existing Templates */}
        <div className="border bg-card p-5 rounded-xl space-y-4 shadow-sm text-xs">
          <h2 className="font-extrabold text-sm border-b pb-2">Active CTA Templates ({templates.length})</h2>
          <div className="space-y-3">
            {templates.map((tmpl) => (
              <div key={tmpl.id} className="border p-3.5 rounded-lg space-y-2 bg-muted/10">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">{tmpl.title}</span>
                  <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded">
                    ✓ Auto-Pin Active
                  </span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">{tmpl.commentText}</p>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold pt-1 border-t">
                  Page: {tmpl.assignedPage}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
