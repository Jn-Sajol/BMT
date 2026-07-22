import { Module, OnModuleInit } from "@nestjs/common"
import { GroupHunterController } from "./presentation/group-hunter.controller"
import { GroupSearchService } from "./application/services/group-search.service"
import { GroupCollectionService } from "./application/services/group-collection.service"
import { GroupRankingService } from "./application/services/group-ranking.service"
import { GroupClassificationService } from "./application/services/group-classification.service"
import { GroupHunterExecutionStrategy } from "./application/services/group-hunter-execution-strategy.service"
import { GroupHunterStateMachine } from "./application/services/group-hunter-state-machine.service"
import { GroupHunterJobCoordinator } from "./application/services/group-hunter-job-coordinator.service"
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
    SavedGroupRepository,
    SearchHistoryRepository,
    GroupCollectionRepository,
  ],
})
export class GroupHunterModule implements OnModuleInit {
  constructor(
    private readonly registryService: AutomationRegistryService,
    private readonly facebookDriver: FacebookDriver,
    private readonly executionStrategy: GroupHunterExecutionStrategy,
    private readonly jobCoordinator: GroupHunterJobCoordinator
  ) {}

  onModuleInit() {
    const plugin: AutomationPlugin = {
      metadata: {
        id: "fb-group-hunter-plugin",
        name: "Facebook Group Hunter Discovery Engine",
        version: "1.0.0",
        description: "Discovery and intelligence engine for Facebook group candidates",
        platform: "facebook"
      },
      driver: this.facebookDriver,
      capabilities: [AutomationCapability.GROUP_DISCOVERY],
      executionStrategy: this.executionStrategy,
      jobCoordinator: this.jobCoordinator,
      isEnabled: true,
      verify: async () => ({ status: "Success", verifiedAt: new Date() }),
      report: async () => {}
    }

    this.registryService.registerPlugin(plugin)
  }
}
