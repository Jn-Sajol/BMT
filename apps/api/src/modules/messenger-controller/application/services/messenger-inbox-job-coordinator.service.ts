import { Injectable, Inject } from "@nestjs/common"
import { BaseJobCoordinator } from "../../../automation-core/domain/base-job-coordinator"
import { RedisLockManager } from "../../../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../../../automation-core/infrastructure/bullmq-queue.adapter"
import { MessengerInboxStateMachine, MessengerInboxJobState } from "./messenger-inbox-state-machine.service"
import { MessengerInboxService } from "./messenger-inbox.service"
import { ConversationClassificationService, ClassificationResult } from "./conversation-classification.service"
import { AutomationJob, HumanBehaviourConfig } from "../../../automation-core/domain/automation-core.model"
import { DelayCalculatorService } from "../../../automation-core/application/services/delay-calculator.service"
import { PayloadValidatorService } from "../../../automation-core/application/services/payload-validator.service"
import { PolicyService } from "../../../automation-core/application/services/policy.service"
import { AutomationRegistryService } from "../../../automation-core/application/services/automation-registry.service"
import { AutomationCapability } from "../../../automation-core/domain/automation-plugin.model"
import { IEventBus } from "../../../automation/application/ports/event-bus.interface"
import { DomainEvent } from "../../../automation/domain/models/domain-event.model"
import * as crypto from "crypto"

export interface MessengerConversationTask {
  conversationId: string
  pageId: string
  senderId: string
  senderName?: string
  messageId?: string
  messageText: string
  timestamp?: Date
  metadata?: Record<string, any>
}

@Injectable()
export class MessengerInboxJobCoordinator extends BaseJobCoordinator<MessengerInboxJobState> {
  constructor(
    lockManager: RedisLockManager,
    queueAdapter: BullMQQueueAdapter,
    stateMachine: MessengerInboxStateMachine,
    private readonly inboxService: MessengerInboxService,
    private readonly classificationService: ConversationClassificationService,
    private readonly delayCalculator: DelayCalculatorService,
    private readonly payloadValidator: PayloadValidatorService,
    private readonly policyService: PolicyService,
    private readonly registryService: AutomationRegistryService,
    @Inject("IEventBus") private readonly eventBus: IEventBus
  ) {
    super(lockManager, queueAdapter, stateMachine)
  }

  public async coordinateInbox(
    job: AutomationJob,
    accountId: string,
    task: MessengerConversationTask,
    hbf: HumanBehaviourConfig
  ): Promise<{ success: boolean; classification?: ClassificationResult; isDuplicate?: boolean; reason?: string }> {
    const jobId = job.id
    console.log(`[MessengerInboxJobCoordinator] Coordinating Messenger conversation ${task.conversationId} (Job ${jobId})`)

    await this.publishLifecycleEvent(job, "BeforePrepare", task)
    await this.stateMachine.transition(jobId, "IncomingConversationReceived", `Received conversation ${task.conversationId}`)

    // 1. Validation & Pacing Context
    const context = {
      workspaceId: job.workspaceId,
      accountId,
      hbfConfig: hbf,
      featureFlags: { "system.advanced_automation": true },
      dailyBudget: hbf.dailyLimits?.messenger_inbox || 500,
      hourlyBudget: 50,
      accountHealthScore: 90,
      riskLevel: "Low" as const,
      queues: ["preparation", "scheduler", "execution", "verification", "reporting"]
    }

    const valRes = await this.payloadValidator.validateJobPayload(
      job,
      context,
      "facebook",
      AutomationCapability.MESSENGER_INBOX
    )
    if (!valRes.valid) {
      await this.stateMachine.transition(jobId, "Failed", `Payload validation failed: ${valRes.reason}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: valRes.reason })
      return { success: false, reason: valRes.reason }
    }

    // 2. Normalization & Deduplication
    const { conversation, isDuplicate } = this.inboxService.processIncomingConversation({
      ...task,
      accountId
    })
    await this.stateMachine.transition(jobId, "Normalized", "Normalized incoming conversation payload")

    if (isDuplicate) {
      await this.stateMachine.transition(jobId, "Deduplicated", `Duplicate messageId ${task.messageId} detected and filtered`)
      await this.stateMachine.transition(jobId, "Completed", "Duplicate conversation message ignored")
      return { success: true, isDuplicate: true, reason: "Duplicate message" }
    }

    await this.stateMachine.transition(jobId, "Deduplicated", "Verified unique conversation event")

    // 3. Rule-Based Classification (Category, Language, Priority, Unread Status)
    const classification = this.classificationService.classifyConversation(
      conversation.lastMessageText,
      !conversation.isRead
    )
    await this.stateMachine.transition(jobId, "Classified", `Category: ${classification.category}, Lang: ${classification.language}, Priority: ${classification.priority}`)

    // 4. Distributed Lock format: lock:${workspaceId}:${accountId}:messenger_inbox:${conversationId}
    const lockKey = `lock:${job.workspaceId}:${accountId}:messenger_inbox:${task.conversationId}`
    const lockAcquired = await this.lockManager.acquireLock(lockKey, `worker-${jobId}`, 15000)

    if (!lockAcquired) {
      await this.stateMachine.transition(jobId, "Failed", `Distributed lock conflict for ${lockKey}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: "Lock Conflict" })
      await this.queueAdapter.enqueue("dlq", job)
      return { success: false, reason: "Lock Conflict" }
    }

    try {
      await this.publishLifecycleEvent(job, "BeforeExecute", { task, classification })

      // 5. Inbox Queue Generation & Routing
      const queueItem = this.inboxService.generateInboxQueueItem(task.conversationId)
      await this.stateMachine.transition(jobId, "InboxQueueEnqueued", `Enqueued conversation into Inbox Queue: ${queueItem?.id}`)
      await this.queueAdapter.enqueue("execution", job)

      await this.publishLifecycleEvent(job, "AfterExecute", { conversationId: task.conversationId })

      // 6. Verification & Reporting Queues
      await this.stateMachine.transition(jobId, "Verified", "Verified conversation inbox placement")
      await this.queueAdapter.enqueue("verification", job)

      await this.stateMachine.transition(jobId, "Reported", "Reported conversation inbox telemetry")
      await this.queueAdapter.enqueue("reporting", job)

      await this.stateMachine.transition(jobId, "Completed", "Messenger Inbox Orchestration pipeline completed successfully")
      await this.publishLifecycleEvent(job, "AfterComplete", { conversationId: task.conversationId, classification })

      return { success: true, classification, isDuplicate: false }
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
      name: `MessengerInbox_${stageName}`,
      workspaceId: job.workspaceId,
      payload: {
        entityId: job.id,
        jobId: job.id,
        status: job.status,
        ...details
      },
      triggerVersion: "1.0",
      eventVersion: "1.0", // Mandatory Event Versioning
      source: "MessengerInboxJobCoordinator",
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
