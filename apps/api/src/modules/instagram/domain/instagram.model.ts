export type InstagramPostType = "Feed" | "Story" | "Reel" | "Carousel"
export type InstagramPostStatus = "Draft" | "Scheduled" | "Published" | "Failed"

export interface InstagramProfile {
  id: string
  igUserId: string
  username: string
  fullName: string
  profilePictureUrl?: string
  connectedPageId: string
  accessToken: string
  followerCount: number
  followingCount: number
  createdAt: Date
}

export interface InstagramPost {
  id: string
  profileId: string
  mediaUrl: string
  caption: string
  type: InstagramPostType
  status: InstagramPostStatus
  scheduledFor?: Date
  publishedPostId?: string
  pinnedCtaComment?: string
  createdAt: Date
}

export interface InstagramComment {
  id: string
  postId: string
  username: string
  text: string
  status: "Pending" | "Approved" | "Deleted" | "Ignored"
  createdAt: Date
}

export interface InstagramDM {
  id: string
  senderUsername: string
  text: string
  receivedAt: Date
}

export interface InstagramDMThread {
  id: string
  participantUsername: string
  messages: InstagramDM[]
  lastMessageAt: Date
}
