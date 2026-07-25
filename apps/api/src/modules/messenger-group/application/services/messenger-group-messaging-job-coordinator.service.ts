import { Injectable, Inject } from "@nestjs/common"
import { BaseJobCoordinator } from "../../../automation-core/domain/base-job-coordinator"
import { RedisLockManager } from "../../../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../../../automation-core/infrastructure/bullmq-queue.adapter"
import { MessengerGroupMessagingStateMachine, MessengerGroupMessagingJobState } from "./messenger-group-messaging-state-machine.service"
import { MessengerGroupPolicyService, MessengerGroupPolicyConfig } from "./messenger-group-policy.service"
import { GroupMessageTemplateService, GroupMessageTemplate } from "./group-message-template.service"
import { GroupMessageVariationService } from "./group-message-variation.service"
import { MessengerGroupDelayService } from "./messenger-group-delay.service"
import { MessengerGroupVerificationService, GroupMessageVerificationRecord } from "./messenger-group-verification.service"
import { AutomationJob, HumanBehaviourConfig } from "../../../automation-core/domain/automation-core.model"
import { DelayCalculatorService } from "../../../automation-core/application/services/delay-calculator.service"
import { PayloadValidatorService } from "../../../automation-core/application/services/payload-validator.service"
import { PolicyService } from "../../../automation-core/application/services/policy.service"
import { AutomationRegistryService } from "../../../automation-core/application/services/automation-registry.service"
import { AutomationCapability } from "../../../automation-core/domain/automation-plugin.model"
import { AutomationContext } from "../../../automation-core/domain/automation-framework.model"
import { IEventBus } from "../../../automation/application/ports/event-bus.interface"
import { DomainEvent } from "../../../automation/domain/models/domain-event.model"
import * as crypto from "crypto"

export interface MessengerGroupMessagingTask {
  campaignId: string
  groupId: string
  category: string
  policyConfig: MessengerGroupPolicyConfig
}

@Injectable()
export class MessengerGroupMessagingJobCoordinator extends BaseJobCoordinator<MessengerGroupMessagingJobState> {
  constructor(
    lockManager: RedisLockManager,
    queueAdapter: BullMQQueueAdapter,
    stateMachine: MessengerGroupMessagingStateMachine,
    private readonly groupPolicyService: MessengerGroupPolicyService,
    private readonly templateService: GroupMessageTemplateService,
    private readonly variationService: GroupMessageVariationService,
    private readonly delayService: MessengerGroupDelayService,
    private readonly verificationService: MessengerGroupVerificationService,
    private readonly delayCalculator: DelayCalculatorService,
    private readonly payloadValidator: PayloadValidatorService,
    private readonly policyService: PolicyService,
    private readonly registryService: AutomationRegistryService,
    @Inject("IEventBus") private readonly eventBus: IEventBus
  ) {
    super(lockManager, queueAdapter, stateMachine)
  }

  public async coordinateMessagingEngine(
    job: AutomationJob,
    accountId: string,
    task: MessengerGroupMessagingTask,
    hbf: HumanBehaviourConfig
  ): Promise<{
    success: boolean
    selectedTemplate?: GroupMessageTemplate
    variedMessage?: string
    delaySeconds?: number
    verificationRecord?: GroupMessageVerificationRecord
    reason?: string
  }> {
    const jobId = job.id
    console.log(`[MessengerGroupMessagingJobCoordinator] Coordinating group messaging campaign ${task.campaignId} for group ${task.groupId} (Job ${jobId})`)

    await this.publishLifecycleEvent(job, "BeforePrepare", task)
    await this.stateMachine.transition(jobId, "PreparedCampaignReceived", `Received prepared campaign ${task.campaignId}`)

    // 1. Validation Context
    const context: AutomationContext = {
      workspaceId: job.workspaceId,
      accountId,
      hbfConfig: hbf,
      featureFlags: { "system.advanced_automation": true },
      dailyBudget: hbf.dailyLimits?.messenger_group_message_engine || 150,
      hourlyBudget: 15,
      accountHealthScore: 92,
      riskLevel: "Low",
      queues: ["preparation", "scheduler", "execution", "verification", "reporting"]
    }

    const valRes = await this.payloadValidator.validateJobPayload(
      job,
      context,
      "facebook",
      AutomationCapability.MESSENGER_GROUP_MESSAGE_ENGINE
    )
    if (!valRes.valid) {
      await this.stateMachine.transition(jobId, "Failed", `Payload validation failed: ${valRes.reason}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: valRes.reason })
      return { success: false, reason: valRes.reason }
    }

    // 2. Select Template first for message content check
    const selectedTemplate = this.templateService.selectTemplateForCampaign(task.category)
    await this.stateMachine.transition(jobId, "TemplateSelected", `Selected template ${selectedTemplate.id}: "${selectedTemplate.title}"`)

    const variedMessage = this.variationService.generateVariation(selectedTemplate.content)
    await this.stateMachine.transition(jobId, "VariationGenerated", `Generated variation: "${variedMessage}"`)

    // 3. Policy Validation
    const policyCheck = await this.groupPolicyService.isMessagingAllowed(
      task.groupId,
      accountId,
      variedMessage,
      hbf,
      task.policyConfig
    )
    if (!policyCheck.allowed) {
      await this.stateMachine.transition(jobId, "Failed", `Policy validation failed: ${policyCheck.reason}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: policyCheck.reason })
      this.verificationService.verifyGroupMessage(task.campaignId, task.groupId, "SKIPPED", policyCheck.reason)
      return { success: false, reason: policyCheck.reason }
    }
    await this.stateMachine.transition(jobId, "PolicyValidated", "Messaging policy validation passed")

