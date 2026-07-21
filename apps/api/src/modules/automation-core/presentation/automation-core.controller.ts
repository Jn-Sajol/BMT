import { Controller, Get, Post, Body, Query } from "@nestjs/common"
import { BullMQQueueAdapter } from "../infrastructure/bullmq-queue.adapter"
import { FeatureFlagService } from "../application/services/feature-flag.service"

@Controller("automation-core")
export class AutomationCoreController {
  constructor(
    private readonly queueAdapter: BullMQQueueAdapter,
    private readonly featureFlagService: FeatureFlagService
  ) {}

  @Get("metrics")
  public async getMetrics() {
    return {
      preparationSize: await this.queueAdapter.getQueueSize("preparation"),
      schedulerSize: await this.queueAdapter.getQueueSize("scheduler"),
      executionSize: await this.queueAdapter.getQueueSize("execution"),
      dlqSize: await this.queueAdapter.getQueueSize("dlq"),
      uptimeSeconds: process.uptime(),
    }
  }

  @Get("queues")
  public async getQueueJobs(@Query("name") name: string) {
    return this.queueAdapter.getJobs(name || "execution")
  }

  @Post("feature-flags")
  public async updateFlag(@Body("key") key: string, @Body("value") value: boolean) {
    this.featureFlagService.setFlag(key, value)
    return { success: true }
  }
}
