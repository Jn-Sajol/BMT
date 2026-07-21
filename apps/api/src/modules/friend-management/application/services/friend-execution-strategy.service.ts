import { Injectable } from "@nestjs/common"
import { BaseExecutionStrategy } from "../../../automation-core/domain/base-execution-strategy"
import { BullMQQueueAdapter } from "../../../automation-core/infrastructure/bullmq-queue.adapter"

@Injectable()
export class FriendExecutionStrategy extends BaseExecutionStrategy {
  constructor(queueAdapter: BullMQQueueAdapter) {
    super(queueAdapter)
  }
}