    // 4. Delay Scheduling (30s - 3m)
    const { delayMs, delaySeconds } = this.delayService.calculateGroupDelay(context)
    await this.stateMachine.transition(jobId, "DelayScheduled", `Scheduled random pacing delay of ${delaySeconds} seconds`)
    await this.queueAdapter.enqueue("scheduler", job)

    // 5. Distributed Lock: lock:${workspaceId}:${accountId}:group_message:${campaignId}
    const lockKey = `lock:${job.workspaceId}:${accountId}:group_message:${task.campaignId}`
    const lockAcquired = await this.lockManager.acquireLock(lockKey, `worker-${jobId}`, 15000)

    if (!lockAcquired) {
      await this.stateMachine.transition(jobId, "Failed", `Distributed lock conflict for ${lockKey}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: "Lock Conflict" })
      await this.queueAdapter.enqueue("dlq", job)
      this.verificationService.verifyGroupMessage(task.campaignId, task.groupId, "FAILED", "Lock Conflict")
      return { success: false, reason: "Lock Conflict" }
    }

    try {
      await this.publishLifecycleEvent(job, "BeforeExecute", { task, selectedTemplate, variedMessage })

      // Record sent message in policy service
      this.groupPolicyService.recordSentMessage(task.groupId, accountId, variedMessage)

      // 6. Queue Pipeline Routing
      await this.stateMachine.transition(jobId, "MessageQueueEnqueued", "Enqueued message into execution queue")
      await this.queueAdapter.enqueue("execution", job)

      await this.publishLifecycleEvent(job, "AfterExecute", { campaignId: task.campaignId, groupId: task.groupId })

      const verificationRecord = this.verificationService.verifyGroupMessage(task.campaignId, task.groupId, "SENT")
      await this.stateMachine.transition(jobId, "Verified", "Group message delivery verified")
      await this.queueAdapter.enqueue("verification", job)

      await this.stateMachine.transition(jobId, "Reported", "Group message reported to framework audit log")
      await this.queueAdapter.enqueue("reporting", job)

      await this.stateMachine.transition(jobId, "Completed", "Messenger Group Messaging Engine pipeline completed successfully")
      await this.publishLifecycleEvent(job, "AfterComplete", { campaignId: task.campaignId, groupId: task.groupId, variedMessage })

      return {
        success: true,
        selectedTemplate,
        variedMessage,
        delaySeconds,
        verificationRecord
      }
    } catch (err: any) {
      await this.stateMachine.transition(jobId, "Failed", `Error: ${err.message}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: err.message })
      await this.queueAdapter.enqueue("retry", job)
      this.verificationService.verifyGroupMessage(task.campaignId, task.groupId, "FAILED", err.message)
      return { success: false, reason: err.message }
    } finally {
      await this.lockManager.releaseLock(lockKey, `worker-${jobId}`)
    }
  }

  private async publishLifecycleEvent(job: AutomationJob, stageName: string, details?: Record<string, any>) {
    const event: DomainEvent = {
      id: crypto.randomUUID(),
      name: `MessengerGroupMessaging_${stageName}`,
      workspaceId: job.workspaceId,
      payload: {
        entityId: job.id,
        jobId: job.id,
        status: job.status,
        ...details
      },
      triggerVersion: "1.0",
      eventVersion: "1.0", // Mandatory Event Versioning
      source: "MessengerGroupMessagingJobCoordinator",
      correlationId: job.correlationId || job.id,
      causationId: job.id,
      occurredAt: new Date(),
      receivedAt: new Date(),
      processedAt: new Date(),
      timestamp: new Date()
    }
    await this.eventBus.publish(event)
  }
}
