import { Injectable } from "@nestjs/common"

export interface MetricSnapshot {
  jobId: string
  queueWaitMs: number
  executionDurationMs: number
  verificationDurationMs: number
  pacingDelayMs: number
  retryCount: number
  status: string
  timestamp: Date
}

@Injectable()
export class AutomationMetricsService {
  private snapshots: MetricSnapshot[] = []

  public recordSnapshot(snapshot: MetricSnapshot): void {
    this.snapshots.push(snapshot)
    console.log(`[AutomationMetrics] Recorded snapshot for Job ${snapshot.jobId} (Status: ${snapshot.status}, ExecDuration: ${snapshot.executionDurationMs}ms)`)
  }

  public getSummaryMetrics(): {
    totalJobsProcessed: number
    averageQueueWaitMs: number
    averageExecutionDurationMs: number
    averageVerificationDurationMs: number
    averagePacingDelayMs: number
    failureRatePercentage: number
    retryRatePercentage: number
    workerUtilizationPercentage: number
  } {
    const total = this.snapshots.length
    if (total === 0) {
      return {
        totalJobsProcessed: 0,
        averageQueueWaitMs: 0,
        averageExecutionDurationMs: 0,
        averageVerificationDurationMs: 0,
        averagePacingDelayMs: 0,
        failureRatePercentage: 0,
        retryRatePercentage: 0,
        workerUtilizationPercentage: 0
      }
    }

    const totalWait = this.snapshots.reduce((acc, s) => acc + s.queueWaitMs, 0)
    const totalExec = this.snapshots.reduce((acc, s) => acc + s.executionDurationMs, 0)
    const totalVerif = this.snapshots.reduce((acc, s) => acc + s.verificationDurationMs, 0)
    const totalPacing = this.snapshots.reduce((acc, s) => acc + s.pacingDelayMs, 0)
    const failures = this.snapshots.filter((s) => s.status === "Failed").length
    const retries = this.snapshots.filter((s) => s.retryCount > 0).length

    return {
      totalJobsProcessed: total,
      averageQueueWaitMs: Math.round(totalWait / total),
      averageExecutionDurationMs: Math.round(totalExec / total),
      averageVerificationDurationMs: Math.round(totalVerif / total),
      averagePacingDelayMs: Math.round(totalPacing / total),
      failureRatePercentage: Number(((failures / total) * 100).toFixed(2)),
      retryRatePercentage: Number(((retries / total) * 100).toFixed(2)),
      workerUtilizationPercentage: Math.min(100, Number(((totalExec / (total * 1000 || 1)) * 100).toFixed(2)))
    }
  }
}
