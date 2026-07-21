import { Injectable } from "@nestjs/common"
import { BrowserContextConfig } from "../domain/browser-context.model"

@Injectable()
export class BrowserContextRepository {
  private contexts: BrowserContextConfig[] = []

  public async save(context: BrowserContextConfig): Promise<BrowserContextConfig> {
    const idx = this.contexts.findIndex((c) => c.id === context.id)
    if (idx >= 0) {
      this.contexts[idx] = context
    } else {
      this.contexts.push(context)
    }
    return context
  }

  public async findById(id: string): Promise<BrowserContextConfig | null> {
    return this.contexts.find((c) => c.id === id) || null
  }

  public async remove(id: string): Promise<void> {
    this.contexts = this.contexts.filter((c) => c.id !== id)
  }
}
