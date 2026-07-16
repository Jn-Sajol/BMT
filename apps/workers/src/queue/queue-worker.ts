import { Worker } from "bullmq"
import { RedisConnectionManager } from "./connection-manager"
import { processWorkflowJob } from "./job-processor"

export class QueueWorker {
  private worker: Worker | null = null

  public start(): void {
    const connection = RedisConnectionManager.getConnection()

    this.worker = new Worker(
      "workflow-executions",
      processWorkflowJob,
      {
        connection,
        concurrency: 5,
        limiter: {
          max: 10,
          duration: 1000, // 10 executions per second limit
        },
      }
    )

    this.worker.on("completed", (job) => {
      console.log(`[Worker] Job ${job.id} completed successfully.`)
    })

    this.worker.on("failed", (job, err) => {
      console.error(`[Worker] Job ${job?.id} failed:`, err.message)
    })
  }

  public async stop(): Promise<void> {
    if (this.worker) {
      console.log("[Worker] Stopping BullMQ queue listener...")
      await this.worker.close()
      this.worker = null
    }
  }
}
