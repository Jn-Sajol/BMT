"use client"

import React, { useState } from "react"

interface UserMember {
  id: string
  name: string
  email: string
  role: "Agency Admin" | "Team Member" | "Client (Read-Only)"
  assignedPages: string[]
  status: "Active" | "Pending Approval"
}

interface ClientApprovalPost {
  id: string
  title: string
  pageName: string
  scheduledFor: string
  content: string
  status: "Pending Client Approval" | "Approved by Client" | "Rejected by Client"
}

export default function SafeTeamRBACPage() {
  const [currentUserRole, setCurrentUserRole] = useState<"Agency Admin" | "Team Member" | "Client (Read-Only)">("Agency Admin")

  const [members, setMembers] = useState<UserMember[]>([
    { id: "mem-1", name: "Julkar Nayeem", email: "julkar10121@gmail.com", role: "Agency Admin", assignedPages: ["All Pages (Full Access)"], status: "Active" },
    { id: "mem-2", name: "Sarah Rahman", email: "sarah@agency.com", role: "Team Member", assignedPages: ["Fashion Hub Official", "Tech Gadgets BD"], status: "Active" },
    { id: "mem-3", name: "Client Corporate Ops", email: "client@brand.com", role: "Client (Read-Only)", assignedPages: ["Organic Superstore"], status: "Active" },
  ])

  // Client Post Approval List
  const [approvalPosts, setApprovalPosts] = useState<ClientApprovalPost[]>([
    { id: "app-1", title: "Eid Special Superstore Organic Honey Deal", pageName: "Organic Superstore", scheduledFor: "Tomorrow, 10:00 AM", content: "১০০% খাঁটি মধু ঈদ স্পেশাল ডিসকাউন্টে সংগ্রহ করুন।", status: "Pending Client Approval" },
    { id: "app-2", title: "Tech Gadgets Eid Flash Offer", pageName: "Tech Gadgets BD", scheduledFor: "2 Days Later", content: "বাজেট ফ্রেন্ডলি ট্রু ওয়ারলেস ইয়ারবাডস।", status: "Approved by Client" },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newRole, setNewRole] = useState<UserMember["role"]>("Team Member")
  const [selectedPage, setSelectedPage] = useState("Fashion Hub Official")

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !newEmail) return

    const newMem: UserMember = {
      id: `mem-${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      assignedPages: [selectedPage],
      status: "Active",
    }

    setMembers([...members, newMem])
    setShowAddModal(false)
    setNewName("")
    setNewEmail("")
  }

  const handleApprovePost = (id: string) => {
    setApprovalPosts(prev => prev.map(p => p.id === id ? { ...p, status: "Approved by Client" } : p))
  }

  const handleRejectPost = (id: string) => {
    setApprovalPosts(prev => prev.map(p => p.id === id ? { ...p, status: "Rejected by Client" } : p))
  }

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header & Role View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Team & Client RBAC Management</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Role-based access control: Agency Admin (Full Control), Team Member (Assigned Pages), Client (Read-Only & Post Approval).
          </p>
        </div>

        {/* Role Simulator Switcher */}
        <div className="flex items-center space-x-1.5 bg-muted p-1 rounded-xl text-xs font-bold">
          {(["Agency Admin", "Team Member", "Client (Read-Only)"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setCurrentUserRole(r)}
              className={`px-3 py-1.5 rounded-lg transition ${
                currentUserRole === r ? "bg-blue-600 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r === "Agency Admin" ? "👑 Admin" : r === "Team Member" ? "👤 Member" : "👁️ Client"}
            </button>
          ))}
        </div>
      </div>

      {/* Role Notice Banner */}
      <div className="p-3.5 border rounded-xl bg-card flex items-center justify-between text-xs shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-foreground">Current Active Role Simulator:</span>
          <span className="font-black text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950 px-2.5 py-0.5 rounded">
            {currentUserRole}
          </span>
        </div>
        <span className="text-muted-foreground text-[11px]">
          {currentUserRole === "Agency Admin" && "Full administrative permissions across all agency pages & team operations."}
          {currentUserRole === "Team Member" && "Restricted to assigned Facebook pages only. Cannot add/remove OAuth accounts."}
          {currentUserRole === "Client (Read-Only)" && "Read-only report view with post approval/rejection capability."}
        </span>
      </div>

      {/* SECTION 1: Agency Admin & Team Members Table */}
      {(currentUserRole === "Agency Admin" || currentUserRole === "Team Member") && (
        <div className="border bg-card p-5 rounded-xl space-y-4 shadow-sm text-xs">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="font-extrabold text-sm">Agency Team Members ({members.length})</h2>
              <p className="text-muted-foreground text-[11px] mt-0.5">Manage team access and page assignments.</p>
            </div>

            {currentUserRole === "Agency Admin" && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-1.5 rounded-lg shadow-sm"
              >
                ➕ Add Team Member / Client
              </button>
            )}
          </div>

          <div className="space-y-3">
            {members.map((mem) => (
              <div key={mem.id} className="border p-3.5 rounded-xl space-y-1.5 bg-muted/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-sm text-foreground">{mem.name}</span>
                    <span className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded">
                      {mem.role}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">{mem.email}</span>
                </div>

                <div className="flex items-center space-x-3 text-[11px]">
                  <span className="text-muted-foreground">Assigned: <strong className="text-foreground">{mem.assignedPages.join(", ")}</strong></span>
                  {currentUserRole === "Agency Admin" && mem.role !== "Agency Admin" && (
                    <button
                      onClick={() => setMembers(prev => prev.filter(m => m.id !== mem.id))}
                      className="text-red-500 hover:underline font-bold"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: Client Post Approval Panel */}
      <div className="border bg-card p-5 rounded-xl space-y-4 shadow-sm text-xs">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="font-extrabold text-sm">Client Post Approval Portal ({approvalPosts.length})</h2>
            <p className="text-muted-foreground text-[11px] mt-0.5">Clients can review and approve scheduled posts before publication.</p>
          </div>
          <span className="bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold px-2.5 py-0.5 rounded text-[10px]">
            Read-Only Approved Queue
          </span>
        </div>

        <div className="space-y-3">
          {approvalPosts.map((post) => (
            <div key={post.id} className="border p-4 rounded-xl space-y-2 bg-muted/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <span className="font-extrabold text-sm text-foreground block">{post.title}</span>
                <p className="text-muted-foreground text-[11px]">{post.content}</p>
                <div className="flex items-center space-x-3 text-[10px] text-muted-foreground pt-1">
                  <span>Page: <strong className="text-foreground">{post.pageName}</strong></span>
                  <span>•</span>
                  <span>Scheduled: {post.scheduledFor}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {post.status === "Pending Client Approval" ? (
                  <>
                    <button
                      onClick={() => handleApprovePost(post.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-sm"
                    >
                      ✓ Approve Post
                    </button>
                    <button
                      onClick={() => handleRejectPost(post.id)}
                      className="border border-red-500/30 hover:bg-red-500/10 text-red-500 font-bold px-3 py-1.5 rounded-lg text-xs"
                    >
                      ✕ Reject
                    </button>
                  </>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      post.status === "Approved by Client"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                    }`}
                  >
                    {post.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border w-full max-w-md rounded-xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-extrabold">Add New Team Member / Client</h2>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground font-bold">✕</button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Ahmed"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="tanvir@agency.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Role Type</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-lg bg-background font-semibold"
                >
                  <option value="Team Member">Team Member (Assigned Pages Only)</option>
                  <option value="Client (Read-Only)">Client (Read-Only & Post Approval)</option>
                  <option value="Agency Admin">Agency Admin (Full Control)</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Assign Page Access</label>
                <select
                  value={selectedPage}
                  onChange={(e) => setSelectedPage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-background font-semibold"
                >
                  <option value="Fashion Hub Official">Fashion Hub Official</option>
                  <option value="Tech Gadgets BD">Tech Gadgets BD</option>
                  <option value="Organic Superstore">Organic Superstore</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
