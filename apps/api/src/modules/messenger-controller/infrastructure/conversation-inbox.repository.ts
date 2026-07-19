import { Injectable } from "@nestjs/common"
import { ConversationInbox, ConversationThread, ReplyHistory } from "../domain/conversation.model"

@Injectable()
export class ConversationInboxRepository {
  private inboxItems: ConversationInbox[] = []
  private threads: ConversationThread[] = []
  private history: ReplyHistory[] = []

  public async save(item: ConversationInbox): Promise<ConversationInbox> {
    const idx = this.inboxItems.findIndex((i) => i.id === item.id)
    if (idx >= 0) {
      this.inboxItems[idx] = item
    } else {
      this.inboxItems.push(item)
    }
    return item
  }

  public async findById(id: string): Promise<ConversationInbox | null> {
    return this.inboxItems.find((i) => i.id === id) || null
  }

  public async findAll(): Promise<ConversationInbox[]> {
    return this.inboxItems
  }

  public async saveThread(thread: ConversationThread): Promise<ConversationThread> {
    const idx = this.threads.findIndex((t) => t.id === thread.id)
    if (idx >= 0) {
      this.threads[idx] = thread
    } else {
      this.threads.push(thread)
    }
    return thread
  }

  public async findThreadByInboxId(inboxId: string): Promise<ConversationThread | null> {
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
