import { Module, OnModuleInit } from "@nestjs/common"
import { AutomationCoreModule } from "../automation-core/automation-core.module"
import { MessengerGroupDiscoveryService } from "./application/services/messenger-group-discovery.service"
import { MessengerGroupClassificationService } from "./application/services/messenger-group-classification.service"
import { MessengerGroupCampaignPreparationService } from "./application/services/messenger-group-campaign-preparation.service"
import { MessengerGroupExecutionStrategy } from "./application/services/messenger-group-execution-strategy.service"
import { MessengerGroupStateMachine } from "./application/services/messenger-group-state-machine.service"
import { MessengerGroupJobCoordinator } from "./application/services/messenger-group-job-coordinator.service"
import { AutomationRegistryService } from "../automation-core/application/services/automation-registry.service"
import { FacebookDriver } from "../automation-core/domain/facebook-driver"
import { AutomationCapability, AutomationPlugin } from "../automation-core/domain/automation-plugin.model"

@Module({
  imports: [AutomationCoreModule],
  providers: [
    MessengerGroupDiscoveryService,
    MessengerGroupClassificationService,
    MessengerGroupCampaignPreparationService,
    MessengerGroupExecutionStrategy,
    MessengerGroupStateMachine,
    MessengerGroupJobCoordinator,
  ],
  exports: [
    MessengerGroupDiscoveryService,
    MessengerGroupClassificationService,
    MessengerGroupCampaignPreparationService,
    MessengerGroupExecutionStrategy,
    MessengerGroupStateMachine,
    MessengerGroupJobCoordinator,
  ],
})
export class MessengerGroupModule implements OnModuleInit {
  constructor(
    private readonly registryService: AutomationRegistryService,
    private readonly facebookDriver: FacebookDriver,
    private readonly executionStrategy: MessengerGroupExecutionStrategy,
    private readonly jobCoordinator: MessengerGroupJobCoordinator
  ) {}

  onModuleInit() {
    const plugin: AutomationPlugin = {
      metadata: {
        id: "fb-messenger-group-plugin",
        name: "Facebook Messenger Group Assistant Foundation",
        version: "1.0.0",
        description: "Client Requirement #13: Messenger Group Assistant Foundation",
        platform: "facebook"
      },
      driver: this.facebookDriver,
      capabilities: [AutomationCapability.MESSENGER_GROUP_ASSISTANT],
      executionStrategy: this.executionStrategy,
      jobCoordinator: this.jobCoordinator,
      isEnabled: true,
      verify: async () => ({ status: "Success", verifiedAt: new Date() }),
      report: async () => {}
    }

    this.registryService.registerPlugin(plugin)
  }
}
