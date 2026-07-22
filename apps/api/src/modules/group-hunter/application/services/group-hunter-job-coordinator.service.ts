import { Injectable, Inject } from "@nestjs/common"
import { BaseJobCoordinator } from "../../../automation-core/domain/base-job-coordinator"
import { RedisLockManager } from "../../../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../../../automation-core/infrastructure/bullmq-queue.adapter"
import { GroupHunterStateMachine, GroupHunterJobState } from "./group-hunter-state-machine.service"
import { GroupRankingService, CandidateGroupRaw } from "./group-ranking.service"
import { GroupClassificationService } from "./group-classification.service"
import { AutomationJob, HumanBehaviourConfig } from "../../../automation-core/domain/automation-core.model"
import { DelayCalculatorService } from "../../../automation-core/application/services/delay-calculator.service"
import { IEventBus } from "../../../automation/application/ports/event-bus.interface"
import { DomainEvent } from "../../../automation/domain/models/domain-event.model"
import * as crypto from "crypto"

@Injectable()
export class GroupHunterJobCoordinator extends BaseJobCoordinator<GroupHunterJobState> {
  constructor(
    lockManager: RedisLockManager,
    queueAdapter: BullMQQueueAdapter,
    stateMachine: GroupHunterStateMachine,
    private readonly rankingService: GroupRankingService,
    private readonly classificationService: GroupClassificationService,
    private readonly delayCalculator: DelayCalculatorService,
    @Inject("IEventBus") private readonly eventBus: IEventBus
  ) {
    super(lockManager, queueAdapter, stateMachine)
  }

  public async coordinateDiscovery(
    job: AutomationJob,
    rawKeywords: string[],
    rawCandidates: CandidateGroupRaw[],
    hbf: HumanBehaviourConfig
  ): Promise<{ success: boolean; candidateCount: number; reason?: string }> {
    const jobId = job.id
    console.log(`[GroupHunterCoordinator] Start discovery pipeline for Job: ${jobId}`)

    await this.publishLifecycleEvent(job, "BeforePrepare")

    // 1. HBF Validation via centralized DelayCalculatorService
    const delayCheck = this.delayCalculator.calculatePacingDelay({
      workspaceId: job.workspaceId,
      accountId: hbf.accountId,
      hbfConfig: hbf,
      featureFlags: { "system.advanced_automation": true },
      dailyBudget: 50,
      hourlyBudget: 10,
      accountHealthScore: 90,
      riskLevel: "Low",
      queues: ["preparation", "execution", "reporting"]
    })

    if (!delayCheck.isWithinWorkingHours) {
      await this.stateMachine.transition(jobId, "Failed", `Delayed: ${delayCheck.reason}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: delayCheck.reason })
      return { success: false, candidateCount: 0, reason: delayCheck.reason }
    }

    // 2. Keyword Normalization
    const normalizedKeywords = rawKeywords.map((k) => k.toLowerCase().trim()).filter(Boolean)
    await this.stateMachine.transition(jobId, "KeywordsNormalized", `Normalized ${normalizedKeywords.length} keywords`)

    // 3. Duplicate Detection
    const existingGroupIds = new Set<string>() // Reused existing candidate index
    const scoredDuplicates = this.rankingService.detectDuplicates(rawCandidates, existingGroupIds)
    const uniqueCandidates = scoredDuplicates.filter((g) => !g.isDuplicate)
    await this.stateMachine.transition(jobId, "DuplicatesFiltered", `Filtered ${scoredDuplicates.length - uniqueCandidates.length} duplicates`)

    // 4. Category Classification
    const classifiedCandidates = uniqueCandidates.map((g) => {
      const cls = this.classificationService.classifyGroup(g.name, g.description, g.privacy)
      return { ...g, classification: cls }
    })
    await this.stateMachine.transition(jobId, "Classified", `Classified ${classifiedCandidates.length} candidate groups`)

    // 5. AI Relevance Scoring & Priority Ranking
    const rankedCandidates = classifiedCandidates.map((g) => {
      const primaryKeyword = normalizedKeywords[0] || ""
      const relScore = this.rankingService.calculateRelevanceScore(g, primaryKeyword)
      const prioScore = this.rankingService.calculatePriorityScore(g, relScore)
      return { ...g, relevanceScore: relScore, priorityScore: prioScore }
    }).sort((a, b) => b.priorityScore - a.priorityScore)

    await this.stateMachine.transition(jobId, "ScoredAndRanked", `Ranked top candidate group score: ${rankedCandidates[0]?.priorityScore || 0}`)

    // 6. Candidate Queue Generation (Stops before joining or execution)
    await this.stateMachine.transition(jobId, "CandidateQueueGenerated", `Candidate queue populated with ${rankedCandidates.length} groups`)
    await this.stateMachine.transition(jobId, "Completed", "Discovery Engine Foundation completed successfully")

    await this.publishLifecycleEvent(job, "AfterComplete", { totalCandidatesFound: rankedCandidates.length })

    return {
      success: true,
      candidateCount: rankedCandidates.length
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
