import { Injectable } from "@nestjs/common"
import { PolicyService } from "../../../automation-core/application/services/policy.service"
import { HumanBehaviourConfig } from "../../../automation-core/domain/automation-core.model"

export interface AutoMessengerReplyPolicyConfig {
  isEnabled: boolean
  workingHours: { startHour: number; endHour: number }
  cooldownMinutes: number
  maxRepliesPerConversation: number
  maxRepliesPerAccountDaily: number
  blockedConversationIds: string[]
}

@Injectable()
export class AutoMessengerReplyPolicyService {
  private replyHistoryMap: Map<string, { count: number; lastReplyTimestamp: Date }> = new Map()
  private dailyAccountCountMap: Map<string, number> = new Map()

  constructor(private readonly policyService: PolicyService) {}

  public async isAutoReplyAllowed(
    conversationId: string,
    accountId: string,
    hbf: HumanBehaviourConfig,
    config: AutoMessengerReplyPolicyConfig
  ): Promise<{ allowed: boolean; reason?: string }> {
    // 1. Capability check via PolicyService
    const capRes = await this.policyService.validatePolicy("facebook", "messenger_auto_reply", 90)
    if (!capRes.allowed) {
      return { allowed: false, reason: capRes.reason }
    }

    // 2. Global Enable/Disable flag
    if (!config.isEnabled) {
      return { allowed: false, reason: "Messenger Auto Reply is currently disabled" }
    }

    // 3. Blocked conversation check
    if (config.blockedConversationIds.includes(conversationId)) {
      return { allowed: false, reason: "Conversation is in blocked list" }
    }

    // 4. Working hours validation
    const currentHour = new Date().getUTCHours()
    if (currentHour < config.workingHours.startHour || currentHour >= config.workingHours.endHour) {
      return { allowed: false, reason: `Outside working hours (${config.workingHours.startHour}:00 - ${config.workingHours.endHour}:00 UTC)` }
    }

    // 5. Daily limit per account
    const dailyCount = this.dailyAccountCountMap.get(accountId) || 0
    if (dailyCount >= config.maxRepliesPerAccountDaily) {
      return { allowed: false, reason: `Daily account reply limit reached (${config.maxRepliesPerAccountDaily})` }
    }

    // 6. Cooldown & Max replies per conversation
    const convHistory = this.replyHistoryMap.get(conversationId)
    if (convHistory) {
      if (convHistory.count >= config.maxRepliesPerConversation) {
        return { allowed: false, reason: `Max replies limit per conversation reached (${config.maxRepliesPerConversation})` }
      }

      const elapsedMinutes = (Date.now() - convHistory.lastReplyTimestamp.getTime()) / (1000 * 60)
      if (elapsedMinutes < config.cooldownMinutes) {
        return { allowed: false, reason: `Cooldown active. Please wait ${Math.ceil(config.cooldownMinutes - elapsedMinutes)} more minute(s)` }
      }
    }

    return { allowed: true }
  }

  public recordReply(conversationId: string, accountId: string): void {
    const now = new Date()
    const convHistory = this.replyHistoryMap.get(conversationId) || { count: 0, lastReplyTimestamp: now }
    convHistory.count += 1
    convHistory.lastReplyTimestamp = now
    this.replyHistoryMap.set(conversationId, convHistory)

    const dailyCount = this.dailyAccountCountMap.get(accountId) || 0
    this.dailyAccountCountMap.set(accountId, dailyCount + 1)
  }

  public resetDailyLimits(): void {
    this.dailyAccountCountMap.clear()
  }
}
