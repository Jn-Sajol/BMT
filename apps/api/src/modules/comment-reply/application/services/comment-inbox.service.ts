import { Injectable } from "@nestjs/common"

export interface NormalizedCommentEvent {
  commentId: string
  pageId: string
  postId: string
  authorId: string
  authorName: string
  text: string
  timestamp: Date
  isRead: boolean
}

export interface GroupedPostInbox {
  pageId: string
  postId: string
  totalComments: number
  unreadCount: number
  comments: NormalizedCommentEvent[]
}

@Injectable()
export class CommentInboxService {
  private inboxStore: Map<string, NormalizedCommentEvent> = new Map()

  public receiveIncomingEvent(payload: {
    commentId: string
    pageId: string
    postId: string
    authorId?: string
    authorName?: string
    text: string
    timestamp?: Date
  }): { event: NormalizedCommentEvent; isDuplicate: boolean } {
    if (!payload.commentId) {
      throw new Error("Invalid comment payload: missing commentId")
    }

    if (this.inboxStore.has(payload.commentId)) {
      return { event: this.inboxStore.get(payload.commentId)!, isDuplicate: true }
    }

    const event: NormalizedCommentEvent = {
      commentId: payload.commentId,
      pageId: payload.pageId,
      postId: payload.postId,
      authorId: payload.authorId || "unknown",
      authorName: payload.authorName || "User",
      text: payload.text.trim(),
      timestamp: payload.timestamp || new Date(),
      isRead: false
    }

    this.inboxStore.set(event.commentId, event)
    return { event, isDuplicate: false }
  }

  public markAsRead(commentId: string): boolean {
    const item = this.inboxStore.get(commentId)
    if (!item) return false
    item.isRead = true
    return true
  }

  public getGroupedInbox(pageId?: string): GroupedPostInbox[] {
    const groupedMap = new Map<string, NormalizedCommentEvent[]>()

    for (const item of this.inboxStore.values()) {
      if (pageId && item.pageId !== pageId) continue
      const groupKey = `${item.pageId}:${item.postId}`
      if (!groupedMap.has(groupKey)) {
        groupedMap.set(groupKey, [])
      }
      groupedMap.get(groupKey)!.push(item)
    }

    const result: GroupedPostInbox[] = []
    for (const [key, comments] of groupedMap.entries()) {
      const [pId, pstId] = key.split(":")
      const unreadCount = comments.filter((c) => !c.isRead).length
      result.push({
        pageId: pId,
        postId: pstId,
        totalComments: comments.length,
        unreadCount,
        comments
      })
    }

    return result
  }

  public getAllComments(): NormalizedCommentEvent[] {
    return Array.from(this.inboxStore.values())
  }
}
