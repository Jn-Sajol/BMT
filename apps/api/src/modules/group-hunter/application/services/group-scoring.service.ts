import { Injectable } from "@nestjs/common"
import { DiscoveredGroupData } from "./group-discovery.service"

export type GroupScoreRank = "HIGH" | "MEDIUM" | "LOW"

export interface GroupScoreResult {
  groupId: string
  numericScore: number
  rank: GroupScoreRank
  breakdown: {
    memberScore: number
    activityScore: number
    keywordScore: number
    categoryScore: number
    languageScore: number
  }
}

@Injectable()
export class GroupScoringService {
  public calculateGroupScore(
    group: DiscoveredGroupData,
    targetKeywords: string[] = [],
    targetCategory: string = "",
    targetLanguage: string = "English"
  ): GroupScoreResult {
    let memberScore = 0
    let activityScore = 0
    let keywordScore = 0
    let categoryScore = 0
    let languageScore = 0

    // 1. Member Count Scoring (max 30 pts)
    if (group.memberCount >= 50000) memberScore = 30
    else if (group.memberCount >= 10000) memberScore = 25
    else if (group.memberCount >= 2000) memberScore = 20
    else if (group.memberCount >= 500) memberScore = 15
    else memberScore = 5

    // 2. Activity Scoring (max 25 pts)
    const elapsedDays = (Date.now() - group.lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    if (elapsedDays <= 1) activityScore = 25
    else if (elapsedDays <= 7) activityScore = 20
    else if (elapsedDays <= 30) activityScore = 10
    else activityScore = 2

    // 3. Keyword Match Scoring (max 25 pts)
    if (targetKeywords.length > 0) {
      const combinedText = `${group.groupName} ${group.description}`.toLowerCase()
      let matches = 0
      for (const kw of targetKeywords) {
        if (combinedText.includes(kw.toLowerCase())) matches++
      }
      keywordScore = Math.min(25, matches * 10)
    } else {
      keywordScore = 15
    }

    // 4. Category Relevance Scoring (max 10 pts)
    if (targetCategory && group.category.toLowerCase() === targetCategory.toLowerCase()) {
      categoryScore = 10
    } else {
      categoryScore = 5
    }

    // 5. Language Match Scoring (max 10 pts)
    if (targetLanguage && group.language.toLowerCase() === targetLanguage.toLowerCase()) {
      languageScore = 10
    } else {
      languageScore = 5
    }

    const numericScore = memberScore + activityScore + keywordScore + categoryScore + languageScore

    let rank: GroupScoreRank = "LOW"
    if (numericScore >= 70) rank = "HIGH"
    else if (numericScore >= 45) rank = "MEDIUM"

    return {
      groupId: group.groupId,
      numericScore,
      rank,
      breakdown: {
        memberScore,
        activityScore,
        keywordScore,
        categoryScore,
        languageScore
      }
    }
  }
}
