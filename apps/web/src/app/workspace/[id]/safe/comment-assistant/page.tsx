"use client"

import React, { useState } from "react"

interface WebhookCommentEvent {
  id: string
  commentId: string
  user: string
  userComment: string
  postTitle: string
  receivedAt: string
  suggestions: string[]
  status: "Pending" | "Replied"
}

interface CommentLibraryItem {
  id: string
  category: string
  replyText: string
  usesCount: number
}

export default function SafeCommentAssistantPage() {
  const [mode, setMode] = useState<"Manual" | "Auto">("Manual")
  const [delayRange, setDelayRange] = useState<string>("30sec - 3min (Random)")
  const [useLibrary, setUseLibrary] = useState<boolean>(true)

  // Real-time Webhook Detected Comments (Manual Mode)
  const [webhookComments, setWebhookComments] = useState<WebhookCommentEvent[]>([
    {
      id: "cm-1",
      commentId: "comment_98234123",
      user: "Tanvir Ahmed",
      userComment: "দাম কত ভাইয়া? ডেলিভারি চার্জ কত পরবে?",
      postTitle: "Eid Special Premium Watch Collection Offer 2026",
      receivedAt: "1 min ago (Webhook Detected)",
      suggestions: [
        "ধন্যবাদ ভাইয়া! প্রিমিয়াম ওয়াচের অফার প্রাইজ মাত্র ২,৪৯০ টাকা। ফ্রি হোম ডেলিভারি পেতে ইনবক্স করুন।",
        "আসসালামু আলাইকুম! ওয়াচটির প্রাইজ ২,৪৯০ টাকা (সারাদেশে ফ্রি ডেলিভারি)। ইনবক্সে মেসেজ চেক করুন ভাইয়া।",
        "ভাইয়া ওয়াচটির দাম ২,৪৯০ টাকা। আপনার ঠিকানা ও ফোন নম্বর ইনবক্সে পাঠিয়ে অর্ডার কনফার্ম করুন।",
      ],
      status: "Pending",
    },
    {
      id: "cm-2",
      commentId: "comment_87123982",
      user: "Nusrat Jahan",
      userComment: "ঢাকার বাইরে কি ক্যাশ অন ডেলিভারি হবে?",
      postTitle: "Eid Special Premium Watch Collection Offer 2026",
      receivedAt: "5 mins ago (Webhook Detected)",
      suggestions: [
        "হ্যাঁ আপু, আমরা পুরো বাংলাদেশে ক্যাশ অন ডেলিভারিতে প্রোডাক্ট পাঠিয়ে থাকি। অর্ডার করতে ইনবক্স করুন।",
        "জি আপু, ঢাকার বাইরেও ক্যাশ অন ডেলিভারি পাওয়া যাবে। এখনই বিস্তারিত জানতে ইনবক্সে মেসেজ দিন।",
      ],
      status: "Pending",
    },
  ])

  // Saved Comment Library (500+ Library Support)
  const [libraryItems, setLibraryItems] = useState<CommentLibraryItem[]>([
    { id: "lib-1", category: "Price Query", replyText: "ধন্যবাদ! অফার প্রাইজ পেতে ইনবক্স চেক করুন ভাইয়া।", usesCount: 142 },
    { id: "lib-2", category: "Delivery Query", replyText: "জি ভাইয়া, আমরা ক্যাশ অন ডেলিভারিতে সারাদেশে ডেলিভারি দিচ্ছি।", usesCount: 89 },
    { id: "lib-[#]", category: "Stock Query", replyText: "প্রোডাক্টের লিমিটেড স্টক আছে। দ্রুত অর্ডার কনফার্ম করুন।", usesCount: 64 },
  ])

  const handleSendManualReply = (commentId: string, replyText: string) => {
    setWebhookComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, status: "Replied" } : c))
    )
    alert(`✓ Reply sent via Facebook Graph API: "${replyText}"`)
  }

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">AI Reply Comment Assistant</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time comment detection via Webhooks, AI context analysis, 500+ Saved Comment Library, and random delays (30s-3m).
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center space-x-1.5 bg-muted p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setMode("Manual")}
            className={`px-3 py-1.5 rounded-lg transition ${
              mode === "Manual" ? "bg-blue-600 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🖐️ Manual Mode (Approve)
          </button>
          <button
            onClick={() => setMode("Auto")}
            className={`px-3 py-1.5 rounded-lg transition ${
              mode === "Auto" ? "bg-purple-600 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🤖 Auto Mode (Random Delay)
          </button>
        </div>
      </div>

      {/* Webhook Status Banner */}
      <div className="p-3 border rounded-xl bg-card flex items-center justify-between text-xs shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="font-bold">Facebook Webhook Comment Listener:</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Active & Listening</span>
        </div>
        <span className="text-muted-foreground">Random Delay: {delayRange}</span>
      </div>

      {/* MANUAL MODE */}
      {mode === "Manual" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <h2 className="font-extrabold text-sm border-b pb-2">Webhook Detected Comments ({webhookComments.length})</h2>

          <div className="space-y-4 text-xs">
            {webhookComments.map((cm) => (
              <div key={cm.id} className="border bg-card p-4 rounded-xl space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-sm text-foreground">{cm.user}</span>
                    <span className="text-[10px] text-muted-foreground block">{cm.postTitle}</span>
                  </div>
                  <span className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold px-2.5 py-0.5 rounded text-[10px]">
                    {cm.receivedAt}
                  </span>
                </div>

                <div className="p-2.5 bg-muted/20 rounded-lg text-foreground font-semibold">
                  "{cm.userComment}"
                </div>

                {cm.status === "Pending" ? (
                  <div className="space-y-2 pt-1">
                    <span className="font-bold text-muted-foreground block text-[11px]">AI Reply Suggestions:</span>
                    <div className="space-y-2">
                      {cm.suggestions.map((sug, idx) => (
                        <div key={idx} className="p-2.5 border rounded-lg bg-card flex items-center justify-between gap-3">
                          <p className="text-muted-foreground flex-1 font-medium">{sug}</p>
                          <button
                            onClick={() => handleSendManualReply(cm.id, sug)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] whitespace-nowrap shadow-sm"
                          >
                            Send Reply
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold rounded-lg text-[11px]">
                    ✓ Replied via Graph API
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AUTO MODE */}
      {mode === "Auto" && (
        <div className="border bg-card p-5 rounded-xl space-y-4 shadow-sm animate-in fade-in duration-200 text-xs">
          <h2 className="font-extrabold text-sm border-b pb-2">Auto Mode Settings</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/10">
              <div>
                <span className="font-bold block">Option A: Use 500+ Saved Comment Library</span>
                <span className="text-[10px] text-muted-foreground">Selects relevant pre-approved reply from library</span>
              </div>
              <input
                type="checkbox"
                checked={useLibrary}
                onChange={(e) => setUseLibrary(e.target.checked)}
                className="h-4 w-4 rounded border-muted text-purple-600"
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/10">
              <div>
                <span className="font-bold block">Option B: Gemini Pro AI Smart Context Reply</span>
                <span className="text-[10px] text-muted-foreground">Generates contextual reply using variation engine to avoid spam</span>
              </div>
              <span className="text-purple-600 font-bold bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded text-[10px]">
                Active
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
