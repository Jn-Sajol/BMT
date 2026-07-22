import { Injectable, Inject, Optional } from "@nestjs/common"
import { BullMQQueueAdapter } from "../../infrastructure/bullmq-queue.adapter"
import { RedisLockManager } from "../../infrastructure/redis-lock.manager"
import { FeatureFlagService } from "./feature-flag.service"
import { PolicyService } from "./policy.service"
import { DelayCalculatorService } from "./delay-calculator.service"
import { AutomationMetricsService } from "./automation-metrics.service"
import { AutomationRegistryService } from "./automation-registry.service"
import { PayloadValidatorService } from "./payload-validator.service"
import { AutomationJob } from "../../domain/automation-core.model"
import { AutomationContext, ExecutionResult, VerificationResult, FrameworkEventType } from "../../domain/automation-framework.model"
import { AutomationCapability, LifecycleHookStage } from "../../domain/automation-plugin.model"
import { IEventBus } from "../../../automation/application/ports/event-bus.interface"
import { DomainEvent } from "../../../automation/domain/models/domain-event.model"
import * as crypto from "crypto"

@Injectable()
export class AutomationPipelineService {
  constructor(
    private readonly queueAdapter: BullMQQueueAdapter,
    private readonly lockManager: RedisLockManager,
    private readonly featureFlagService: FeatureFlagService,
    private readonly policyService: PolicyService,
    private readonly delayCalculator: DelayCalculatorService,
    private readonly metricsService: AutomationMetricsService,
    private readonly registryService: AutomationRegistryService,
    private readonly payloadValidator: PayloadValidatorService,
    @Optional() @Inject("IEventBus") private readonly eventBus?: IEventBus
  ) {}

