import { Injectable } from "@nestjs/common"
import { AutomationJob } from "../domain/automation-core.model"

@Injectable()
export class BullMQQueueAdapter {
  private queues = new Map<string, AutomationJob[]>()

  constructor() {
    // Register pipeline queues
    this.queues.set("preparation", [])
    this.queues.set("scheduler", [])
    this.queues.set("execution", [])
    this.queues.set("verification", [])
    this.queues.set("reporting", [])
    this.queues.set("retry", [])
    this.queues.set("dlq", [])
  }

  public async enqueue(queueName: string, job: AutomationJob): Promise<void> {
    const list = this.queues.get(queueName)
    if (!list) {
      throw new Error(`Queue pipeline "${queueName}" does not exist.`)
    }
    list.push(job)
    job.status = "Queued"
    console.log(`[BullMQQueueAdapter] Job enqueued to "${queueName}" queue pipeline: ID ${job.id}`)
  }

  public async getQueueSize(queueName: string): Promise<number> {
    return this.queues.get(queueName)?.length || 0
  }

  public async getJobs(queueName: string): Promise<AutomationJob[]> {
    return this.queues.get(queueName) || []
  }
}
