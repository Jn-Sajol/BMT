import { Injectable } from "@nestjs/common"

export interface ProcessedCommentItem {
  commentId: string
  authorId: string
  text: string
  normalizedText: string
  detectedLanguage: string
  isSpam: boolean
  isEmpty: boolean
  isDeleted: boolean
  timestamp: Date
}

export interface ProcessingResultBatch {
  batchId: string
  totalReceived: number
  processedCount: number
  duplicatesRemoved: number
  emptyRemoved: number
  deletedRemoved: number
  spamCount: number
  comments: ProcessedCommentItem[]
}

@Injectable()
export class CommentProcessingService {
  public normalizeText(text: string): string {
    if (!text) return ""
    return text
      .replace(/\s+/g, " ")
      .replace(/[\r\n]+/g, " ")
      .trim()
  }

  public detectLanguage(text: string): string {
    if (!text) return "EN"
    // Simple heuristic rule: check for Bangla Unicode range \u0980-\u09FF
    if (/[\u0980-\u09FF]/.test(text)) {
      return "BN"
    }
    // Spanish accent markers
    if (/[áéíóúñ¿¡]/i.test(text)) {
      return "ES"
    }
    return "EN"
  }

  public detectSpam(text: string): boolean {
    if (!text) return false
    const lower = text.toLowerCase()
    const spamPatterns = [
      "free money",
      "click here",
      "bit.ly/",
      "t.me/",
      "whatsapp group link",
      "earn 1000$",
      "casino",
      "lottery"
    ]
    return spamPatterns.some((pattern) => lower.includes(pattern))
  }

  public processBatch(batchId: string, rawComments: Array<{ commentId: string; authorId: string; text: string; timestamp?: Date }>): ProcessingResultBatch {
    let duplicatesRemoved = 0
    let emptyRemoved = 0
    let deletedRemoved = 0
    let spamCount = 0

    const seenCommentIds = new Set<string>()
    const processedComments: ProcessedCommentItem[] = []

    for (const c of rawComments) {
      if (!c.commentId || seenCommentIds.has(c.commentId)) {
        duplicatesRemoved++
        continue
      }
      seenCommentIds.add(c.commentId)

      if (c.text === "[deleted]" || c.text === "[removed]") {
        deletedRemoved++
        continue
      }

      const normalized = this.normalizeText(c.text)
      if (!normalized) {
        emptyRemoved++
        continue
      }

      const isSpam = this.detectSpam(normalized)
      if (isSpam) {
        spamCount++
      }

      const lang = this.detectLanguage(normalized)

      processedComments.push({
        commentId: c.commentId,
        authorId: c.authorId || "unknown",
        text: c.text,
        normalizedText: normalized,
        detectedLanguage: lang,
        isSpam,
        isEmpty: false,
        isDeleted: false,
        timestamp: c.timestamp || new Date()
      })
    }

    return {
      batchId,
      totalReceived: rawComments.length,
      processedCount: processedComments.length,
      duplicatesRemoved,
      emptyRemoved,
      deletedRemoved,
      spamCount,
      comments: processedComments
    }
  }
}
