import { Injectable } from "@nestjs/common"
import { PostPreparationWorker, SchedulerWorker, VerificationWorker, ReportingWorker } from "./workers.service"

export interface AutomationJobReport {
  id: string
  title: string
  status: "Running" | "Completed" | "Failed"
  publishedUrl?: string
  timestamp: Date
}

@Injectable()
export class MarketAutomationService {
  private activeJobs: AutomationJobReport[] = []
  private isEngineRunning = false

  constructor(
    private readonly prepWorker: PostPreparationWorker,
    private readonly schedulerWorker: SchedulerWorker,
    private readonly verificationWorker: VerificationWorker,
    private readonly reportingWorker: ReportingWorker
  ) {}

  public async getReports(): Promise<AutomationJobReport[]> {
    return this.activeJobs
  }

  public async isRunning(): Promise<boolean> {
    return this.isEngineRunning
  }

  public async startAutomation(title: string, payload: any): Promise<AutomationJobReport> {
    this.isEngineRunning = true
    const jobId = `job-market-${Date.now()}`

    const job: AutomationJobReport = {
      id: jobId,
      title,
      status: "Running",
      timestamp: new Date(),
    }
    this.activeJobs.push(job)

    // Run preparation
    const prep = await this.prepWorker.prepare(jobId, payload)
    if (prep.ready) {
      // Calculate delay
      await this.schedulerWorker.calculateDelay(jobId, 5) // 5 minutes pacing
      // Run verification
      const verify = await this.verificationWorker.verify(jobId)
      if (verify.verified) {
        job.status = "Completed"
        job.publishedUrl = verify.url
        await this.reportingWorker.logReport(jobId, "Completed", verify.url)
      } else {
        job.status = "Failed"
      }
    }

    return job
  }

  public async stopAutomation(): Promise<void> {
    this.isEngineRunning = false
    console.log(`[MarketAutomationService] Market automation engine stopped.`)
  }
}
