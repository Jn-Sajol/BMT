import { Injectable, NotFoundException } from "@nestjs/common"
import { IBrowserSessionManager } from "../../domain/browser-runtime.interface"
import { BrowserSessionRepository } from "../../infrastructure/browser-session.repository"
import { BrowserSession } from "../../domain/browser-session.model"

@Injectable()
export class BrowserSessionService implements IBrowserSessionManager {
  constructor(private readonly browserSessionRepository: BrowserSessionRepository) {}

  public async loadSession(id: string): Promise<BrowserSession | null> {
    return this.browserSessionRepository.findById(id)
  }

  public async saveSession(session: BrowserSession): Promise<BrowserSession> {
    return this.browserSessionRepository.save(session)
  }

  public async validateSession(id: string): Promise<boolean> {
    const session = await this.browserSessionRepository.findById(id)
    if (!session) return false

    const now = new Date()
    if (session.status === "Valid" && session.expiresAt > now) {
      session.lastValidatedAt = now
      await this.browserSessionRepository.save(session)
      return true
    }

    return false
  }

  public async expireSession(id: string): Promise<void> {
    const session = await this.browserSessionRepository.findById(id)
    if (!session) {
      throw new NotFoundException(`Session "${id}" not found.`)
    }
    session.status = "Expired"
    await this.browserSessionRepository.save(session)
  }

  public async loadMockSessions(): Promise<BrowserSession[]> {
    const mocks: BrowserSession[] = [
      {
        id: "sess-1",
        profileId: "prof-1",
        sessionState: "encrypted-cookie-data-string",
        expiresAt: new Date(Date.now() + 86400000), // 24 hours expiry
        lastValidatedAt: new Date(),
        status: "Valid"
      }
    ]
    return this.browserSessionRepository.saveAll(mocks)
  }
}
