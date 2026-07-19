import { Module } from "@nestjs/common"
import { FriendManagementController } from "./presentation/friend-management.controller"
import { FriendListService } from "./application/services/friend-list.service"
import { FriendRequestService } from "./application/services/friend-request.service"
import { FriendUnfriendService } from "./application/services/friend-unfriend.service"
import { FriendProfileRepository } from "./infrastructure/friend-profile.repository"
import { FriendRequestRepository } from "./infrastructure/friend-request.repository"
import { FriendActivityRepository } from "./infrastructure/friend-activity.repository"

@Module({
  controllers: [FriendManagementController],
  providers: [
    FriendListService,
    FriendRequestService,
    FriendUnfriendService,
    FriendProfileRepository,
    FriendRequestRepository,
    FriendActivityRepository,
  ],
  exports: [
    FriendListService,
    FriendRequestService,
    FriendUnfriendService,
    FriendProfileRepository,
    FriendRequestRepository,
    FriendActivityRepository,
  ],
})
export class FriendManagementModule {}
