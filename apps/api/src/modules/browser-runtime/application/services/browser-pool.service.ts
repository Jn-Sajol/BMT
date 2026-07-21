import { Injectable, NotFoundException } from "@nestjs/common"

export interface BrowserInstance {
  id: string
  profileId: string
  status: "Idle" | "Active" | "Crashed"
  memoryUsageMb: number
  cpuPercentage: number
  startedAt: Date
}

@Injectable()
export class BrowserPoolService {
  private pool: BrowserInstance[] = []

  public async getPoolStatus(): Promise<BrowserInstance[]> {
    return this.pool
  }

  public async startBrowser(profileId: string): Promise<BrowserInstance> {
    // Reuse idle browser if available
    const idle = this.pool.find((b) => b.profileId === profileId && b.status === "Idle")
    if (idle) {
      idle.status = "Active"
      idle.startedAt = new Date()
      console.log(`[BrowserPoolService] Reused idle browser instance: ${idle.id}`)
      return idle
    }

    const instance: BrowserInstance = {
      id: `instance-${Date.now()}`,
      profileId,
      status: "Active",
      memoryUsageMb: 120, // Initial RAM footprint
      cpuPercentage: 5,
      startedAt: new Date(),
    }
    this.pool.push(instance)
    console.log(`[BrowserPoolService] Started new browser runtime instance: ${instance.id}`)
    return instance
  }

  public async stopBrowser(id: string): Promise<void> {
    const idx = this.pool.findIndex((b) => b.id === id)
    if (idx < 0) {
      throw new NotFoundException(`Browser instance "${id}" not found.`)
    }
    this.pool.splice(idx, 1)
    console.log(`[BrowserPoolService] Stopped and cleaned up browser instance: ${id}`)
  }

  public async triggerCrashRecovery(id: string): Promise<BrowserInstance> {
    const instance = this.pool.find((b) => b.id === id)
    if (!instance) {
      throw new NotFoundException(`Browser instance "${id}" not found to recover.`)
    }
    console.log(`[BrowserPoolService] Recovering crashed browser instance: ${id}`)
    instance.status = "Active"
    instance.memoryUsageMb = 120
    instance.cpuPercentage = 5
    return instance
  }
}
