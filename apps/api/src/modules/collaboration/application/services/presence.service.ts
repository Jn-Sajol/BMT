import { Injectable } from "@nestjs/common"

export interface UserPresence {
  userId: string
  workflowId: string
  action: "EDITING" | "REVIEWING" | "IDLE"
  lastActive: number
}

@Injectable()
export class PresenceService {
  private presenceMap = new Map<string, UserPresence>()

  public setPresence(userId: string, workflowId: string, action: "EDITING" | "REVIEWING" | "IDLE"): void {
    this.presenceMap.set(userId, {
      userId,
      workflowId,
      action,
      lastActive: Date.now(),
    })
  }

  public getActivePresences(workflowId: string): UserPresence[] {
    const now = Date.now()
    const expiryMs = 60000 // presence expires after 60 seconds

    return Array.from(this.presenceMap.values()).filter(
      (p) => p.workflowId === workflowId && now - p.lastActive < expiryMs
    )
  }
}
