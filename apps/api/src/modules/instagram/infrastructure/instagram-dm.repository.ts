import { Injectable } from "@nestjs/common"
import { InstagramDMThread } from "../domain/instagram.model"

@Injectable()
export class InstagramDMRepository {
  private threads: InstagramDMThread[] = []

  public async saveThread(thread: InstagramDMThread): Promise<InstagramDMThread> {
    const idx = this.threads.findIndex((t) => t.id === thread.id)
    if (idx >= 0) {
      this.threads[idx] = thread
    } else {
      this.threads.push(thread)
    }
    return thread
  }

  public async saveAllThreads(threads: InstagramDMThread[]): Promise<InstagramDMThread[]> {
    for (const t of threads) {
      await this.saveThread(t)
    }
    return this.threads
  }

  public async findThreadById(id: string): Promise<InstagramDMThread | null> {
    return this.threads.find((t) => t.id === id) || null
  }

  public async findAllThreads(): Promise<InstagramDMThread[]> {
    return this.threads
  }
}
