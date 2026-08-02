"use client"

import React, { useState } from "react"
import { useRouter, useParams } from "next/navigation"

interface ViralPost {
  id: string
  pageName: string
  postContent: string
  likes: number
  comments: number
  shares: number
  postAge: string
  category: string
  country: string
}

export default function SafeViralContentPage() {
  const router = useRouter()
  const params = useParams()
  const workspaceId = params?.id || "workspace-1"

  const [country, setCountry] = useState("Bangladesh")
  const [category, setCategory] = useState("Fashion & E-Commerce")
  const [keyword, setKeyword] = useState("Eid Sale")
  const [minLikes, setMinLikes] = useState<number>(200)
  const [minComments, setMinComments] = useState<number>(20)
  const [postAgeFilter, setPostAgeFilter] = useState<"1h" | "12h" | "24h">("24h")
  const [isScraping, setIsScraping] = useState(false)

  const [viralPosts, setViralPosts] = useState<ViralPost[]>([
    {
      id: "viral-1",
      pageName: "Trendsetter Fashion BD",
      postContent: "🔥 রেকর্ডসংখ্যক স্টক আউট অফার! প্রিমিয়াম পাঞ্জাবি ও থ্রি পিসে পেয়ে যান ৫০% ফ্ল্যাট ছাড়। এখনই অর্ডার করতে লিংক চেক করুন!",
      likes: 1420,
      comments: 310,
      shares: 185,
      postAge: "6 hours ago",
      category: "Fashion & E-Commerce",
      country: "Bangladesh",
    },
    {
      id: "viral-2",
      pageName: "Tech Hub Official",
      postContent: "গ্যাজেট লাভারদের জন্য সুখবর! বাজেটের মধ্যে সেরা নয়েজ ক্যানসেলিং ইয়ারবাডস চলে এলো। ভিডিওটি দেখুন!",
      likes: 2890,
      comments: 540,
      shares: 412,
      postAge: "12 hours ago",
      category: "Electronics & Tech",
      country: "Bangladesh",
    },
    {
      id: "viral-3",
      pageName: "Organic Mart BD",
      postContent: "১০০% খাঁটি সুন্দরবনের প্রাকৃতিক মধু এখন আপনার হাতের নাগালে। ভেজাল প্রমাণ করতে পারলে মূল্য ফেরত!",
      likes: 890,
      comments: 180,
      shares: 94,
      postAge: "18 hours ago",
      category: "Food & Grocery",
      country: "Bangladesh",
    },
  ])

  const handleScrapeViralContent = () => {
    setIsScraping(true)
    setTimeout(() => {
      setIsScraping(false)
    }, 1200)
  }

  const handleImportToMasterPost = (content: string) => {
    // Redirects directly to Post Scheduler with imported content
    const encoded = encodeURIComponent(content)
    router.push(`/workspace/${workspaceId}/safe/post-scheduler?importedContent=${encoded}`)
  }

  const filteredPosts = viralPosts.filter(
    (p) => p.likes >= minLikes && p.comments >= minComments
  )

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-extrabold tracking-tight">Viral Content Finder (Research Engine)</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Scrape public Facebook pages (no login required) for trending/viral post ideas by Country, Niche, Keyword, Likes & Comments.
        </p>
      </div>

      {/* Scraper Filter Controls */}
      <div className="border bg-card p-5 rounded-xl space-y-4 shadow-sm text-xs">
        <h2 className="font-extrabold text-sm border-b pb-2 flex items-center justify-between">
          <span>Search & Scraper Filters</span>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
            Rate Limiting Active (Safe Scraping)
          </span>
        </h2>

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
            <label className="font-bold block mb-1">Niche / Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-1.5 border rounded-lg bg-background"
            />
          </div>

          <div>
            <label className="font-bold block mb-1">Keyword / Topic</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full px-3 py-1.5 border rounded-lg bg-background"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="font-bold block mb-1">Min Likes Threshold</label>
            <input
              type="number"
              min={200}
              value={minLikes}
              onChange={(e) => setMinLikes(Number(e.target.value))}
              className="w-full px-3 py-1.5 border rounded-lg bg-background"
            />
          </div>

          <div>
            <label className="font-bold block mb-1">Min Comments Threshold</label>
            <input
              type="number"
              min={20}
              value={minComments}
              onChange={(e) => setMinComments(Number(e.target.value))}
              className="w-full px-3 py-1.5 border rounded-lg bg-background"
            />
          </div>

          <div>
            <label className="font-bold block mb-1">Post Age Window</label>
            <div className="grid grid-cols-3 gap-1">
              {(["1h", "12h", "24h"] as const).map((win) => (
                <button
                  key={win}
                  onClick={() => setPostAgeFilter(win)}
                  className={`py-1.5 rounded-lg border font-bold ${
                    postAgeFilter === win ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "hover:bg-muted"
                  }`}
                >
                  {win}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleScrapeViralContent}
          disabled={isScraping}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold py-2.5 rounded-lg shadow-sm transition text-xs flex items-center justify-center space-x-2"
        >
          <span>{isScraping ? "Scraping Public Facebook Pages..." : "🔍 Find Viral Content Inspiration"}</span>
        </button>
      </div>

      {/* Results List */}
      <div className="space-y-4 text-xs">
        <h2 className="font-extrabold text-sm border-b pb-2">Trending Public Posts ({filteredPosts.length})</h2>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredPosts.map((post) => (
            <div key={post.id} className="border bg-card p-4 rounded-xl space-y-3 shadow-sm flex flex-col justify-between hover:border-blue-500 transition">
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-extrabold text-sm text-foreground">{post.pageName}</span>
                  <span className="bg-muted text-muted-foreground font-semibold px-2 py-0.5 rounded text-[10px]">
                    {post.postAge}
                  </span>
                </div>

                <p className="text-muted-foreground text-xs leading-relaxed">{post.postContent}</p>
              </div>

              <div className="space-y-3 pt-2 border-t">
                <div className="grid grid-cols-3 gap-1 text-center text-[10px] font-bold">
                  <div className="p-1.5 border rounded bg-muted/20">👍 {post.likes} Likes</div>
                  <div className="p-1.5 border rounded bg-muted/20">💬 {post.comments} Comments</div>
                  <div className="p-1.5 border rounded bg-muted/20">🔁 {post.shares} Shares</div>
                </div>

                <button
                  onClick={() => handleImportToMasterPost(post.postContent)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg shadow-sm transition flex items-center justify-center space-x-1"
                >
                  <span>✨ Import to Master Post Creator</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
