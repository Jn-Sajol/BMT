import { Injectable } from "@nestjs/common"
import { PolicyService } from "../../../automation-core/application/services/policy.service"
import { HumanBehaviourConfig } from "../../../automation-core/domain/automation-core.model"

export interface MessengerGroupPolicyConfig {
  isCampaignEnabled: boolean
  workingHours: { startHour: number; endHour: number }
  maxDailyMessagesPerAccount: number
  maxDailyMessagesPerGroup: number
  cooldownMinutesPerGroup: number
  blockedGroupIds: string[]
}

@Injectable()
export class MessengerGroupPolicyService {
  private groupMessageHistoryMap: Map<string, { count: number; lastSentTimestamp: Date; sentMessageHashes: Set<string> }> = new Map()
  private dailyAccountMessageCountMap: Map<string, number> = new Map()

  constructor(private readonly policyService: PolicyService) {}

  public async isMessagingAllowed(
    groupId: string,
    accountId: string,
    messageText: string,
    hbf: HumanBehaviourConfig,
    config: MessengerGroupPolicyConfig
  ): Promise<{ allowed: boolean; reason?: string }> {
    // 1. Capability check via PolicyService
    const capRes = await this.policyService.validatePolicy("facebook", "messenger_group_message_engine", 90)
    if (!capRes.allowed) {
      return { allowed: false, reason: capRes.reason }
    }

    // 2. Global Enable/Disable flag
    if (!config.isCampaignEnabled) {
      return { allowed: false, reason: "Messenger Group Campaign is currently disabled" }
    }

    // 3. Blocked group check
    if (config.blockedGroupIds.includes(groupId)) {
      return { allowed: false, reason: "Group is in blocked list" }
    }

    // 4. Working hours validation
    const currentHour = new Date().getUTCHours()
    if (currentHour < config.workingHours.startHour || currentHour >= config.workingHours.endHour) {
      return { allowed: false, reason: `Outside working hours (${config.workingHours.startHour}:00 - ${config.workingHours.endHour}:00 UTC)` }
    }

    // 5. Daily limit per account
    const accountSentCount = this.dailyAccountMessageCountMap.get(accountId) || 0
    if (accountSentCount >= config.maxDailyMessagesPerAccount) {
      return { allowed: false, reason: `Max daily messages limit per account reached (${config.maxDailyMessagesPerAccount})` }
    }

    // 6. Cooldown & Max messages per group & Duplicate message prevention
    const groupHistory = this.groupMessageHistoryMap.get(groupId)
    if (groupHistory) {
      if (groupHistory.count >= config.maxDailyMessagesPerGroup) {
        return { allowed: false, reason: `Max daily messages limit per group reached (${config.maxDailyMessagesPerGroup})` }
      }

      const elapsedMinutes = (Date.now() - groupHistory.lastSentTimestamp.getTime()) / (1000 * 60)
      if (elapsedMinutes < config.cooldownMinutesPerGroup) {
        return { allowed: false, reason: `Group cooldown active. Please wait ${Math.ceil(config.cooldownMinutesPerGroup - elapsedMinutes)} more minute(s)` }
      }

      const messageHash = this.hashMessage(messageText)
      if (groupHistory.sentMessageHashes.has(messageHash)) {
        return { allowed: false, reason: "Duplicate message detected for this group" }
      }
    }

    return { allowed: true }
  }

  public recordSentMessage(groupId: string, accountId: string, messageText: string): void {
    const now = new Date()
    const messageHash = this.hashMessage(messageText)

    const groupHistory = this.groupMessageHistoryMap.get(groupId) || {
      count: 0,
      lastSentTimestamp: now,
      sentMessageHashes: new Set<string>()
    }
    groupHistory.count += 1
    groupHistory.lastSentTimestamp = now
    groupHistory.sentMessageHashes.add(messageHash)
    this.groupMessageHistoryMap.set(groupId, groupHistory)

    const accountCount = this.dailyAccountMessageCountMap.get(accountId) || 0
    this.dailyAccountMessageCountMap.set(accountId, accountCount + 1)
  }

  public resetDailyLimits(): void {
    this.dailyAccountMessageCountMap.clear()
    for (const history of this.groupMessageHistoryMap.values()) {
      history.count = 0
    }
  }

  private hashMessage(text: string): string {
    return text.toLowerCase().replace(/\s+/g, "").trim()
  }
}
