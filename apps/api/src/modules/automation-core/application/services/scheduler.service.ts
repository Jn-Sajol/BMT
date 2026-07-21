import { Injectable } from "@nestjs/common"
import { BullMQQueueAdapter } from "../../infrastructure/bullmq-queue.adapter"
import { AutomationJob, HumanBehaviourConfig } from "../../domain/automation-core.model"

@Injectable()
export class SchedulerService {
  constructor(private readonly queueAdapter: BullMQQueueAdapter) {}

  public async scheduleJob(job: AutomationJob, hbf: HumanBehaviourConfig): Promise<boolean> {
    console.log(`[SchedulerService] Evaluating scheduling for Job ID: ${job.id} under timezone "${hbf.timezone}"`)

    // 1. Timezone Working Hours check
    const localHour = new Date().getUTCHours() // Let's check UTC hour mapping
    if (localHour < hbf.workingHours.startHour || localHour > hbf.workingHours.endHour) {
      console.log(`[SchedulerService] Hour (${localHour}) is outside working limits (${hbf.workingHours.startHour}-${hbf.workingHours.endHour}). Enqueuing to delayed Scheduler queue.`)
      await this.queueAdapter.enqueue("scheduler", job)
      job.status = "Waiting"
      return false
    }

    // 2. Cooldown delay
    console.log(`[SchedulerService] Enqueuing to Preparation queue for immediate execution preparation...`)
    await this.queueAdapter.enqueue("preparation", job)
    return true
  }
}
