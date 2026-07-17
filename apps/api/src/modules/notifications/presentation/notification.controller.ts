import { Controller, Get, Post, Body, Param, Query } from "@nestjs/common"
import { NotificationDispatcher } from "../application/services/notification-dispatcher"
import { PreferenceService } from "../application/services/preference.service"

@Controller("notifications")
export class NotificationController {
  constructor(
    private readonly dispatcher: NotificationDispatcher,
    private readonly preferenceService: PreferenceService
  ) {}

  @Get()
  list(@Query("userId") userId: string) {
    return this.dispatcher.listNotifications(userId)
  }

  @Post(":id/read")
  markRead(@Param("id") notificationId: string) {
    this.dispatcher.markAsRead(notificationId)
    return { success: true }
  }

  @Post("read-all")
  markAllRead(@Body("userId") userId: string) {
    this.dispatcher.markAllAsRead(userId)
    return { success: true }
  }

  @Get("preferences")
  getPreferences(
    @Query("userId") userId: string,
    @Query("workspaceId") workspaceId: string
  ) {
    return this.preferenceService.getPreferences(userId, workspaceId)
  }

  @Post("preferences")
  savePreferences(
    @Body("userId") userId: string,
    @Body("workspaceId") workspaceId: string,
    @Body("preferences") preferences: any
  ) {
    return this.preferenceService.savePreferences(userId, workspaceId, preferences)
  }
}
