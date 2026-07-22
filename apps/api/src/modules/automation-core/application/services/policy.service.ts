import { Injectable } from "@nestjs/common"
import { ProviderCapability } from "../../domain/automation-core.model"

@Injectable()
export class PolicyService {
  private capabilities: ProviderCapability[] = []

  constructor() {
    // Register default allowed capabilities
    this.capabilities.push(
      { platform: "facebook", action: "post_group", isEnabled: true },
      { platform: "facebook", action: "market_list", isEnabled: true },
      { platform: "facebook", action: "marketplace_post", isEnabled: true },
      { platform: "facebook", action: "comment_post", isEnabled: true },
      { platform: "facebook", action: "comment_reply", isEnabled: true },
      { platform: "facebook", action: "messenger_reply", isEnabled: true },
      { platform: "facebook", action: "group_messenger_post", isEnabled: true },
      { platform: "facebook", action: "friend_request", isEnabled: true },
      { platform: "facebook", action: "unfriend", isEnabled: true },
      { platform: "facebook", action: "group_discovery", isEnabled: true },
      { platform: "facebook", action: "group_autojoin", isEnabled: true }
    )
  }

  public registerCapability(capability: ProviderCapability): void {
    this.capabilities.push(capability)
  }

  public async validatePolicy(platform: string, action: string, accountHealthScore: number): Promise<{ allowed: boolean; reason?: string }> {
    // 1. Validate capability registry mapping
    const capability = this.capabilities.find(c => c.platform === platform && c.action === action)
    if (!capability || !capability.isEnabled) {
      return { allowed: false, reason: `Action capability "${action}" is not supported on platform "${platform}".` }
    }

    // 2. Validate health score policy constraints
    if (accountHealthScore < 40) {
      return { allowed: false, reason: `Account health score (${accountHealthScore}) is below verification threshold.` }
    }

    return { allowed: true }
  }

  public async evaluateRiskScore(actionFrequency: number): Promise<"Low" | "Medium" | "High"> {
    if (actionFrequency > 100) return "High"
    if (actionFrequency > 30) return "Medium"
    return "Low"
  }
}
