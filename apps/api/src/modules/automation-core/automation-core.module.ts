import { Module, OnModuleInit } from "@nestjs/common"
import { AutomationCoreController } from "./presentation/automation-core.controller"
import { BullMQQueueAdapter } from "./infrastructure/bullmq-queue.adapter"
import { RedisLockManager } from "./infrastructure/redis-lock.manager"
import { FeatureFlagService } from "./application/services/feature-flag.service"
import { PolicyService } from "./application/services/policy.service"
import { ExecutionEngineService } from "./application/services/execution-engine.service"
import { SchedulerService } from "./application/services/scheduler.service"
import { DelayCalculatorService } from "./application/services/delay-calculator.service"
import { AutomationMetricsService } from "./application/services/automation-metrics.service"
import { AutomationPipelineService } from "./application/services/automation-pipeline.service"
import { AutomationRegistryService } from "./application/services/automation-registry.service"
import { PayloadValidatorService } from "./application/services/payload-validator.service"
import { FacebookDriver } from "./domain/facebook-driver"

@Module({
  controllers: [AutomationCoreController],
  providers: [
    BullMQQueueAdapter,
    RedisLockManager,
    FeatureFlagService,
    PolicyService,
    ExecutionEngineService,
    SchedulerService,
    DelayCalculatorService,
    AutomationMetricsService,
    AutomationRegistryService,
    PayloadValidatorService,
    AutomationPipelineService,
    FacebookDriver,
  ],
  exports: [
    BullMQQueueAdapter,
    RedisLockManager,
    FeatureFlagService,
    PolicyService,
    ExecutionEngineService,
    SchedulerService,
    DelayCalculatorService,
    AutomationMetricsService,
    AutomationRegistryService,
    PayloadValidatorService,
    AutomationPipelineService,
    FacebookDriver,
  ],
})
export class AutomationCoreModule implements OnModuleInit {
  constructor(
    private readonly registry: AutomationRegistryService,
    private readonly facebookDriver: FacebookDriver
  ) {}

  onModuleInit() {
    this.registry.registerDriver(this.facebookDriver)
  }
}
