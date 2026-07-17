import { Module } from "@nestjs/common"
import { NotificationController } from "./presentation/notification.controller"
import { NotificationDispatcher } from "./application/services/notification-dispatcher"
import { PreferenceService } from "./application/services/preference.service"
import { TemplateEngine } from "./application/services/template-engine"

@Module({
  controllers: [NotificationController],
  providers: [NotificationDispatcher, PreferenceService, TemplateEngine],
  exports: [NotificationDispatcher, PreferenceService, TemplateEngine],
})
export class NotificationsModule {}
