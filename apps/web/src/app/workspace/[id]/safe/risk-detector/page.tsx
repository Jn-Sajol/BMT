"use client"

import React, { useState } from "react"

interface AccountRiskHealth {
  id: string
  pageName: string
  pageId: string
  riskLevel: "Low" | "Medium" | "High"
  riskScore: number // 0 - 100
  postFrequency: string
  apiCallRate: string
  activityPattern: string
  unusualBehavior: string
  issues: string[]
  safetyRecommendations: string[]
}

export default function SafeRiskDetectorPage() {
  const [accountHealths, setAccountHealths] = useState<AccountRiskHealth[]>([
    {
      id: "risk-1",
      pageName: "Fashion Hub Official",
      pageId: "109823487123",
      riskLevel: "Low",
      riskScore: 12,
      postFrequency: "2-3 Posts / Day (Safe Range)",
      apiCallRate: "42 Calls / Hour (Well below Graph API limit)",
      activityPattern: "Natural Human Schedule with Queue Delays",
      unusualBehavior: "None Detected",
      issues: ["No policy violations or abnormal rate spikes detected."],
      safetyRecommendations: [
        "ম্যান্ডেটরি ৫ মিনিট পোস্ট ডিলে সক্রিয় রাখুন।",
        "একই ক্যাপশন বারবার পোস্ট না করে AI Variation Engine ব্যবহার করুন।",
      ],
    },
    {
      id: "risk-2",
      pageName: "Tech Gadgets BD",
      pageId: "987234812314",
      riskLevel: "Medium",
      riskScore: 48,
      postFrequency: "6-8 Posts / Hour (Slightly High)",
      apiCallRate: "185 Calls / Hour (Approaching Graph API threshold)",
      activityPattern: "Rapid burst posting detected between 3 PM - 4 PM",
      unusualBehavior: "Multiple identical links detected in comments",
      issues: [
        "একই সময়ে খুব দ্রুত অনেকগুলো এপিআই কল হচ্ছে।",
        "পোস্টের মাঝে ডিলে টাইম ২ মিনিটের নিচে নেমে গেছে।",
      ],
      safetyRecommendations: [
        "পোস্ট ডিলে টাইম বাড়িয়ে ন্যূনতম ১০-১৫ মিনিট করুন।",
        "Link Comment Block চালু করে স্প্যাম লিংক ফিল্টার নিশ্চিত করুন।",
        "অফিসিয়াল ও-অথ টোকেন রি-অথেনটিকেট করুন।",
      ],
    },
    {
      id: "risk-3",
      pageName: "Organic Superstore",
      pageId: "445123987122",
      riskLevel: "Low",
      riskScore: 8,
      postFrequency: "1 Post / Day (Optimal)",
      apiCallRate: "18 Calls / Hour (Safe)",
      activityPattern: "Consistent scheduled posting via Content Calendar",
      unusualBehavior: "None Detected",
      issues: ["অ্যাকাউন্ট সম্পূর্ণ নিরাপদ রয়েছে।"],
      safetyRecommendations: [
        "বর্তমান শিডিউলিং নিয়ম বজায় রাখুন।",
      ],
    },
  ])

  const [isScanning, setIsScanning] = useState(false)

  const handleRunHealthScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
    }, 1000)
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Risk Score Detector & Account Health Check</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Automated compliance check evaluating post frequency, Graph API call rate, activity patterns, and ban risk level.
          </p>
        </div>

        <button
          onClick={handleRunHealthScan}
          disabled={isScanning}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded-lg transition shadow-sm flex items-center space-x-2"
        >
          <span>{isScanning ? "Scanning Account Health..." : "🩺 Run Full Account Health Scan"}</span>
        </button>
      </div>

      {/* Account Risk Cards List */}
      <div className="space-y-4 text-xs">
        <h2 className="font-extrabold text-sm border-b pb-2">Connected Account Health Analysis ({accountHealths.length})</h2>

        {accountHealths.map((acc) => (
          <div key={acc.id} className="border bg-card p-5 rounded-xl space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
              <div>
                <span className="font-extrabold text-base text-foreground block">{acc.pageName}</span>
                <span className="text-[10px] text-muted-foreground">Page ID: {acc.pageId}</span>
              </div>

              {/* Risk Level Badge */}
              <div className="flex items-center space-x-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                    acc.riskLevel === "Low"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      : acc.riskLevel === "Medium"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                      : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                  }`}
                >
                  {acc.riskLevel} Ban Risk ({acc.riskScore}%)
                </span>
              </div>
            </div>

            {/* Health Indicators Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-semibold">
              <div className="p-2.5 border rounded-lg bg-muted/20">
                <span className="text-[10px] text-muted-foreground block font-bold uppercase">Post Frequency</span>
                <span className="text-foreground">{acc.postFrequency}</span>
              </div>
              <div className="p-2.5 border rounded-lg bg-muted/20">
                <span className="text-[10px] text-muted-foreground block font-bold uppercase">API Call Rate</span>
                <span className="text-foreground">{acc.apiCallRate}</span>
              </div>
              <div className="p-2.5 border rounded-lg bg-muted/20">
                <span className="text-[10px] text-muted-foreground block font-bold uppercase">Activity Pattern</span>
                <span className="text-foreground">{acc.activityPattern}</span>
              </div>
              <div className="p-2.5 border rounded-lg bg-muted/20">
                <span className="text-[10px] text-muted-foreground block font-bold uppercase">Unusual Behavior</span>
                <span className="text-foreground">{acc.unusualBehavior}</span>
              </div>
            </div>

            {/* Issues Breakdown & Specific Safety Suggestions */}
            <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t text-[11px]">
              <div className="space-y-1">
                <span className="font-bold text-red-600 dark:text-red-400 block">Identified Issues / Risk Factor:</span>
                <ul className="list-disc list-inside text-muted-foreground space-y-0.5 font-medium">
                  {acc.issues.map((iss, idx) => (
                    <li key={idx}>{iss}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block">Specific Safety Recommendations:</span>
                <ul className="list-disc list-inside text-muted-foreground space-y-0.5 font-medium">
                  {acc.safetyRecommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
