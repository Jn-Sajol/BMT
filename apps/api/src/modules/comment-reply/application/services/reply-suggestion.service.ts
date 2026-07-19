import { Injectable, NotFoundException } from "@nestjs/common"
import { CommentInboxRepository } from "../../infrastructure/comment-inbox.repository"
import { ReplyHistory } from "../../domain/comment-inbox.model"

@Injectable()
export class ReplySuggestionService {
  constructor(private readonly commentInboxRepository: CommentInboxRepository) {}

  public async generateSuggestions(inboxId: string): Promise<string[]> {
    console.log(`[ReplySuggestionService] Invoking AI Copilot to generate suggestions for comment inbox: ${inboxId}...`)
    return [
      "Thanks for your feedback! We appreciate it.",
      "Hello! Please DM us to get support details.",
      "Awesome suggestion! We will check it.",
    ]
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
