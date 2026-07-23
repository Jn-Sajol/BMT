import { Injectable } from "@nestjs/common"

export interface MessengerGroupMetadata {
  groupId: string
  groupName: string
  participantCount: number
  lastMessage: string
  lastActivity: Date
  unreadCount: number
  groupImage?: string
  workspaceId: string
  accountId: string
  metadata: Record<string, any>
}

@Injectable()
export class MessengerGroupDiscoveryService {
  private groupStore: Map<string, MessengerGroupMetadata> = new Map()
  private processedEventIds: Set<string> = new Set()

  public processIncomingGroupEvent(payload: {
    eventId?: string
    groupId: string
    groupName?: string
    participantCount?: number
    lastMessage?: string
    lastActivity?: Date
    unreadCount?: number
    groupImage?: string
    workspaceId: string
    accountId: string
    metadata?: Record<string, any>
  }): { group: MessengerGroupMetadata; isDuplicate: boolean } {
    if (!payload.groupId) {
      throw new Error("Invalid group event: missing groupId")
    }

    if (payload.eventId && this.processedEventIds.has(payload.eventId)) {
      const existing = this.groupStore.get(payload.groupId)!
      return { group: existing, isDuplicate: true }
    }
    if (payload.eventId) {
      this.processedEventIds.add(payload.eventId)
    }

    const existing = this.groupStore.get(payload.groupId)
    const now = payload.lastActivity || new Date()

    if (existing) {
      existing.groupName = payload.groupName || existing.groupName
      existing.participantCount = payload.participantCount ?? existing.participantCount
      existing.lastMessage = payload.lastMessage?.trim() || existing.lastMessage
      existing.lastActivity = now
      existing.unreadCount = payload.unreadCount ?? (existing.unreadCount + 1)
      if (payload.groupImage) existing.groupImage = payload.groupImage
      if (payload.metadata) existing.metadata = { ...existing.metadata, ...payload.metadata }
      return { group: existing, isDuplicate: false }
    }

    const group: MessengerGroupMetadata = {
      groupId: payload.groupId,
      groupName: payload.groupName || "Unnamed Messenger Group",
      participantCount: payload.participantCount || 2,
      lastMessage: payload.lastMessage?.trim() || "",
      lastActivity: now,
      unreadCount: payload.unreadCount ?? 1,
      groupImage: payload.groupImage || "",
      workspaceId: payload.workspaceId,
      accountId: payload.accountId,
      metadata: payload.metadata || {}
    }

    this.groupStore.set(payload.groupId, group)
    return { group, isDuplicate: false }
  }

  public getGroup(groupId: string): MessengerGroupMetadata | null {
    return this.groupStore.get(groupId) || null
  }

  public getAllGroups(): MessengerGroupMetadata[] {
    return Array.from(this.groupStore.values())
  }
}
