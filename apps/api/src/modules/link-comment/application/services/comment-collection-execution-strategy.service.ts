import { Injectable } from "@nestjs/common"
import { BaseExecutionStrategy } from "../../../automation-core/domain/base-execution-strategy"
import { BullMQQueueAdapter } from "../../../automation-core/infrastructure/bullmq-queue.adapter"
import { AutomationJob } from "../../../automation-core/domain/automation-core.model"

@Injectable()
export class CommentCollectionExecutionStrategy extends BaseExecutionStrategy {
  constructor(queueAdapter: BullMQQueueAdapter) {
    super(queueAdapter)
  }

  public async execute(job: AutomationJob): Promise<{ success: boolean; result?: any; error?: string }> {
    await this.queueAdapter.enqueue("preparation", job)
    return { success: true }
  }
}
