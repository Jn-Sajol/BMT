import { Injectable, Inject } from "@nestjs/common"
import { BaseJobCoordinator } from "../../../automation-core/domain/base-job-coordinator"
import { RedisLockManager } from "../../../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../../../automation-core/infrastructure/bullmq-queue.adapter"
import { GroupHunterStateMachine, GroupHunterJobState } from "./group-hunter-state-machine.service"
import { GroupDiscoveryService, DiscoveredGroupData } from "./group-discovery.service"
import { GroupFilteringService, GroupFilterCriteria } from "./group-filtering.service"
import { GroupScoringService, GroupScoreResult } from "./group-scoring.service"
import { GroupCandidateQueueService, GroupCandidateQueueItem } from "./group-candidate-queue.service"
import { GroupExportService, ExportResult, ExportFormat } from "./group-export.service"
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

export interface GroupHunterTask {
  rawGroups: Array<{
    groupId: string
    groupName?: string
    groupUrl?: string
    memberCount?: number
    privacy?: "PUBLIC" | "PRIVATE"
    language?: string
    category?: string
    lastActivity?: Date
    description?: string
  }>
  filterCriteria?: GroupFilterCriteria
  targetKeywords?: string[]
  targetCategory?: string
  targetLanguage?: string
  exportFormat?: ExportFormat
}

@Injectable()
export class GroupHunterJobCoordinator extends BaseJobCoordinator<GroupHunterJobState> {
  constructor(
    lockManager: RedisLockManager,
    queueAdapter: BullMQQueueAdapter,
    stateMachine: GroupHunterStateMachine,
    private readonly discoveryService: GroupDiscoveryService,
    private readonly filteringService: GroupFilteringService,
    private readonly scoringService: GroupScoringService,
    private readonly candidateQueueService: GroupCandidateQueueService,
    private readonly exportService: GroupExportService,
    private readonly delayCalculator: DelayCalculatorService,
    private readonly payloadValidator: PayloadValidatorService,
    private readonly policyService: PolicyService,
    private readonly registryService: AutomationRegistryService,
    @Inject("IEventBus") private readonly eventBus: IEventBus
  ) {
    super(lockManager, queueAdapter, stateMachine)
  }

