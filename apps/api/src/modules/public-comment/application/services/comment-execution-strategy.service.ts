import { Injectable } from "@nestjs/common"
import { IExecutionStrategy } from "../../../automation-core/domain/automation-strategy.interface"
import { AutomationJob } from "../../../automation-core/domain/automation-core.model"
import { BullMQQueueAdapter } from "../../../automation-core/infrastructure/bullmq-queue.adapter"

@Injectable()
export class CommentExecutionStrategy implements IExecutionStrategy {
  constructor(private readonly queueAdapter: BullMQQueueAdapter) {}

  public async execute(job: AutomationJob): Promise<{ success: boolean; result?: any }> {
    console.log(`[CommentExecutionStrategy] Enqueuing Public Comment Job ${job.id} to preparation pipeline...`)
    
    // Submit to preparation queue
    await this.queueAdapter.enqueue("preparation", job)
    
    return { success: true, result: { jobId: job.id, status: "Queued" } }
  }
}
