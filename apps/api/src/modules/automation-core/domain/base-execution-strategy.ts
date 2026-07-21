import { IExecutionStrategy } from "./automation-strategy.interface"
import { AutomationJob } from "./automation-core.model"
import { BullMQQueueAdapter } from "../infrastructure/bullmq-queue.adapter"

export abstract class BaseExecutionStrategy implements IExecutionStrategy {
  constructor(protected readonly queueAdapter: BullMQQueueAdapter) {}

  public async execute(job: AutomationJob): Promise<{ success: boolean; result?: any }> {
    console.log(`[BaseExecutionStrategy] Enqueuing Job ${job.id} to preparation queue...`)
    await this.queueAdapter.enqueue("preparation", job)
    return { success: true, result: { jobId: job.id, status: "Queued" } }
  }
}
