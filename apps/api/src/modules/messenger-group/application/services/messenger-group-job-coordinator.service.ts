import { Injectable, Inject } from "@nestjs/common"
import { BaseJobCoordinator } from "../../../automation-core/domain/base-job-coordinator"
import { RedisLockManager } from "../../../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../../../automation-core/infrastructure/bullmq-queue.adapter"
import { MessengerGroupStateMachine, MessengerGroupJobState } from "./messenger-group-state-machine.service"
import { MessengerGroupDiscoveryService, MessengerGroupMetadata } from "./messenger-group-discovery.service"
import { MessengerGroupClassificationService, MessengerGroupClassificationResult } from "./messenger-group-classification.service"
import { MessengerGroupCampaignPreparationService, PreparedCampaignQueueItem } from "./messenger-group-campaign-preparation.service"
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

export interface MessengerGroupTask {
  groupId: string
  groupName?: string
  participantCount?: number
  lastMessage?: string
  lastActivity?: Date
  unreadCount?: number
  groupImage?: string
  metadata?: Record<string, any>
}

@Injectable()
export class MessengerGroupJobCoordinator extends BaseJobCoordinator<MessengerGroupJobState> {
  constructor(
    lockManager: RedisLockManager,
    queueAdapter: BullMQQueueAdapter,
    stateMachine: MessengerGroupStateMachine,
    private readonly discoveryService: MessengerGroupDiscoveryService,
    private readonly classificationService: MessengerGroupClassificationService,
    private readonly campaignPrepService: MessengerGroupCampaignPreparationService,
    private readonly delayCalculator: DelayCalculatorService,
    private readonly payloadValidator: PayloadValidatorService,
    private readonly policyService: PolicyService,
    private readonly registryService: AutomationRegistryService,
    @Inject("IEventBus") private readonly eventBus: IEventBus
  ) {
    super(lockManager, queueAdapter, stateMachine)
  }

  public async coordinateGroupTask(
    job: AutomationJob,
    accountId: string,
    task: MessengerGroupTask,
    hbf: HumanBehaviourConfig
  ): Promise<{
    success: boolean
    group?: MessengerGroupMetadata
    classification?: MessengerGroupClassificationResult
    campaignItem?: PreparedCampaignQueueItem
    reason?: string
  }> {
    const jobId = job.id
    console.log(`[MessengerGroupJobCoordinator] Coordinating group foundation task for group ${task.groupId} (Job ${jobId})`)

    await this.publishLifecycleEvent(job, "BeforePrepare", task)
    await this.stateMachine.transition(jobId, "IncomingGroupReceived", `Received group event for ${task.groupId}`)

    // 1. Validation Context
    const context: AutomationContext = {
      workspaceId: job.workspaceId,
      accountId,
      hbfConfig: hbf,
      featureFlags: { "system.advanced_automation": true },
      dailyBudget: hbf.dailyLimits?.messenger_group_assistant || 200,
      hourlyBudget: 20,
      accountHealthScore: 90,
      riskLevel: "Low",
      queues: ["preparation", "scheduler", "execution", "verification", "reporting"]
    }

    const valRes = await this.payloadValidator.validateJobPayload(
      job,
      context,
      "facebook",
      AutomationCapability.MESSENGER_GROUP_ASSISTANT
    )
    if (!valRes.valid) {
      await this.stateMachine.transition(jobId, "Failed", `Payload validation failed: ${valRes.reason}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: valRes.reason })
      return { success: false, reason: valRes.reason }
    }

    // 2. Normalization & Deduplication
    const { group, isDuplicate } = this.discoveryService.processIncomingGroupEvent({
      groupId: task.groupId,
      groupName: task.groupName,
      participantCount: task.participantCount,
      lastMessage: task.lastMessage,
      lastActivity: task.lastActivity,
      unreadCount: task.unreadCount,
      groupImage: task.groupImage,
      workspaceId: job.workspaceId,
      accountId,
      metadata: task.metadata
    })
    await this.stateMachine.transition(jobId, "GroupNormalized", `Group normalized: ${group.groupName}`)

    if (isDuplicate) {
      await this.stateMachine.transition(jobId, "GroupDeduplicated", "Duplicate group event deduplicated")
    }

    // 3. Classification (Rule-based)
    const classification = this.classificationService.classifyGroup(group.groupName, group.lastMessage)
    await this.stateMachine.transition(
      jobId,
      "GroupClassified",
      `Classified as ${classification.category}, Lang: ${classification.language}, Priority: ${classification.priority}`
    )

    // 4. Campaign Queue Preparation (No sending)
    const campaignItem = this.campaignPrepService.prepareCampaignQueueItem({
      groupId: group.groupId,
      workspaceId: job.workspaceId,
      accountId,
      campaignDetails: {
        category: classification.category,
        language: classification.language,
        priority: classification.priority
      }
    })
    await this.stateMachine.transition(jobId, "CampaignPreparationEnqueued", `Campaign queue item ${campaignItem.campaignId} prepared`)
    await this.queueAdapter.enqueue("preparation", job)

    // 5. Distributed Lock: lock:${workspaceId}:${accountId}:messenger_group:${groupId}
    const lockKey = `lock:${job.workspaceId}:${accountId}:messenger_group:${task.groupId}`
    const lockAcquired = await this.lockManager.acquireLock(lockKey, `worker-${jobId}`, 15000)

    if (!lockAcquired) {
      await this.stateMachine.transition(jobId, "Failed", `Distributed lock conflict for ${lockKey}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: "Lock Conflict" })
      await this.queueAdapter.enqueue("dlq", job)
      return { success: false, reason: "Lock Conflict" }
    }

    try {
      await this.publishLifecycleEvent(job, "BeforeExecute", { task, group, classification, campaignItem })

      // 6. Pipeline Routing (Verification Queue -> Reporting Queue)
      await this.stateMachine.transition(jobId, "Verified", "Group foundation metadata verified")
      await this.queueAdapter.enqueue("verification", job)

      await this.stateMachine.transition(jobId, "Reported", "Group foundation reported to framework audit log")
      await this.queueAdapter.enqueue("reporting", job)

      await this.stateMachine.transition(jobId, "Completed", "Group foundation pipeline completed successfully")
      await this.publishLifecycleEvent(job, "AfterComplete", { groupId: task.groupId, campaignId: campaignItem.campaignId })

      return {
        success: true,
        group,
        classification,
        campaignItem
      }
    } catch (err: any) {
      await this.stateMachine.transition(jobId, "Failed", `Error: ${err.message}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: err.message })
      await this.queueAdapter.enqueue("retry", job)
      return { success: false, reason: err.message }
    } finally {
      await this.lockManager.releaseLock(lockKey, `worker-${jobId}`)
    }
  }

  private async publishLifecycleEvent(job: AutomationJob, stageName: string, details?: Record<string, any>) {
    const event: DomainEvent = {
      id: crypto.randomUUID(),
      name: `MessengerGroup_${stageName}`,
      workspaceId: job.workspaceId,
      payload: {
        entityId: job.id,
        jobId: job.id,
        status: job.status,
        ...details
      },
      triggerVersion: "1.0",
      eventVersion: "1.0", // Mandatory Event Versioning
      source: "MessengerGroupJobCoordinator",
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
