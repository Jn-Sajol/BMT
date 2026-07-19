export type FriendManagementStatus = "Active" | "Inactive"

export type FriendCategory = "Favorites" | "Customers" | "Leads" | "Personal" | "Business"

export interface FriendProfile {
  id: string
  fbFriendId: string
  name: string
  category: FriendCategory
  status: FriendManagementStatus
  addedAt: Date
  lastInteractionAt: Date
}

export interface FriendRequest {
  id: string
  fbUserId: string
  name: string
  type: "incoming" | "outgoing"
  status: "pending" | "accepted" | "rejected" | "cancelled"
  createdAt: Date
}

export interface FriendActivity {
  id: string
  friendId: string
  action: "added" | "removed" | "request_accepted" | "request_rejected" | "category_change"
  user: string
  timestamp: Date
}

export interface UnfriendCandidate {
  id: string
  friendId: string
  name: string
  daysInactive: number
}

export interface FriendManagementSettings {
  maxDailyRequests: number
}
