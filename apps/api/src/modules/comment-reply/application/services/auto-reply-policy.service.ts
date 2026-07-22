import { Injectable } from "@nestjs/common"
import { PolicyService } from "../../../automation-core/application/services/policy.service"
import { HumanBehaviourConfig } from "../../../automation-core/domain/automation-core.model"

export interface AutoReplyPolicyConfig {
  isEnabled: boolean
  autoMode: "Immediate" | "Scheduled" | "ApprovalRequired"
  workingHours: { startHour: number; endHour: number }
  cooldownMinutes: number
  maxRepliesPerAccountDaily: number
  maxRepliesPerPost: number
}

export interface PolicyValidationResult {
  eligible: boolean
  reason: string
}

@Injectable()
export class AutoReplyPolicyService {
  private config: AutoReplyPolicyConfig = {
    isEnabled: true,
    autoMode: "Scheduled",
    workingHours: { startHour: 0, endHour: 23 },
    cooldownMinutes: 2,
    maxRepliesPerAccountDaily: 200,
    maxRepliesPerPost: 20
  }

  private dailyReplyCounts: Map<string, { count: number; date: string }> = new Map()
  private postReplyCounts: Map<string, number> = new Map()
  private lastRepliedTime: Map<string, Date> = new Map()
  private repliedComments: Set<string> = new Set()

  constructor(private readonly policyService: PolicyService) {}

  public setPolicyConfig(config: Partial<AutoReplyPolicyConfig>): void {
    this.config = { ...this.config, ...config }
  }

  public validateEligibility(
    accountId: string,
    postId: string,
    commentId: string,
    hbf: HumanBehaviourConfig
  ): PolicyValidationResult {
    // 1. Feature enablement check via PolicyService
    if (!this.config.isEnabled) {
      return { eligible: false, reason: "Auto Reply feature is disabled by system policy" }
    }

    // 2. Duplicate comment reply prevention
    if (this.repliedComments.has(commentId)) {
      return { eligible: false, reason: `Duplicate reply attempt for comment ${commentId}` }
    }

    // 3. Working Hours check
    const currentHour = new Date().getUTCHours()
    const startHour = hbf.workingHours?.startHour ?? this.config.workingHours.startHour
    const endHour = hbf.workingHours?.endHour ?? this.config.workingHours.endHour
    if (currentHour < startHour || currentHour > endHour) {
      return { eligible: false, reason: `Current hour ${currentHour} is outside working hours (${startHour}-${endHour})` }
    }

    // 4. Cooldown validation
    const lastTime = this.lastRepliedTime.get(accountId)
    if (lastTime) {
      const elapsedMinutes = (Date.now() - lastTime.getTime()) / (1000 * 60)
      const minCooldown = hbf.minCooldownMinutes ?? this.config.cooldownMinutes
      if (elapsedMinutes < minCooldown) {
        return { eligible: false, reason: `Cooldown active. Elapsed: ${elapsedMinutes.toFixed(1)} mins, required: ${minCooldown} mins` }
      }
    }

    // 5. Account daily reply limit
    const today = new Date().toISOString().split("T")[0]
    const accountLimit = hbf.dailyLimits?.comment_auto_reply ?? this.config.maxRepliesPerAccountDaily
    const currentDaily = this.dailyReplyCounts.get(accountId)
    if (currentDaily && currentDaily.date === today && currentDaily.count >= accountLimit) {
      return { eligible: false, reason: `Daily reply limit reached for account ${accountId} (${currentDaily.count}/${accountLimit})` }
    }

    // 6. Post reply limit
    const postCount = this.postReplyCounts.get(postId) || 0
    if (postCount >= this.config.maxRepliesPerPost) {
      return { eligible: false, reason: `Max reply limit reached for post ${postId} (${postCount}/${this.config.maxRepliesPerPost})` }
    }

    return { eligible: true, reason: "Eligible for auto reply" }
  }

  public recordReplyExecution(accountId: string, postId: string, commentId: string): void {
    this.repliedComments.add(commentId)
    this.lastRepliedTime.set(accountId, new Date())

    const today = new Date().toISOString().split("T")[0]
    const currentDaily = this.dailyReplyCounts.get(accountId)
    if (!currentDaily || currentDaily.date !== today) {
      this.dailyReplyCounts.set(accountId, { count: 1, date: today })
    } else {
      currentDaily.count++
    }

    const currentPostCount = this.postReplyCounts.get(postId) || 0
    this.postReplyCounts.set(postId, currentPostCount + 1)
  }
}
