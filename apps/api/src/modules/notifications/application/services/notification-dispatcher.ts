import { Injectable, OnModuleInit } from "@nestjs/common"
import { Queue } from "bullmq"
import Redis from "ioredis"
import { PreferenceService } from "./preference.service"
import { TemplateEngine } from "./template-engine"
import { ChannelRegistry, InAppChannel, EmailChannel, SlackChannel, WebhookChannel } from "notifications-engine"

@Injectable()
export class NotificationDispatcher implements OnModuleInit {
  private queue: Queue
  private notifications: any[] = []

  constructor(
    private readonly preferenceService: PreferenceService,
    private readonly templateEngine: TemplateEngine
  ) {
    const host = process.env.REDIS_HOST || "localhost"
    const port = parseInt(process.env.REDIS_PORT || "6379", 10)
    const password = process.env.REDIS_PASSWORD || undefined

    const connection = new Redis({
      host,
      port,
      password,
      maxRetriesPerRequest: null,
    })

    this.queue = new Queue("notification-delivery", { connection })
  }

  onModuleInit() {
    // Register channels dynamically on module startup
    ChannelRegistry.register("in-app", new InAppChannel())
    ChannelRegistry.register("email", new EmailChannel())
    ChannelRegistry.register("slack", new SlackChannel())
    ChannelRegistry.register("webhook", new WebhookChannel())
  }

  public async dispatchEvent(
    userId: string,
    workspaceId: string,
    eventKey: "workflowFailed" | "workflowApproved" | "mention" | "aiSuggestion" | "reviewRequest",
    templateKey: string,
    variables: Record<string, string>
  ): Promise<void> {
    // 1. Verify User Preferences before dispatching
    const prefs = this.preferenceService.getPreferences(userId, workspaceId)
    if (!prefs.events[eventKey]) {
      console.log(`[NotificationDispatcher] Notification event ${eventKey} disabled for user ${userId}`)
      return
    }

    const content = this.templateEngine.compile(templateKey, variables)
    const channelsToDeliver: ("in-app" | "email" | "slack" | "webhook")[] = []

    if (prefs.channels.inApp) channelsToDeliver.push("in-app")
    if (prefs.channels.email) channelsToDeliver.push("email")
    if (prefs.channels.slack) channelsToDeliver.push("slack")
    if (prefs.channels.webhook) channelsToDeliver.push("webhook")

    for (const channel of channelsToDeliver) {
      const id = `notif-${Date.now()}-${channel}`
      const payload = {
        id,
        userId,
        workspaceId,
        title: `BMT Workspace Notification: ${eventKey}`,
        content,
        channel,
        status: "pending",
        retryCount: 0,
      }

      this.notifications.push({ ...payload, isRead: false, createdAt: new Date().toISOString() })

      // 2. Queue-based asynchronous delivery enqueuing into BullMQ
      await this.queue.add("send-notification", payload, {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
      })
    }
  }

  public listNotifications(userId: string): any[] {
    return this.notifications.filter((n) => n.userId === userId)
  }

  public markAsRead(notificationId: string): void {
    const item = this.notifications.find((n) => n.id === notificationId)
    if (item) {
      item.isRead = true
      item.readAt = new Date().toISOString()
    }
  }

  public markAllAsRead(userId: string): void {
    this.notifications.forEach((n) => {
      if (n.userId === userId && !n.isRead) {
        n.isRead = true
        n.readAt = new Date().toISOString()
      }
    })
  }
}
