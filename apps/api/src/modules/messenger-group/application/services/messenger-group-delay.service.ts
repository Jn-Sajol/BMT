import { Injectable } from "@nestjs/common"
import { DelayCalculatorService } from "../../../automation-core/application/services/delay-calculator.service"
import { AutomationContext } from "../../../automation-core/domain/automation-framework.model"

@Injectable()
export class MessengerGroupDelayService {
  constructor(private readonly delayCalculator: DelayCalculatorService) {}

  public calculateGroupDelay(context: AutomationContext): { delayMs: number; delaySeconds: number } {
    // 30 seconds to 3 minutes random delay pacing (30,000 ms - 180,000 ms)
    const minDelayMs = 30 * 1000
    const maxDelayMs = 180 * 1000
    const randomMs = Math.floor(Math.random() * (maxDelayMs - minDelayMs + 1)) + minDelayMs

    const pacingResult = this.delayCalculator.calculatePacingDelay(context)
    const finalDelayMs = Math.max(randomMs, pacingResult.delayMs)

    return {
      delayMs: finalDelayMs,
      delaySeconds: Math.round(finalDelayMs / 1000)
    }
  }
}
