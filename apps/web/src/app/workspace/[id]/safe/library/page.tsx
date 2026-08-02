"use client"

import React, { useState } from "react"
import { useRouter, useParams } from "next/navigation"

export interface LibraryItem {
  id: string
  title: string
  type: "Image" | "Video" | "Caption" | "Template"
  folder: "Product Photos" | "Videos" | "Captions" | "Templates"
  tags: string[]
  url: string
  size: string
  uploadedAt: string
}

export default function SafeLibraryPage() {
  const router = useRouter()
  const params = useParams()
  const workspaceId = params?.id || "workspace-1"

  const [activeFolder, setActiveFolder] = useState<string>("ALL")
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>("ALL")
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Modal State
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false)
  const [newTitle, setNewTitle] = useState("")
  const [newType, setNewType] = useState<LibraryItem["type"]>("Image")
  const [newFolder, setNewFolder] = useState<LibraryItem["folder"]>("Product Photos")
  const [newTags, setNewTags] = useState("ecommerce, promo, product")
  const [newFileUrl, setNewFileUrl] = useState("")

  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([
    {
      id: "lib-101",
      title: "Premium Wireless Earbuds HD Banner",
      type: "Image",
      folder: "Product Photos",
      tags: ["gadgets", "promo", "banner"],
      url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop",
      size: "2.4 MB (Cloudflare R2)",
      uploadedAt: "2026-07-28",
    },
    {
      id: "lib-102",
      title: "Eid Sale 2026 Promo Video Reel",
      type: "Video",
      folder: "Videos",
      tags: ["video", "reel", "eid-sale"],
      url: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&auto=format&fit=crop",
      size: "18.5 MB (AWS S3)",
      uploadedAt: "2026-07-29",
    },
    {
      id: "lib-103",
      title: "High-Converting Curiosity Hook Caption",
      type: "Caption",
      folder: "Captions",
      tags: ["caption", "bengali-hook", "curiosity"],
      url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop",
      size: "4 KB",
      uploadedAt: "2026-07-30",
    },
    {
      id: "lib-104",
      title: "E-Commerce Carousel Post Template",
      type: "Template",
      folder: "Templates",
      tags: ["template", "carousel", "canva"],
      url: "https://images.unsplash.com/photo-1542744094-3a3172720a8a?w=600&auto=format&fit=crop",
      size: "5.1 MB (Cloudflare R2)",
      uploadedAt: "2026-07-31",
    },
  ])

  // Folders list
  const folders = ["ALL", "Product Photos", "Videos", "Captions", "Templates"]
  const types = ["ALL", "Image", "Video", "Caption", "Template"]

  // Filter items
  const filteredItems = libraryItems.filter((item) => {
    const matchesFolder = activeFolder === "ALL" || item.folder === activeFolder
    const matchesType = activeTypeFilter === "ALL" || item.type === activeTypeFilter
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesFolder && matchesType && matchesSearch
  })

  // Handle New Asset Upload
  const handleUploadAsset = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle) return

    const newItem: LibraryItem = {
      id: `lib-${Date.now()}`,
      title: newTitle,
      type: newType,
      folder: newFolder,
      tags: newTags.split(",").map((t) => t.trim()),
      url: newFileUrl || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop",
      size: "3.5 MB (Cloudflare R2 Storage)",
      uploadedAt: new Date().toISOString().split("T")[0],
    }

    setLibraryItems([newItem, ...libraryItems])
    setShowUploadModal(false)
    setNewTitle("")
    setNewFileUrl("")
  }

  const handleDeleteItem = (id: string) => {
    if (confirm("Remove this asset from Library?")) {
      setLibraryItems((prev) => prev.filter((item) => item.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">SHOPE Asset Library</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Store and organize Images, Videos, Captions, and Templates for instant reuse in Post Scheduler (AWS S3 / Cloudflare R2).
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition shadow-sm flex items-center space-x-2"
        >
          <span>📁 Upload New Asset</span>
        </button>
      </div>

      {/* Folders & Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Folders Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          {folders.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFolder(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                activeFolder === f
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-card border hover:bg-muted text-muted-foreground"
              }`}
            >
              {f === "ALL" ? "📂 All Folders" : `📁 ${f}`}
            </button>
          ))}
        </div>

        {/* Search & Type Filter */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search by title or #tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 border rounded-lg bg-card text-xs w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={activeTypeFilter}
            onChange={(e) => setActiveTypeFilter(e.target.value)}
            className="px-3 py-1.5 border rounded-lg bg-card text-xs font-semibold focus:outline-none"
          >
            <option value="ALL">All Types</option>
            <option value="Image">🖼️ Images</option>
            <option value="Video">🎬 Videos</option>
            <option value="Caption">📝 Captions</option>
            <option value="Template">🎨 Templates</option>
          </select>
        </div>
      </div>

      {/* Grid of Assets */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="border bg-card rounded-xl overflow-hidden shadow-sm flex flex-col justify-between group hover:border-blue-500 transition">
            <div className="space-y-2">
              <div className="h-40 bg-muted relative overflow-hidden">
                <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur">
                  {item.type}
                </span>
                <span className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  {item.folder}
                </span>
              </div>

              <div className="p-3.5 space-y-2">
                <h3 className="font-bold text-xs text-foreground line-clamp-2">{item.title}</h3>
                
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className="bg-muted px-1.5 py-0.5 rounded text-[9px] font-medium text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="text-[10px] text-muted-foreground flex items-center justify-between pt-1 border-t">
                  <span>{item.size}</span>
                  <span>{item.uploadedAt}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-muted/20 border-t flex items-center justify-between gap-2">
              <button
                onClick={() => router.push(`/workspace/${workspaceId}/safe/post-scheduler?libraryAssetId=${item.id}`)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-1.5 rounded transition text-center"
              >
                🚀 Select in Post Scheduler
              </button>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="p-1.5 border hover:bg-destructive/10 text-destructive rounded text-xs"
                title="Delete Asset"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border w-full max-w-md rounded-xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-extrabold">Upload New Asset to Library</h2>
              <button onClick={() => setShowUploadModal(false)} className="text-muted-foreground hover:text-foreground text-sm font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadAsset} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Asset Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Special Product Banner HD"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Asset Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg bg-background font-medium"
                  >
                    <option value="Image">Image</option>
                    <option value="Video">Video</option>
                    <option value="Caption">Caption</option>
                    <option value="Template">Template</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Target Folder</label>
                  <select
                    value={newFolder}
                    onChange={(e) => setNewFolder(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg bg-background font-medium"
                  >
                    <option value="Product Photos">Product Photos</option>
                    <option value="Videos">Videos</option>
                    <option value="Captions">Captions</option>
                    <option value="Templates">Templates</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. product, promo, sale"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Media URL (S3 / R2 / Direct link)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newFileUrl}
                  onChange={(e) => setNewFileUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border rounded-lg font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Upload Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
