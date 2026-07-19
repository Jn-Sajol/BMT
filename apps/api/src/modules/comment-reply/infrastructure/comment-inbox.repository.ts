import { Injectable } from "@nestjs/common"
import { CommentInbox, CommentThread, ReplyHistory } from "../domain/comment-inbox.model"

@Injectable()
export class CommentInboxRepository {
  private inboxItems: CommentInbox[] = []
  private threads: CommentThread[] = []
  private history: ReplyHistory[] = []

  public async save(item: CommentInbox): Promise<CommentInbox> {
    const idx = this.inboxItems.findIndex((i) => i.id === item.id)
    if (idx >= 0) {
      this.inboxItems[idx] = item
    } else {
      this.inboxItems.push(item)
    }
    return item
  }

  public async findById(id: string): Promise<CommentInbox | null> {
    return this.inboxItems.find((i) => i.id === id) || null
  }

  public async findAll(): Promise<CommentInbox[]> {
    return this.inboxItems
  }

  public async saveThread(thread: CommentThread): Promise<CommentThread> {
    const idx = this.threads.findIndex((t) => t.id === thread.id)
    if (idx >= 0) {
      this.threads[idx] = thread
    } else {
      this.threads.push(thread)
    }
    return thread
  }

  public async findThreadByInboxId(inboxId: string): Promise<CommentThread | null> {
    return this.threads.find((t) => t.inboxId === inboxId) || null
  }

  public async saveHistory(h: ReplyHistory): Promise<ReplyHistory> {
    this.history.push(h)
    return h
  }

  public async getHistory(): Promise<ReplyHistory[]> {
    return this.history
  }
}
