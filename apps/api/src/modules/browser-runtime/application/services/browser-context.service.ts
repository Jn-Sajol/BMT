import { Injectable } from "@nestjs/common"
import { IBrowserContextManager } from "../../domain/browser-runtime.interface"
import { BrowserContextRepository } from "../../infrastructure/browser-context.repository"
import { BrowserContextConfig } from "../../domain/browser-context.model"

@Injectable()
export class BrowserContextService implements IBrowserContextManager {
  constructor(private readonly browserContextRepository: BrowserContextRepository) {}

  public async prepareContext(profileId: string): Promise<BrowserContextConfig> {
    const context: BrowserContextConfig = {
      id: `ctx-${Date.now()}`,
      profileId,
      contextState: "initial",
      locale: "en-US",
      timezone: "America/New_York",
      viewport: { width: 1280, height: 800 },
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      fingerprintVersion: "v2.1"
    }
    return this.browserContextRepository.save(context)
  }

  public async restoreContext(id: string): Promise<BrowserContextConfig> {
    const existing = await this.browserContextRepository.findById(id)
    if (!existing) {
      throw new Error(`Context "${id}" not found to restore.`)
    }
    existing.contextState = "restored"
    return this.browserContextRepository.save(existing)
  }

  public async disposeContext(id: string): Promise<void> {
    await this.browserContextRepository.remove(id)
  }
}
