export interface CommentTemplate {
  id: string
  content: string
  category: string
  tags: string[]
  language: string
  status: "Active" | "Archived"
  createdBy: string
  createdAt: Date
  updatedAt: Date
}
export interface CommentLibrary {
  id: string
  name: string
  templates: CommentTemplate[]
}
export interface CommentTarget {
  id: string
  postId: string
  postUrl: string
  authorName: string
}
export interface CommentExecutionReport {
  id: string
  targetPostId: string
  commentText: string
  publishTime: Date
  status: "success" | "failed"
}
