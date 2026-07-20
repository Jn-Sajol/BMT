export type YouTubeVideoType = "Video" | "Short"
export type YouTubeVideoStatus = "Draft" | "Scheduled" | "Published" | "Failed"

export interface YouTubeChannel {
  id: string
  channelId: string
  title: string
  description?: string
  thumbnailUrl?: string
  googleAccessToken: string
  subscriberCount: number
  viewCount: number
  videoCount: number
  createdAt: Date
}

export interface YouTubeVideo {
  id: string
  channelId: string
  videoUrl: string
  title: string
  description: string
  type: YouTubeVideoType
  status: YouTubeVideoStatus
  scheduledFor?: Date
  publishedVideoId?: string
  pinnedCtaComment?: string
  createdAt: Date
}

export interface YouTubeComment {
  id: string
  videoId: string
  authorName: string
  text: string
  status: "Pending" | "Approved" | "Deleted" | "Ignored"
  createdAt: Date
}
