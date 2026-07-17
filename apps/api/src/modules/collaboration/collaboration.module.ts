import { Module } from "@nestjs/common"
import { CollaborationController } from "./presentation/collaboration.controller"
import { CommentService } from "./application/services/comment.service"
import { ReviewService } from "./application/services/review.service"
import { ApprovalService } from "./application/services/approval.service"
import { NotificationService } from "./application/services/notification.service"
import { PresenceService } from "./application/services/presence.service"

@Module({
  controllers: [CollaborationController],
  providers: [CommentService, ReviewService, ApprovalService, NotificationService, PresenceService],
  exports: [CommentService, ReviewService, ApprovalService, NotificationService, PresenceService],
})
export class CollaborationModule {}
