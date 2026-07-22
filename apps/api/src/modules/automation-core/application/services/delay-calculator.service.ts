import { Injectable } from "@nestjs/common"
import { HumanBehaviourConfig } from "../../domain/automation-core.model"
import { AutomationContext } from "../../domain/automation-framework.model"

@Injectable()
export class DelayCalculatorService {
  public calculatePacingDelay(context: AutomationContext, currentExecutionsToday: number = 0): { delayMs: number; isWithinWorkingHours: boolean; reason?: string } {
    const { hbfConfig, riskLevel, accountHealthScore, dailyBudget } = context
    const now = new Date()
    const currentHour = now.getUTCHours() // Timezone aware check or config offset

    // 1. Working Hours Check
    const isWithinHours = currentHour >= hbfConfig.workingHours.startHour && currentHour <= hbfConfig.workingHours.endHour
    if (!isWithinHours) {
      // Calculate delay until next working hours window
      let hoursUntilStart = hbfConfig.workingHours.startHour - currentHour
      if (hoursUntilStart <= 0) {
        hoursUntilStart += 24
      }
      return {
        delayMs: hoursUntilStart * 3600 * 1000,
        isWithinWorkingHours: false,
        reason: `Current hour (${currentHour} UTC) outside working hours window (${hbfConfig.workingHours.startHour}-${hbfConfig.workingHours.endHour}).`
      }
    }

    // 2. Budget / Fatigue check
    if (currentExecutionsToday >= dailyBudget) {
      return {
        delayMs: 24 * 3600 * 1000,
        isWithinWorkingHours: true,
        reason: `Daily execution budget (${dailyBudget}) reached.`
      }
    }

    // 3. Risk Profile & Account Health Multiplier
    let riskMultiplier = 1.0
    if (riskLevel === "High") riskMultiplier = 2.0
    else if (riskLevel === "Medium") riskMultiplier = 1.5

    let healthMultiplier = 1.0
    if (accountHealthScore < 50) healthMultiplier = 2.5
    else if (accountHealthScore < 80) healthMultiplier = 1.4

    // 4. Randomized Pacing Window Calculation
    const { minSeconds, maxSeconds } = hbfConfig.randomDelayRange
    const randomPacingSec = Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds
    const totalPacingMs = Math.round(randomPacingSec * 1000 * riskMultiplier * healthMultiplier)

    return {
      delayMs: totalPacingMs,
      isWithinWorkingHours: true
    }
  }
}
