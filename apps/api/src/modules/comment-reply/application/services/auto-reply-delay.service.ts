import { Injectable } from "@nestjs/common"
import { DelayCalculatorService } from "../../../automation-core/application/services/delay-calculator.service"
import { HumanBehaviourConfig } from "../../../automation-core/domain/automation-core.model"
import { AutomationContext } from "../../../automation-core/domain/automation-framework.model"

@Injectable()
export class AutoReplyDelayService {
  constructor(private readonly delayCalculator: DelayCalculatorService) {}

  public getAutoReplyDelaySeconds(hbf: HumanBehaviourConfig): number {
    const context: AutomationContext = {
      workspaceId: "ws-auto-reply",
      accountId: hbf.accountId,
      hbfConfig: {
        ...hbf,
        randomDelayRange: { minSeconds: 30, maxSeconds: 180 }
      },
      featureFlags: { "system.advanced_automation": true },
      dailyBudget: hbf.dailyLimits?.comment_auto_reply || 200,
      hourlyBudget: 30,
      accountHealthScore: 90,
      riskLevel: "Low",
      queues: ["preparation", "scheduler", "execution", "verification", "reporting"]
    }

    const result = this.delayCalculator.calculatePacingDelay(context)
    const minDelayMs = 30 * 1000
    const maxDelayMs = 180 * 1000
    const delayMs = Math.min(Math.max(result.delayMs, minDelayMs), maxDelayMs)
    return Math.round(delayMs / 1000)
  }
}
