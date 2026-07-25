import { Injectable } from "@nestjs/common"
import { DiscoveredGroupData } from "./group-discovery.service"
import { GroupScoreResult } from "./group-scoring.service"

export type GroupCandidateStatus = "Pending" | "Approved" | "Rejected" | "Archived"

export interface GroupCandidateQueueItem {
  candidateId: string
  groupId: string
  groupName: string
  groupUrl: string
  scoreResult: GroupScoreResult
  status: GroupCandidateStatus
  workspaceId: string
  accountId: string
  addedAt: Date
  updatedAt: Date
}

@Injectable()
export class GroupCandidateQueueService {
  private queueStore: Map<string, GroupCandidateQueueItem> = new Map()

  public addCandidateToQueue(
    group: DiscoveredGroupData,
    scoreResult: GroupScoreResult
  ): GroupCandidateQueueItem {
    const candidateId = `cand-${group.groupId}`
    const existing = this.queueStore.get(candidateId)

    if (existing) {
      existing.scoreResult = scoreResult
      existing.updatedAt = new Date()
      return existing
    }

    const item: GroupCandidateQueueItem = {
      candidateId,
      groupId: group.groupId,
      groupName: group.groupName,
      groupUrl: group.groupUrl,
      scoreResult,
      status: "Pending",
      workspaceId: group.workspaceId,
      accountId: group.accountId,
      addedAt: new Date(),
      updatedAt: new Date()
    }

    this.queueStore.set(candidateId, item)
    return item
  }

  public updateCandidateStatus(candidateId: string, status: GroupCandidateStatus): GroupCandidateQueueItem | null {
    const item = this.queueStore.get(candidateId)
    if (!item) return null

    item.status = status
    item.updatedAt = new Date()
    return item
  }

  public getCandidatesByStatus(status?: GroupCandidateStatus): GroupCandidateQueueItem[] {
    const all = Array.from(this.queueStore.values())
    if (!status) return all
    return all.filter((i) => i.status === status)
  }
}
