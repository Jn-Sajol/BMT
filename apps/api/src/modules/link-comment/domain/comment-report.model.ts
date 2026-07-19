export interface CommentReport {
  id: string
  totalCommentsCount: number
  linkCommentsCount: number
  deletedCommentsCount: number
  ignoredCommentsCount: number
  topDomains: string[]
}
