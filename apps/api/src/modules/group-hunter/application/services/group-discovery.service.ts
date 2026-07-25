import { Injectable } from "@nestjs/common"

export interface DiscoveredGroupData {
  groupId: string
  groupName: string
  groupUrl: string
  memberCount: number
  privacy: "PUBLIC" | "PRIVATE"
  language: string
  category: string
  lastActivity: Date
  description: string
  workspaceId: string
  accountId: string
  metadata?: Record<string, any>
}

@Injectable()
export class GroupDiscoveryService {
  private groupStore: Map<string, DiscoveredGroupData> = new Map()
  private seenGroupIds: Set<string> = new Set()

  public processDiscoveredGroup(payload: {
    groupId: string
    groupName?: string
    groupUrl?: string
    memberCount?: number
    privacy?: "PUBLIC" | "PRIVATE"
    language?: string
    category?: string
    lastActivity?: Date
    description?: string
    workspaceId: string
    accountId: string
    metadata?: Record<string, any>
  }): { group: DiscoveredGroupData; isDuplicate: boolean } {
    if (!payload.groupId) {
      throw new Error("Invalid group discovery payload: missing groupId")
    }

    const isDuplicate = this.seenGroupIds.has(payload.groupId)
    if (isDuplicate) {
      const existing = this.groupStore.get(payload.groupId)!
      return { group: existing, isDuplicate: true }
    }

    this.seenGroupIds.add(payload.groupId)
    const group: DiscoveredGroupData = {
      groupId: payload.groupId,
      groupName: payload.groupName?.trim() || `Facebook Group (${payload.groupId})`,
      groupUrl: payload.groupUrl || `https://facebook.com/groups/${payload.groupId}`,
      memberCount: payload.memberCount ?? 100,
      privacy: payload.privacy || "PUBLIC",
      language: payload.language || "English",
      category: payload.category || "GENERAL",
      lastActivity: payload.lastActivity || new Date(),
      description: payload.description || "",
      workspaceId: payload.workspaceId,
      accountId: payload.accountId,
      metadata: payload.metadata || {}
    }

    this.groupStore.set(payload.groupId, group)
    return { group, isDuplicate: false }
  }

  public getDiscoveredGroup(groupId: string): DiscoveredGroupData | null {
    return this.groupStore.get(groupId) || null
  }

  public getAllDiscoveredGroups(): DiscoveredGroupData[] {
    return Array.from(this.groupStore.values())
  }
}
