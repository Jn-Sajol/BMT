export interface ViralSearchQuery {
  platform: "facebook" | "youtube" | "tiktok"
  keyword?: string
  niche?: string
  country?: string
  category?: string
  page?: number
  limit?: number
}

export interface ViralContentResult {
  id: string
  title: string
  platform: string
  url: string
  likesCount: number
  commentCount: number
  shareCount: number
  engagementScore: number // Calculated index
  category: string
  country: string
}
