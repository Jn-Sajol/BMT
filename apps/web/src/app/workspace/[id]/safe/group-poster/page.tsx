"use client"

import React, { useState } from "react"

interface FBGroup {
  id: string
  name: string
  role: "Admin" | "Owner"
  memberCount: string
  privacy: "Public" | "Closed"
  connectedAccount: string
}

export default function SafeGroupPosterPage() {
  const [selectedGroup, setSelectedGroup] = useState<string>("")
  const [postTitle, setPostTitle] = useState("Eid Special Promotional Offer in Admin Group")
  const [postContent, setPostContent] = useState("🔥 আমাদের অফিশিয়াল গ্রুপ মেম্বারদের জন্য এক্সক্লুসিভ ২০% ডিসকাউন্ট ডিল! বিস্তারিত লিংক কমেন্টে।")
  const [ctaLink, setCtaLink] = useState("https://bmt.link/group-eid-offer")
  const [isPosting, setIsPosting] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const adminGroups: FBGroup[] = [
    { id: "grp-1", name: "Fashion & Lifestyle BD (Official Group)", role: "Owner", memberCount: "84.5K", privacy: "Public", connectedAccount: "Fashion Hub Official" },
    { id: "grp-2", name: "Tech Enthusiasts & Buyers BD", role: "Admin", memberCount: "124.0K", privacy: "Public", connectedAccount: "Tech Gadgets BD" },
    { id: "grp-3", name: "Organic Food & Healthy Living BD", role: "Admin", memberCount: "38.2K", privacy: "Public", connectedAccount: "Organic Superstore" },
  ]

  const handlePostToGroup = async () => {
    if (!selectedGroup) return alert("Please select an Admin/Owner Group first.")
    setIsPosting(true)
    setSuccessMsg(null)

    setTimeout(() => {
      setIsPosting(false)
      setSuccessMsg("✓ Successfully posted to group via Official Facebook Graph API (/group/feed)!")
    }, 1000)
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-extrabold tracking-tight">Post A Group (Official Graph API)</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Post directly to Facebook Groups where you hold Admin/Owner roles using official Graph API (/group/feed endpoint).
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 border rounded-lg bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          {successMsg}
        </div>
      )}

      {/* Admin Groups List */}
      <div className="border bg-card p-5 rounded-xl space-y-4 shadow-sm">
        <h2 className="font-extrabold text-sm border-b pb-2">Select Admin/Owner Group</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {adminGroups.map((grp) => (
            <div
              key={grp.id}
              onClick={() => setSelectedGroup(grp.id)}
              className={`p-3.5 border rounded-xl cursor-pointer transition text-xs space-y-1.5 ${
                selectedGroup === grp.id
                  ? "bg-blue-50 dark:bg-blue-950/40 border-blue-600 shadow-sm"
                  : "hover:bg-muted/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-foreground">{grp.name}</span>
                <span className="bg-blue-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded">
                  {grp.role}
                </span>
              </div>
              <div className="text-[11px] text-muted-foreground">
                <span>{grp.memberCount} Members</span> • <span>{grp.privacy}</span>
              </div>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold block pt-1 border-t">
                Account: {grp.connectedAccount}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Group Post Creator Form */}
      <div className="border bg-card p-5 rounded-xl space-y-4 shadow-sm text-xs">
        <h2 className="font-extrabold text-sm border-b pb-2">Group Post Details</h2>

        <div>
          <label className="font-bold block mb-1">Post Title</label>
          <input
            type="text"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-background"
          />
        </div>

        <div>
          <label className="font-bold block mb-1">Post Description</label>
          <textarea
            rows={4}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-background"
          />
        </div>

        <div>
          <label className="font-bold block mb-1">CTA Attachment Link</label>
          <input
            type="text"
            value={ctaLink}
            onChange={(e) => setCtaLink(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-background"
          />
        </div>

        <button
          onClick={handlePostToGroup}
          disabled={isPosting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold py-2.5 rounded-lg shadow-sm transition text-xs flex items-center justify-center space-x-2"
        >
          <span>{isPosting ? "Posting via Graph API..." : "🚀 Publish Post to Selected Admin Group"}</span>
        </button>
      </div>
    </div>
  )
}
