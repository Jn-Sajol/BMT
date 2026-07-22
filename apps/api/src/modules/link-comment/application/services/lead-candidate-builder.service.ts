import { Injectable } from "@nestjs/common"
import { ProcessedCommentItem } from "./comment-processing.service"
import { LeadScoreService } from "./lead-score.service"

export interface LeadCandidate {
  commentId: string
  authorId: string
  leadScore: number
  detectedLanguage: string
  matchedKeywords: string[]
  contactHints: {
    phone?: string
    email?: string
  }
  riskLevel: "Low" | "Medium" | "High"
  processingTimeMs: number
  createdAt: Date
}

@Injectable()
export class LeadCandidateBuilder {
  constructor(private readonly leadScoreService: LeadScoreService) {}

  public buildLeadCandidate(
    comment: ProcessedCommentItem,
    customKeywords: string[] = []
  ): LeadCandidate {
    const startTime = Date.now()

    const { score, factors } = this.leadScoreService.calculateScore(comment.normalizedText, customKeywords)

    // Determine risk level based on spam status and score
    let riskLevel: "Low" | "Medium" | "High" = "Low"
    if (comment.isSpam) {
      riskLevel = "High"
    } else if (score < 30) {
      riskLevel = "Medium"
    }

    const duration = Date.now() - startTime

    return {
      commentId: comment.commentId,
      authorId: comment.authorId,
      leadScore: score,
      detectedLanguage: comment.detectedLanguage,
      matchedKeywords: factors.matchedKeywords,
      contactHints: factors.contactHints,
      riskLevel,
      processingTimeMs: duration,
      createdAt: new Date()
    }
  }
}
