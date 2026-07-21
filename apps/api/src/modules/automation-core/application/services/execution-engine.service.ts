import { Injectable, ForbiddenException } from "@nestjs/common"
import { BullMQQueueAdapter } from "../../infrastructure/bullmq-queue.adapter"
import { RedisLockManager } from "../../infrastructure/redis-lock.manager"
import { FeatureFlagService } from "./feature-flag.service"
import { PolicyService } from "./policy.service"
import { AutomationJob } from "../../domain/automation-core.model"

@Injectable()
export class ExecutionEngineService {
  constructor(
    private readonly queueAdapter: BullMQQueueAdapter,
    private readonly lockManager: RedisLockManager,
    private readonly featureFlagService: FeatureFlagService,
    private readonly policyService: PolicyService
  ) {}

  public async processJob(job: AutomationJob, platform: string, action: string, accountHealthScore: number): Promise<{ success: boolean; error?: string }> {
    console.log(`[ExecutionEngine] Resolving policy and locks validation for Job ID: ${job.id}`)

    // 1. Check feature flags
    const isAutomationEnabled = await this.featureFlagService.isEnabled("system.advanced_automation", job.workspaceId)
    if (!isAutomationEnabled) {
      throw new ForbiddenException("ADVANCED automation features are disabled under the current flags.")
    }

    // 2. Validate policy requirements
    const validation = await this.policyService.validatePolicy(platform, action, accountHealthScore)
    if (!validation.allowed) {
      console.log(`[ExecutionEngine] Job rejected by policy rules: ${validation.reason}`)
      await this.queueAdapter.enqueue("dlq", job)
      return { success: false, error: validation.reason }
    }

    // 3. Lock execution key
    const lockKey = `lock:job:${job.id}`
    const acquired = await this.lockManager.acquireLock(lockKey, "worker-1", 10000)
    if (!acquired) {
      return { success: false, error: "Task execution is locked by another running worker thread." }
    }

    // 4. Enqueue to Execution pipeline queue
    job.status = "Running"
    await this.queueAdapter.enqueue("execution", job)

    // Complete action
    job.status = "Completed"
    await this.lockManager.releaseLock(lockKey, "worker-1")

    return { success: true }
  }
}
