import { Injectable } from "@nestjs/common"
import { BrowserSession } from "../domain/browser-session.model"

@Injectable()
export class BrowserSessionRepository {
  private sessions: BrowserSession[] = []

  public async save(session: BrowserSession): Promise<BrowserSession> {
    const idx = this.sessions.findIndex((s) => s.id === session.id)
    if (idx >= 0) {
      this.sessions[idx] = session
    } else {
      this.sessions.push(session)
    }
    return session
  }

  public async saveAll(sessions: BrowserSession[]): Promise<BrowserSession[]> {
    for (const s of sessions) {
      await this.save(s)
    }
    return this.sessions
  }

  public async findById(id: string): Promise<BrowserSession | null> {
    return this.sessions.find((s) => s.id === id) || null
  }

  public async findAll(): Promise<BrowserSession[]> {
    return this.sessions
  }
}
