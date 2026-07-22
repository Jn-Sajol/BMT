import { Injectable, NotFoundException } from "@nestjs/common"
import { CommentInboxRepository } from "../../infrastructure/comment-inbox.repository"
import { ReplyHistory } from "../../domain/comment-inbox.model"
import { ReplyVariationService } from "./reply-variation.service"

export interface RuleBasedSuggestion {
  intentCategory: "Price" | "Info" | "Order" | "Greeting" | "General"
  baseTemplate: string
  suggestions: string[]
}

@Injectable()
export class ReplySuggestionService {
  constructor(
    private readonly commentInboxRepository: CommentInboxRepository,
    private readonly variationService: ReplyVariationService = new ReplyVariationService()
  ) {}

  public classifyIntent(commentText: string): "Price" | "Info" | "Order" | "Greeting" | "General" {
    if (!commentText) return "General"
    const lower = commentText.toLowerCase()

    if (/price|cost|how much|dam|koto/i.test(lower)) {
      return "Price"
    } else if (/info|detail|address|location|where/i.test(lower)) {
      return "Info"
    } else if (/order|buy|inbox|dm|want/i.test(lower)) {
      return "Order"
    } else if (/hello|hi|hey|assalamu|greetings/i.test(lower)) {
      return "Greeting"
    }
    return "General"
  }

  public generateSuggestionsLocal(commentText: string): RuleBasedSuggestion {
    const intentCategory = this.classifyIntent(commentText)

    let baseTemplate = "Thank you for reaching out to us!"
    if (intentCategory === "Price") {
      baseTemplate = "Hello! Check your inbox for full pricing details."
    } else if (intentCategory === "Info") {
      baseTemplate = "Hi! Please visit our official page or send a message for full details."
    } else if (intentCategory === "Order") {
      baseTemplate = "Thank you! Please send us a direct message with your contact number to confirm."
    } else if (intentCategory === "Greeting") {
      baseTemplate = "Hello there! How can we assist you today?"
    }

    const suggestions = this.variationService.generateVariations(baseTemplate)

    return {
      intentCategory,
      baseTemplate,
      suggestions
    }
  }

  public async generateSuggestions(inboxId: string): Promise<string[]> {
    const item = await this.commentInboxRepository.findById(inboxId)
    const text = item ? item.content : "Hello"
    const ruleResult = this.generateSuggestionsLocal(text)
    return ruleResult.suggestions
  }

  public async approveAndReply(
    inboxId: string,
    originalText: string,
    replyText: string,
    user: string
  ): Promise<ReplyHistory> {
    const item = await this.commentInboxRepository.findById(inboxId)
    if (!item) {
      throw new NotFoundException("Comment inbox item not found to reply.")
    }
    item.status = "Replied"
    await this.commentInboxRepository.save(item)

    const history: ReplyHistory = {
      id: `rh-${Date.now()}`,
      inboxId,
      originalComment: originalText,
      selectedReply: replyText,
      editedReply: replyText,
      user,
      timestamp: new Date(),
    }
    return this.commentInboxRepository.saveHistory(history)
  }

  public async getHistory(): Promise<ReplyHistory[]> {
    return this.commentInboxRepository.getHistory()
  }
}
