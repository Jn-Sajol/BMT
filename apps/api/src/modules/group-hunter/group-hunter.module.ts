import { Module, OnModuleInit } from "@nestjs/common"
import { GroupHunterController } from "./presentation/group-hunter.controller"
import { GroupSearchService } from "./application/services/group-search.service"
import { GroupCollectionService } from "./application/services/group-collection.service"
import { GroupRankingService } from "./application/services/group-ranking.service"
import { GroupClassificationService } from "./application/services/group-classification.service"
import { GroupHunterExecutionStrategy } from "./application/services/group-hunter-execution-strategy.service"
import { GroupHunterStateMachine } from "./application/services/group-hunter-state-machine.service"
import { GroupHunterJobCoordinator } from "./application/services/group-hunter-job-coordinator.service"
import { GroupAutoJoinExecutionStrategy } from "./application/services/group-autojoin-execution-strategy.service"
import { GroupAutoJoinStateMachine } from "./application/services/group-autojoin-state-machine.service"
import { GroupAutoJoinJobCoordinator } from "./application/services/group-autojoin-job-coordinator.service"
import { SavedGroupRepository } from "./infrastructure/saved-group.repository"
import { SearchHistoryRepository } from "./infrastructure/search-history.repository"
import { GroupCollectionRepository } from "./infrastructure/group-collection.repository"
import { AutomationCoreModule } from "../automation-core/automation-core.module"
import { ActionModule } from "../automation/action/action.module"
import { AutomationRegistryService } from "../automation-core/application/services/automation-registry.service"
import { FacebookDriver } from "../automation-core/domain/facebook-driver"
import { AutomationCapability, AutomationPlugin } from "../automation-core/domain/automation-plugin.model"

@Module({
  imports: [AutomationCoreModule, ActionModule],
  controllers: [GroupHunterController],
  providers: [
    GroupSearchService,
    GroupCollectionService,
    GroupRankingService,
    GroupClassificationService,
    GroupHunterExecutionStrategy,
    GroupHunterStateMachine,
    GroupHunterJobCoordinator,
    GroupAutoJoinExecutionStrategy,
    GroupAutoJoinStateMachine,
    GroupAutoJoinJobCoordinator,
    SavedGroupRepository,
    SearchHistoryRepository,
    GroupCollectionRepository,
  ],
  exports: [
    GroupSearchService,
    GroupCollectionService,
    GroupRankingService,
    GroupClassificationService,
    GroupHunterExecutionStrategy,
    GroupHunterStateMachine,
    GroupHunterJobCoordinator,
    GroupAutoJoinExecutionStrategy,
    GroupAutoJoinStateMachine,
    GroupAutoJoinJobCoordinator,
    SavedGroupRepository,
    SearchHistoryRepository,
    GroupCollectionRepository,
  ],
})
export class GroupHunterModule implements OnModuleInit {
  constructor(
    private readonly registryService: AutomationRegistryService,
    private readonly facebookDriver: FacebookDriver,
    private readonly discoveryStrategy: GroupHunterExecutionStrategy,
    private readonly discoveryCoordinator: GroupHunterJobCoordinator,
    private readonly autoJoinStrategy: GroupAutoJoinExecutionStrategy,
    private readonly autoJoinCoordinator: GroupAutoJoinJobCoordinator
  ) {}

  onModuleInit() {
    const discoveryPlugin: AutomationPlugin = {
      metadata: {
        id: "fb-group-hunter-plugin",
        name: "Facebook Group Hunter Discovery Engine",
        version: "1.0.0",
        description: "Discovery and intelligence engine for Facebook group candidates",
        platform: "facebook"
      },
      driver: this.facebookDriver,
      capabilities: [AutomationCapability.GROUP_DISCOVERY],
      executionStrategy: this.discoveryStrategy,
      jobCoordinator: this.discoveryCoordinator,
      isEnabled: true,
      verify: async () => ({ status: "Success", verifiedAt: new Date() }),
      report: async () => {}
    }

    const autoJoinPlugin: AutomationPlugin = {
      metadata: {
        id: "fb-group-autojoin-plugin",
        name: "Facebook Group Auto Join Engine",
        version: "1.0.0",
        description: "Execution foundation for Facebook group auto join pipeline",
        platform: "facebook"
      },
      driver: this.facebookDriver,
      capabilities: [AutomationCapability.GROUP_AUTO_JOIN],
      executionStrategy: this.autoJoinStrategy,
      jobCoordinator: this.autoJoinCoordinator,
      isEnabled: true,
      verify: async () => ({ status: "Success", verifiedAt: new Date() }),
      report: async () => {}
    }

    this.registryService.registerPlugin(discoveryPlugin)
    this.registryService.registerPlugin(autoJoinPlugin)
  }
}
