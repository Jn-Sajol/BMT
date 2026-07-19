import { Injectable, NotFoundException } from "@nestjs/common"
import { CommentInboxRepository } from "../../infrastructure/comment-inbox.repository"
import { CommentInbox, CommentThread } from "../../domain/comment-inbox.model"

@Injectable()
export class CommentReplyInboxService {
  constructor(private readonly commentInboxRepository: CommentInboxRepository) {}

  public async getInbox(): Promise<CommentInbox[]> {
    return this.commentInboxRepository.findAll()
  }

  public async getInboxById(id: string): Promise<CommentInbox> {
    const item = await this.commentInboxRepository.findById(id)
    if (!item) {
      throw new NotFoundException("Comment Inbox item not found.")
    }
    return item
  }

  public async loadMockInboxItem(author: string, text: string): Promise<CommentInbox> {
    const item: CommentInbox = {
      id: `inb-${Date.now()}`,
      fbPostId: `post-${Date.now()}`,
      commentId: `comm-${Date.now()}`,
      authorName: author,
      content: text,
      status: "Pending",
      createdAt: new Date(),
    }
    await this.commentInboxRepository.save(item)

    const thread: CommentThread = {
      id: `th-${Date.now()}`,
      inboxId: item.id,
      messages: [{ id: "m-1", sender: author, text, timestamp: new Date() }],
    }
    await this.commentInboxRepository.saveThread(thread)
    return item
  }

  public async getThread(inboxId: string): Promise<CommentThread> {
    const thread = await this.commentInboxRepository.findThreadByInboxId(inboxId)
    if (!thread) {
      throw new NotFoundException("Conversation thread not found.")
    }
    return thread
  }
}
