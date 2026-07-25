import { Module, OnModuleInit } from "@nestjs/common"
import { AutomationCoreModule } from "../automation-core/automation-core.module"
import { MessengerGroupDiscoveryService } from "./application/services/messenger-group-discovery.service"
import { MessengerGroupClassificationService } from "./application/services/messenger-group-classification.service"
import { MessengerGroupCampaignPreparationService } from "./application/services/messenger-group-campaign-preparation.service"
import { MessengerGroupExecutionStrategy } from "./application/services/messenger-group-execution-strategy.service"
import { MessengerGroupStateMachine } from "./application/services/messenger-group-state-machine.service"
import { MessengerGroupJobCoordinator } from "./application/services/messenger-group-job-coordinator.service"
import { MessengerGroupPolicyService } from "./application/services/messenger-group-policy.service"
import { GroupMessageTemplateService } from "./application/services/group-message-template.service"
import { GroupMessageVariationService } from "./application/services/group-message-variation.service"
import { MessengerGroupDelayService } from "./application/services/messenger-group-delay.service"
import { MessengerGroupVerificationService } from "./application/services/messenger-group-verification.service"
import { MessengerGroupMessagingExecutionStrategy } from "./application/services/messenger-group-messaging-execution-strategy.service"
import { MessengerGroupMessagingStateMachine } from "./application/services/messenger-group-messaging-state-machine.service"
import { MessengerGroupMessagingJobCoordinator } from "./application/services/messenger-group-messaging-job-coordinator.service"
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
    MessengerGroupPolicyService,
    GroupMessageTemplateService,
    GroupMessageVariationService,
    MessengerGroupDelayService,
    MessengerGroupVerificationService,
    MessengerGroupMessagingExecutionStrategy,
    MessengerGroupMessagingStateMachine,
    MessengerGroupMessagingJobCoordinator,
  ],
  exports: [
    MessengerGroupDiscoveryService,
    MessengerGroupClassificationService,
    MessengerGroupCampaignPreparationService,
    MessengerGroupExecutionStrategy,
    MessengerGroupStateMachine,
    MessengerGroupJobCoordinator,
    MessengerGroupPolicyService,
    GroupMessageTemplateService,
    GroupMessageVariationService,
    MessengerGroupDelayService,
    MessengerGroupVerificationService,
    MessengerGroupMessagingExecutionStrategy,
    MessengerGroupMessagingStateMachine,
    MessengerGroupMessagingJobCoordinator,
  ],
})
export class MessengerGroupModule implements OnModuleInit {
  constructor(
    private readonly registryService: AutomationRegistryService,
    private readonly facebookDriver: FacebookDriver,
    private readonly foundationStrategy: MessengerGroupExecutionStrategy,
    private readonly foundationCoordinator: MessengerGroupJobCoordinator,
    private readonly messagingStrategy: MessengerGroupMessagingExecutionStrategy,
    private readonly messagingCoordinator: MessengerGroupMessagingJobCoordinator
  ) {}

  onModuleInit() {
    const foundationPlugin: AutomationPlugin = {
      metadata: {
        id: "fb-messenger-group-plugin",
        name: "Facebook Messenger Group Assistant Foundation",
        version: "1.0.0",
        description: "Client Requirement #13: Messenger Group Assistant Foundation",
        platform: "facebook"
      },
      driver: this.facebookDriver,
      capabilities: [AutomationCapability.MESSENGER_GROUP_ASSISTANT],
      executionStrategy: this.foundationStrategy,
      jobCoordinator: this.foundationCoordinator,
      isEnabled: true,
      verify: async () => ({ status: "Success", verifiedAt: new Date() }),
      report: async () => {}
    }

    const messagingPlugin: AutomationPlugin = {
      metadata: {
        id: "fb-group-message-engine-plugin",
        name: "Facebook Messenger Group Message Engine",
        version: "1.0.0",
        description: "Client Requirement #13 Completion: Messenger Group Messaging Engine",
        platform: "facebook"
      },
      driver: this.facebookDriver,
      capabilities: [AutomationCapability.MESSENGER_GROUP_MESSAGE_ENGINE],
      executionStrategy: this.messagingStrategy,
      jobCoordinator: this.messagingCoordinator,
      isEnabled: true,
      verify: async () => ({ status: "Success", verifiedAt: new Date() }),
      report: async () => {}
    }

    this.registryService.registerPlugin(foundationPlugin)
    this.registryService.registerPlugin(messagingPlugin)
  }
}
