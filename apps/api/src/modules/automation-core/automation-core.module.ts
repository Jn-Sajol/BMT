import { Module } from "@nestjs/common"
import { AutomationCoreController } from "./presentation/automation-core.controller"
import { BullMQQueueAdapter } from "./infrastructure/bullmq-queue.adapter"
import { RedisLockManager } from "./infrastructure/redis-lock.manager"
import { FeatureFlagService } from "./application/services/feature-flag.service"
import { PolicyService } from "./application/services/policy.service"
import { ExecutionEngineService } from "./application/services/execution-engine.service"
import { SchedulerService } from "./application/services/scheduler.service"

@Module({
  controllers: [AutomationCoreController],
  providers: [
    BullMQQueueAdapter,
    RedisLockManager,
    FeatureFlagService,
    PolicyService,
    ExecutionEngineService,
    SchedulerService,
  ],
  exports: [
    BullMQQueueAdapter,
    RedisLockManager,
    FeatureFlagService,
    PolicyService,
    ExecutionEngineService,
    SchedulerService,
  ],
})
export class AutomationCoreModule {}
