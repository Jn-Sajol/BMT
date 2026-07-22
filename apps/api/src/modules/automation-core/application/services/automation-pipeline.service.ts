import { Injectable } from "@nestjs/common"
import { BullMQQueueAdapter } from "../../infrastructure/bullmq-queue.adapter"
import { RedisLockManager } from "../../infrastructure/redis-lock.manager"
import { FeatureFlagService } from "./feature-flag.service"
import { PolicyService } from "./policy.service"
import { DelayCalculatorService } from "./delay-calculator.service"
import { AutomationMetricsService } from "./automation-metrics.service"
import { AutomationJob } from "../../domain/automation-core.model"
import { AutomationContext, ExecutionResult, VerificationResult } from "../../domain/automation-framework.model"

@Injectable()
export class AutomationPipelineService {
  constructor(
    private readonly queueAdapter: BullMQQueueAdapter,
    private readonly lockManager: RedisLockManager,
    private readonly featureFlagService: FeatureFlagService,
    private readonly policyService: PolicyService,
    private readonly delayCalculator: DelayCalculatorService,
    private readonly metricsService: AutomationMetricsService
  ) {}

  public async executePipeline(
    job: AutomationJob,
    context: AutomationContext,
    platform: string,
    action: string,
    targetId: string,
    executor: (job: AutomationJob) => Promise<ExecutionResult>
  ): Promise<ExecutionResult> {
    const startTime = Date.now()
    const logs: string[] = []
    const warnings: string[] = []

    logs.push(`[Pipeline] Step 1: Preparation for Job ${job.id}`)
    await this.queueAdapter.enqueue("preparation", job)

    // Step 2: Feature Flag & Policy Validation
    logs.push(`[Pipeline] Step 2: Policy Validation`)
    const flagsAllowed = await this.featureFlagService.isEnabled("system.advanced_automation", job.workspaceId)
    if (!flagsAllowed) {
      warnings.push("Advanced automation feature flag disabled.")
    }

    const policyRes = await this.policyService.validatePolicy(platform, action, context.accountHealthScore)
    if (!policyRes.allowed) {
      logs.push(`[Pipeline] Policy rejected: ${policyRes.reason}`)
      await this.queueAdapter.enqueue("dlq", job)
      return this.buildResult("Failed", false, "Skipped", logs, warnings, startTime)
    }

    // Step 3: HBF Validation & Delay Calculation
    logs.push(`[Pipeline] Step 3: HBF Validation`)
    const pacing = this.delayCalculator.calculatePacingDelay(context)
    if (!pacing.isWithinWorkingHours) {
      logs.push(`[Pipeline] Step 4: Scheduler Delay (${pacing.reason})`)
      await this.queueAdapter.enqueue("scheduler", job)
      return this.buildResult("Waiting", true, "Skipped", logs, warnings, startTime, pacing.delayMs)
    }

    // Step 5: Distributed Lock
    logs.push(`[Pipeline] Step 5: Distributed Lock`)
    const lockKey = `lock:${job.workspaceId}:${context.accountId}:${action}:${targetId}`
    const lockAcquired = await this.lockManager.acquireLock(lockKey, `worker-${job.id}`, 15000)
    if (!lockAcquired) {
      logs.push(`[Pipeline] Distributed lock conflict for key: ${lockKey}`)
      await this.queueAdapter.enqueue("dlq", job)
      return this.buildResult("Failed", false, "Failed", logs, warnings, startTime)
    }

    try {
      // Step 6: Execution
      logs.push(`[Pipeline] Step 6: Execution worker dispatch`)
      await this.queueAdapter.enqueue("execution", job)
      const execResult = await executor(job)

      // Step 7: Verification
      logs.push(`[Pipeline] Step 7: Verification (${execResult.verificationResult.status})`)
      await this.queueAdapter.enqueue("verification", job)

      // Step 8: Reporting
      logs.push(`[Pipeline] Step 8: Reporting`)
      await this.queueAdapter.enqueue("reporting", job)

      // Metrics snapshot recording
      this.metricsService.recordSnapshot({
        jobId: job.id,
        queueWaitMs: 50,
        executionDurationMs: execResult.metrics.executionDurationMs || 100,
        verificationDurationMs: execResult.metrics.verificationDurationMs || 20,
        pacingDelayMs: pacing.delayMs,
        retryCount: job.retryCount,
        status: execResult.status,
        timestamp: new Date()
      })

      return execResult
    } catch (err: any) {
      logs.push(`[Pipeline] Execution exception: ${err.message}`)
      if (job.retryCount < job.maxRetries) {
        logs.push(`[Pipeline] Step 9: Retry Queue Submission`)
        await this.queueAdapter.enqueue("retry", job)
        return this.buildResult("Retry", true, "Failed", logs, warnings, startTime)
      } else {
        logs.push(`[Pipeline] Step 10: Dead Letter Queue (DLQ)`)
        await this.queueAdapter.enqueue("dlq", job)
        return this.buildResult("Failed", false, "Failed", logs, warnings, startTime)
      }
    } finally {
      await this.lockManager.releaseLock(lockKey, `worker-${job.id}`)
    }
  }

  private buildResult(
    status: "Success" | "Failed" | "Skipped" | "Retry" | "Waiting",
    retryable: boolean,
    verifStatus: VerificationResult["status"],
    logs: string[],
    warnings: string[],
    startTime: number,
    pacingDelayMs: number = 0
  ): ExecutionResult {
    const duration = Date.now() - startTime
    return {
      status,
      durationMs: duration,
      warnings,
      retryable,
      verificationResult: {
        status: verifStatus,
        verifiedAt: new Date()
      },
      metrics: {
        queueWaitMs: 50,
        executionDurationMs: duration,
        verificationDurationMs: 10,
        pacingDelayMs
      },
      auditRef: `audit-${Date.now()}`,
      logs
    }
  }
}