  public async executePipeline(
    job: AutomationJob,
    context: AutomationContext,
    platform: string,
    action: string,
    targetId: string,
    executor: (job: AutomationJob) => Promise<ExecutionResult>,
    capability: AutomationCapability = AutomationCapability.POST
  ): Promise<ExecutionResult> {
    const startTime = Date.now()
    const logs: string[] = []
    const warnings: string[] = []

    // 1. Resolve plugin and platform driver from AutomationRegistry
    const plugin = this.registryService.getPluginByCapability(platform, capability)
    const driver = this.registryService.getDriver(platform)

    // Publish AutomationQueued Event with eventVersion 1.0
    await this.publishFrameworkEvent("AutomationQueued", job, context, { platform, action })

    // Invoke Lifecycle Hook: BeforePrepare
    await this.invokeHooks(plugin?.hooks?.BeforePrepare, job, context)

    logs.push(`[Pipeline] Step 1: Preparation for Job ${job.id}`)
    await this.queueAdapter.enqueue("preparation", job)

    // Step 2: Payload & Policy Validation via PayloadValidatorService
    logs.push(`[Pipeline] Step 2: Policy & Payload Validation`)
    const validation = await this.payloadValidator.validateJobPayload(job, context, platform, capability)
    if (!validation.valid) {
      logs.push(`[Pipeline] Validation rejected: ${validation.reason}`)
      warnings.push(validation.reason || "Validation failed")
      await this.publishFrameworkEvent("AutomationFailed", job, context, { reason: validation.reason })
      await this.invokeHooks(plugin?.hooks?.OnFailure, job, context)
      await this.queueAdapter.enqueue("dlq", job)
      return this.buildResult("Failed", false, "Skipped", logs, warnings, startTime)
    }

    // Initialize Driver if present
    if (driver) {
      await driver.initialize(context)
    }

    // Step 3: HBF Validation & Delay Calculation
    logs.push(`[Pipeline] Step 3: HBF Validation`)
    const pacing = this.delayCalculator.calculatePacingDelay(context)
    if (!pacing.isWithinWorkingHours) {
      logs.push(`[Pipeline] Step 4: Scheduler Delay (${pacing.reason})`)
      await this.publishFrameworkEvent("AutomationDelayed", job, context, { delayMs: pacing.delayMs, reason: pacing.reason })
      await this.queueAdapter.enqueue("scheduler", job)
      return this.buildResult("Waiting", true, "Skipped", logs, warnings, startTime, pacing.delayMs)
    }

    // Step 5: Distributed Lock
    logs.push(`[Pipeline] Step 5: Distributed Lock`)
    const lockKey = `lock:${job.workspaceId}:${context.accountId}:${action}:${targetId}`
    const lockAcquired = await this.lockManager.acquireLock(lockKey, `worker-${job.id}`, 15000)
    if (!lockAcquired) {
      logs.push(`[Pipeline] Distributed lock conflict for key: ${lockKey}`)
      await this.publishFrameworkEvent("AutomationFailed", job, context, { reason: "Lock Conflict" })
      await this.invokeHooks(plugin?.hooks?.OnFailure, job, context)
      await this.queueAdapter.enqueue("dlq", job)
      return this.buildResult("Failed", false, "Failed", logs, warnings, startTime)
    }

    try {
      // Invoke Lifecycle Hook: BeforeExecute
      await this.invokeHooks(plugin?.hooks?.BeforeExecute, job, context)

      // Step 6: Execution
      logs.push(`[Pipeline] Step 6: Execution worker dispatch`)
      await this.publishFrameworkEvent("AutomationStarted", job, context)
      await this.queueAdapter.enqueue("execution", job)

      const execResult = await executor(job)

      // Invoke Lifecycle Hook: AfterExecute
      await this.invokeHooks(plugin?.hooks?.AfterExecute, job, context)

      // Invoke Lifecycle Hook: BeforeVerify
      await this.invokeHooks(plugin?.hooks?.BeforeVerify, job, context)

      // Step 7: Verification
      logs.push(`[Pipeline] Step 7: Verification (${execResult.verificationResult.status})`)
      await this.queueAdapter.enqueue("verification", job)

      // Invoke Lifecycle Hook: AfterVerify
      await this.invokeHooks(plugin?.hooks?.AfterVerify, job, context)
      await this.publishFrameworkEvent("AutomationVerified", job, context, { status: execResult.verificationResult.status })

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

      // Invoke Lifecycle Hook: AfterComplete
      await this.invokeHooks(plugin?.hooks?.AfterComplete, job, context)
      await this.publishFrameworkEvent("AutomationCompleted", job, context)

      return execResult
    } catch (err: any) {
      logs.push(`[Pipeline] Execution exception: ${err.message}`)
      await this.invokeHooks(plugin?.hooks?.OnFailure, job, context)

      if (job.retryCount < job.maxRetries) {
        logs.push(`[Pipeline] Step 9: Retry Queue Submission`)
        await this.publishFrameworkEvent("AutomationRetried", job, context, { retryCount: job.retryCount + 1 })
        await this.queueAdapter.enqueue("retry", job)
        return this.buildResult("Retry", true, "Failed", logs, warnings, startTime)
      } else {
        logs.push(`[Pipeline] Step 10: Dead Letter Queue (DLQ)`)
        await this.publishFrameworkEvent("AutomationFailed", job, context, { reason: err.message })
        await this.queueAdapter.enqueue("dlq", job)
        return this.buildResult("Failed", false, "Failed", logs, warnings, startTime)
      }
    } finally {
      await this.lockManager.releaseLock(lockKey, `worker-${job.id}`)
    }
  }

  private async invokeHooks(
    hooks: Array<(job: AutomationJob, context: AutomationContext) => Promise<void>> | undefined,
    job: AutomationJob,
    context: AutomationContext
  ): Promise<void> {
    if (!hooks || hooks.length === 0) return
    for (const hook of hooks) {
      try {
        await hook(job, context)
      } catch (err: any) {
        console.error(`[Pipeline] Lifecycle hook error: ${err.message}`)
      }
    }
  }

  private async publishFrameworkEvent(
    eventName: FrameworkEventType,
    job: AutomationJob,
    context: AutomationContext,
    details?: Record<string, any>
  ): Promise<void> {
    if (!this.eventBus) return
    const event: DomainEvent = {
      id: crypto.randomUUID(),
      name: eventName,
      workspaceId: job.workspaceId,
      payload: {
        entityId: job.id,
        jobId: job.id,
        accountId: context.accountId,
        status: job.status,
        ...details
      },
      triggerVersion: "1.0",
      eventVersion: "1.0", // Mandatory Event Versioning
      source: "AutomationPipelineService",
      correlationId: job.correlationId || job.id,
      causationId: job.id,
      occurredAt: new Date(),
      receivedAt: new Date(),
      processedAt: new Date(),
      timestamp: new Date()
    }
    try {
      await this.eventBus.publish(event)
    } catch (e: any) {
      console.warn(`[Pipeline] EventBus publish warning: ${e.message}`)
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
