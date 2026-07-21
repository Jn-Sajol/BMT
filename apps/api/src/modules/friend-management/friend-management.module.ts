import { Module } from "@nestjs/common"
import { FriendManagementController } from "./presentation/friend-management.controller"
import { AutomationCoreModule } from "../automation-core/automation-core.module"
import { ActionModule } from "../automation/action/action.module"
import { FriendListService } from "./application/services/friend-list.service"
import { FriendRequestService } from "./application/services/friend-request.service"
import { FriendUnfriendService } from "./application/services/friend-unfriend.service"
import { FriendExecutionStrategy } from "./application/services/friend-execution-strategy.service"
import { FriendStateMachine } from "./application/services/friend-state-machine.service"
import { FriendJobCoordinator } from "./application/services/friend-job-coordinator.service"
import { FriendUnfriendExecutionStrategy } from "./application/services/friend-unfriend-execution-strategy.service"
import { FriendUnfriendStateMachine } from "./application/services/friend-unfriend-state-machine.service"
import { FriendUnfriendJobCoordinator } from "./application/services/friend-unfriend-job-coordinator.service"
import { FriendProfileRepository } from "./infrastructure/friend-profile.repository"
import { FriendRequestRepository } from "./infrastructure/friend-request.repository"
import { FriendActivityRepository } from "./infrastructure/friend-activity.repository"

@Module({
  imports: [AutomationCoreModule, ActionModule],
  controllers: [FriendManagementController],
  providers: [
    FriendListService,
    FriendRequestService,
    FriendUnfriendService,
    FriendExecutionStrategy,
    FriendStateMachine,
    FriendJobCoordinator,
    FriendUnfriendExecutionStrategy,
    FriendUnfriendStateMachine,
    FriendUnfriendJobCoordinator,
    FriendProfileRepository,
    FriendRequestRepository,
    FriendActivityRepository,
  ],
  exports: [
    FriendListService,
    FriendRequestService,
    FriendUnfriendService,
    FriendExecutionStrategy,
    FriendStateMachine,
    FriendJobCoordinator,
    FriendUnfriendExecutionStrategy,
    FriendUnfriendStateMachine,
    FriendUnfriendJobCoordinator,
    FriendProfileRepository,
    FriendRequestRepository,
    FriendActivityRepository,
  ],
})
export class FriendManagementModule {}