  public async coordinateGroupHunterTask(
    job: AutomationJob,
    accountId: string,
    task: GroupHunterTask,
    hbf: HumanBehaviourConfig
  ): Promise<{
    success: boolean
    discoveredCount: number
    filteredCount: number
    candidates: GroupCandidateQueueItem[]
    exportResult?: ExportResult
    reason?: string
  }> {
    const jobId = job.id
    console.log(`[GroupHunterJobCoordinator] Coordinating group hunter pipeline for workspace ${job.workspaceId} (Job ${jobId})`)

    await this.publishLifecycleEvent(job, "BeforePrepare", task)
    await this.stateMachine.transition(jobId, "DiscoveryReceived", `Received ${task.rawGroups.length} raw group items`)

    // 1. Validation Context
    const context: AutomationContext = {
      workspaceId: job.workspaceId,
      accountId,
      hbfConfig: hbf,
      featureFlags: { "system.advanced_automation": true },
      dailyBudget: hbf.dailyLimits?.group_hunter || 300,
      hourlyBudget: 30,
      accountHealthScore: 90,
      riskLevel: "Low",
      queues: ["preparation", "execution", "verification", "reporting"]
    }

    const valRes = await this.payloadValidator.validateJobPayload(
      job,
      context,
      "facebook",
      AutomationCapability.GROUP_HUNTER
    )
    if (!valRes.valid) {
      await this.stateMachine.transition(jobId, "Failed", `Payload validation failed: ${valRes.reason}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: valRes.reason })
      return { success: false, discoveredCount: 0, filteredCount: 0, candidates: [], reason: valRes.reason }
    }

    // 2. Normalization & Deduplication
    const normalizedGroups: DiscoveredGroupData[] = []
    let deduplicatedCount = 0

    for (const raw of task.rawGroups) {
      const { group, isDuplicate } = this.discoveryService.processDiscoveredGroup({
        ...raw,
        workspaceId: job.workspaceId,
        accountId
      })
      if (!isDuplicate) {
        normalizedGroups.push(group)
      } else {
        deduplicatedCount++
      }
    }

    await this.stateMachine.transition(jobId, "Normalized", `Normalized ${normalizedGroups.length} groups`)
    await this.stateMachine.transition(jobId, "Deduplicated", `Deduplicated ${deduplicatedCount} group events`)

    // 3. Filtering
    const filteredGroups = this.filteringService.filterGroups(normalizedGroups, task.filterCriteria || {})
    await this.stateMachine.transition(jobId, "Filtered", `Filtered down to ${filteredGroups.length} eligible groups`)

    // 4. Scoring
    const candidates: GroupCandidateQueueItem[] = []
    for (const group of filteredGroups) {
      const scoreResult = this.scoringService.calculateGroupScore(
        group,
        task.targetKeywords || [],
        task.targetCategory || "",
        task.targetLanguage || "English"
      )
      const candidate = this.candidateQueueService.addCandidateToQueue(group, scoreResult)
      candidates.push(candidate)
    }

    await this.stateMachine.transition(jobId, "Scored", `Scored and ranked ${candidates.length} candidate groups`)
    await this.stateMachine.transition(jobId, "CandidateQueuePrepared", `Enqueued ${candidates.length} candidates into review queue`)

    // 5. Distributed Lock: lock:${workspaceId}:${accountId}:group_hunter:${workspaceId}
    const lockKey = `lock:${job.workspaceId}:${accountId}:group_hunter:${job.workspaceId}`
    const lockAcquired = await this.lockManager.acquireLock(lockKey, `worker-${jobId}`, 15000)

    if (!lockAcquired) {
      await this.stateMachine.transition(jobId, "Failed", `Distributed lock conflict for ${lockKey}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: "Lock Conflict" })
      await this.queueAdapter.enqueue("dlq", job)
      return { success: false, discoveredCount: normalizedGroups.length, filteredCount: filteredGroups.length, candidates: [], reason: "Lock Conflict" }
    }

    try {
      await this.publishLifecycleEvent(job, "BeforeExecute", { task, candidatesCount: candidates.length })

      // 6. Exporting
      const exportFormat = task.exportFormat || "JSON"
      const exportResult = this.exportService.exportCandidates(candidates, exportFormat)
      await this.stateMachine.transition(jobId, "Exported", `Exported candidate list in ${exportFormat} format`)

      // 7. Pipeline Routing
      await this.stateMachine.transition(jobId, "Reported", "Group hunter results reported to framework audit log")
      await this.queueAdapter.enqueue("reporting", job)

      await this.stateMachine.transition(jobId, "Completed", "Group hunter pipeline completed successfully")
      await this.publishLifecycleEvent(job, "AfterComplete", { candidatesCount: candidates.length, exportFormat })

      return {
        success: true,
        discoveredCount: normalizedGroups.length,
        filteredCount: filteredGroups.length,
        candidates,
        exportResult
      }
    } catch (err: any) {
      await this.stateMachine.transition(jobId, "Failed", `Error: ${err.message}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: err.message })
      await this.queueAdapter.enqueue("retry", job)
      return { success: false, discoveredCount: normalizedGroups.length, filteredCount: filteredGroups.length, candidates: [], reason: err.message }
    } finally {
      await this.lockManager.releaseLock(lockKey, `worker-${jobId}`)
    }
  }

  private async publishLifecycleEvent(job: AutomationJob, stageName: string, details?: Record<string, any>) {
    const event: DomainEvent = {
      id: crypto.randomUUID(),
      name: `GroupHunter_${stageName}`,
      workspaceId: job.workspaceId,
      payload: {
        entityId: job.id,
        jobId: job.id,
        status: job.status,
        ...details
      },
      triggerVersion: "1.0",
      eventVersion: "1.0", // Mandatory Event Versioning
      source: "GroupHunterJobCoordinator",
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
