"use client"

import React, { useState } from "react"

interface LandingPageProject {
  id: string
  title: string
  templateType: "E-commerce" | "Lead Gen" | "Affiliate"
  subdomainUrl: string
  status: "Published" | "Draft"
  createdAt: string
}

export default function SafeLandingPageBuilderPage() {
  const [templateType, setTemplateType] = useState<"E-commerce" | "Lead Gen" | "Affiliate">("E-commerce")
  const [previewDevice, setPreviewDevice] = useState<"Desktop" | "Mobile">("Desktop")
  const [pageTitle, setPageTitle] = useState("Eid Special Premium Watch Landing Page")
  const [headline, setHeadline] = useState("ঈদের সেরা ধামাকা অফারে কিনুন অরিজিনাল ওয়াচ!")
  const [subheadline, setSubheadline] = useState("ফ্রি ডেলিভারি ও ১ বছরের অফিসিয়াল ব্র্যান্ড ওয়ারেন্টি সহ। স্টক সীমিত!")
  const [ctaText, setCTAtext] = useState("এখনই অর্ডার কনফার্ম করুন (ক্যাশ অন ডেলিভারি)")
  const [productPrice, setProductPrice] = useState("২,৪৯০ টাকা (রেগুলার ৩,৯৯০ টাকা)")

  const [savedPages, setSavedPages] = useState<LandingPageProject[]>([
    { id: "page-1", title: "Eid Special Watch Offer", templateType: "E-commerce", subdomainUrl: "https://bmt.page/fashion-hub-eid", status: "Published", createdAt: "2026-07-28" },
    { id: "page-2", title: "Tech Gadgets Lead Magnet", templateType: "Lead Gen", subdomainUrl: "https://bmt.page/tech-gadgets-lead", status: "Published", createdAt: "2026-07-30" },
  ])

  const [generatedLink, setGeneratedLink] = useState<string | null>(null)

  const handlePublishLandingPage = () => {
    const slug = pageTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    const newUrl = `https://bmt.page/${slug}`
    setGeneratedLink(newUrl)

    const newProj: LandingPageProject = {
      id: `proj-${Date.now()}`,
      title: pageTitle,
      templateType: templateType,
      subdomainUrl: newUrl,
      status: "Published",
      createdAt: new Date().toISOString().split("T")[0],
    }

    setSavedPages([newProj, ...savedPages])
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Simple Landing Page Builder</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Build high-converting mobile-responsive landing pages (E-commerce, Lead Gen, Affiliate) for ADS and CTA Pin Comments.
          </p>
        </div>

        {/* Device Preview Toggle */}
        <div className="flex items-center space-x-1.5 bg-muted p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setPreviewDevice("Desktop")}
            className={`px-3 py-1.5 rounded-lg transition ${
              previewDevice === "Desktop" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            💻 Desktop Preview
          </button>
          <button
            onClick={() => setPreviewDevice("Mobile")}
            className={`px-3 py-1.5 rounded-lg transition ${
              previewDevice === "Mobile" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            📱 Mobile Preview
          </button>
        </div>
      </div>

      {generatedLink && (
        <div className="p-4 border rounded-xl bg-emerald-500/10 border-emerald-500/30 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">✓ Landing Page Published Successfully!</span>
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">Ready for ADS & CTA</span>
          </div>
          <div className="flex items-center space-x-2 font-mono font-bold text-foreground">
            <span>BMT Subdomain Link:</span>
            <a href={generatedLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              {generatedLink}
            </a>
          </div>
        </div>
      )}

      {/* Main Grid: Editor & Preview */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Editor Inputs (6 cols) */}
        <div className="lg:col-span-6 space-y-4 border bg-card p-5 rounded-xl shadow-sm text-xs">
          <h2 className="font-extrabold text-sm border-b pb-2">Page Editor Controls</h2>

          <div>
            <label className="font-bold block mb-1">Select Template Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(["E-commerce", "Lead Gen", "Affiliate"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTemplateType(t)}
                  className={`py-1.5 rounded-lg border font-bold ${
                    templateType === t ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "hover:bg-muted"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold block mb-1">Project Name / Page Title *</label>
            <input
              type="text"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-background"
            />
          </div>

          <div>
            <label className="font-bold block mb-1">Main Headline *</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-background"
            />
          </div>

          <div>
            <label className="font-bold block mb-1">Sub-Headline / Key Offer *</label>
            <textarea
              rows={2}
              value={subheadline}
              onChange={(e) => setSubheadline(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-background"
            />
          </div>

          <div>
            <label className="font-bold block mb-1">Price Tag / Offer Badge</label>
            <input
              type="text"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-background"
            />
          </div>

          <div>
            <label className="font-bold block mb-1">CTA Button Text *</label>
            <input
              type="text"
              value={ctaText}
              onChange={(e) => setCTAtext(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-background"
            />
          </div>

          <button
            onClick={handlePublishLandingPage}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 rounded-lg shadow-sm transition flex items-center justify-center space-x-2"
          >
            <span>🚀 Publish Landing Page to BMT Subdomain</span>
          </button>
        </div>

        {/* Live Device Preview (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-start border bg-card p-5 rounded-xl shadow-sm">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Live {previewDevice} Preview
          </span>

          <div
            className={`border rounded-2xl overflow-hidden bg-background shadow-lg transition-all duration-300 ${
              previewDevice === "Mobile" ? "w-[320px] min-h-[540px] border-4 border-muted-foreground/30" : "w-full min-h-[480px]"
            }`}
          >
            {/* Header bar preview */}
            <div className="bg-blue-600 text-white p-4 text-center font-extrabold text-sm space-y-1">
              <span>BMT STORE OFFICIAL</span>
              <span className="text-[10px] font-medium block opacity-90">Free Cash on Delivery All Over Bangladesh</span>
            </div>

            {/* Content Body Preview */}
            <div className="p-5 space-y-4 text-center">
              <div className="h-44 rounded-xl overflow-hidden bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop"
                  alt="Landing page hero"
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="text-base font-black text-foreground leading-snug">{headline}</h2>

              <p className="text-xs text-muted-foreground font-medium">{subheadline}</p>

              <div className="p-3 border rounded-xl bg-muted/20 font-extrabold text-xs text-blue-600 dark:text-blue-400">
                {productPrice}
              </div>

              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-md text-xs transition">
                {ctaText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
