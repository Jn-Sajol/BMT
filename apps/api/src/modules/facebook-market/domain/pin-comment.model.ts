export interface PinComment {
  id: string
  postId: string
  facebookCommentId?: string
  content: string
  status: "pending" | "published" | "failed"
  createdAt: Date
}
