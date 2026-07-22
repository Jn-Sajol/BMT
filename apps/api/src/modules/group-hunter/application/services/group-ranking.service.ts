import { Injectable } from "@nestjs/common"

export interface CandidateGroupRaw {
  id: string
  name: string
  description?: string
  memberCount: number
  privacy: "PUBLIC" | "PRIVATE"
  groupType?: "BUY_SELL" | "GENERAL"
}

export interface ScoredCandidateGroup extends CandidateGroupRaw {
  relevanceScore: number // 0-100 AI relevance score
  priorityScore: number  // 0-100 Priority ranking score
  isDuplicate: boolean
}

@Injectable()
export class GroupRankingService {
  public calculateRelevanceScore(group: CandidateGroupRaw, keyword: string): number {
    if (!keyword) return 50
    const normalizedKeyword = keyword.toLowerCase().trim()
    const nameMatch = group.name.toLowerCase().includes(normalizedKeyword)
    const descMatch = group.description ? group.description.toLowerCase().includes(normalizedKeyword) : false

    let score = 30
    if (nameMatch) score += 50
    if (descMatch) score += 20
    return Math.min(100, score)
  }

  public calculatePriorityScore(group: CandidateGroupRaw, relevanceScore: number): number {
    let sizeBonus = 0
    if (group.memberCount > 50000) sizeBonus = 30
    else if (group.memberCount > 10000) sizeBonus = 20
    else if (group.memberCount > 1000) sizeBonus = 10

    const privacyBonus = group.privacy === "PUBLIC" ? 20 : 10
    const weightedRelevance = relevanceScore * 0.5

    return Math.min(100, Math.round(weightedRelevance + sizeBonus + privacyBonus))
  }

  public detectDuplicates(groups: CandidateGroupRaw[], existingGroupIds: Set<string>): ScoredCandidateGroup[] {
    return groups.map((g) => {
      const isDuplicate = existingGroupIds.has(g.id)
      const relScore = this.calculateRelevanceScore(g, "")
      const prioScore = this.calculatePriorityScore(g, relScore)
      return {
        ...g,
        relevanceScore: relScore,
        priorityScore: prioScore,
        isDuplicate
      }
    })
  }
}
