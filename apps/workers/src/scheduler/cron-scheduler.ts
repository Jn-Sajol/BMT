import { Queue } from "bullmq"
import Redis from "ioredis"

export class CronScheduler {
  private queue: Queue

  constructor() {
    const host = process.env.REDIS_HOST || "localhost"
    const port = parseInt(process.env.REDIS_PORT || "6379", 10)
    const password = process.env.REDIS_PASSWORD || undefined

    const connection = new Redis({
      host,
      port,
      password,
      maxRetriesPerRequest: null,
    })

    this.queue = new Queue("workflow-executions", { connection })
  }

  public async scheduleCronTrigger(
    workflowId: string,
    triggerId: string,
    cronExpression: string,
    ianaTimezone: string,
    nodes: any[],
    edges: any[]
  ): Promise<{ delayMs: number; jobName: string }> {
    // 1. Calculate delay offset based on timezone
    const now = new Date()
    const targetFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: ianaTimezone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    })

    const formattedTargetStr = targetFormatter.format(now)
    const targetDate = new Date(formattedTargetStr)

    // Calculate delay (simulated schedule: next minute boundary offset)
    const nextMinute = new Date(targetDate)
    nextMinute.setMinutes(targetDate.getMinutes() + 1)
    nextMinute.setSeconds(0)
    nextMinute.setMilliseconds(0)

    const delayMs = Math.max(0, nextMinute.getTime() - targetDate.getTime())

    // 2. Enqueue delayed execution job into BullMQ queue
    const jobName = `cron-${workflowId}-${triggerId}`
    await this.queue.add(
      "execute-workflow",
      {
        workflowId,
        triggerId,
        nodes,
        edges,
        variables: {
          trigger: {
            payload: {
              source: "cron",
              scheduledTime: nextMinute.toISOString(),
              timezone: ianaTimezone,
            },
          },
        },
      },
      {
        delay: delayMs,
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
      }
    )

    console.log(
      `[CronScheduler] Workflow ${workflowId} scheduled for next execution in ${delayMs}ms using timezone ${ianaTimezone}`
    )

    return { delayMs, jobName }
  }
}
