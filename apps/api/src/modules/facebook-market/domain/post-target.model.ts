export type PostTargetType = "Account" | "Page"

export interface PostTarget {
  id: string
  targetId: string // fbUserId or pageId
  type: PostTargetType
}
