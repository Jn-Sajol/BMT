import { Module, OnModuleInit, Inject } from '@nestjs/common';
import { ActionRegistry } from './infrastructure/registry/action-registry';
import { ActionResolver } from './application/services/action-resolver.service';
import { IActionRegistry } from './domain/ports/action-registry.interface';
import { MetaModule } from '../../meta/meta.module';
import { InMemoryEventBus } from '../infrastructure/bus/in-memory-event-bus';
import * as CoreActions from './infrastructure/executors/core-actions';

@Module({
  imports: [MetaModule],
  providers: [
    ActionResolver,
    {
      provide: 'IActionRegistry',
      useClass: ActionRegistry,
    },
    {
      provide: 'IActionResolver',
      useClass: ActionResolver,
    },
    {
      provide: 'IEventBus',
      useClass: InMemoryEventBus,
    },
    CoreActions.PauseCampaignExecutor,
    CoreActions.ResumeCampaignExecutor,
    CoreActions.PauseAdSetExecutor,
    CoreActions.ResumeAdSetExecutor,
    CoreActions.PauseAdExecutor,
    CoreActions.ResumeAdExecutor,
    CoreActions.CallWebhookExecutor,
    CoreActions.SendNotificationExecutor,
  ],
  exports: [
    ActionResolver,
    'IActionRegistry',
    'IActionResolver',
    'IEventBus',
  ],
})
export class ActionModule implements OnModuleInit {
  constructor(
    @Inject('IActionRegistry')
    private readonly registry: IActionRegistry,
    private readonly pauseCampaign: CoreActions.PauseCampaignExecutor,
    private readonly resumeCampaign: CoreActions.ResumeCampaignExecutor,
    private readonly pauseAdSet: CoreActions.PauseAdSetExecutor,
    private readonly resumeAdSet: CoreActions.ResumeAdSetExecutor,
    private readonly pauseAd: CoreActions.PauseAdExecutor,
    private readonly resumeAd: CoreActions.ResumeAdExecutor,
    private readonly callWebhook: CoreActions.CallWebhookExecutor,
    private readonly sendNotification: CoreActions.SendNotificationExecutor,
  ) {}

  onModuleInit() {
    this.registry.registerExecutor(this.pauseCampaign);
    this.registry.registerExecutor(this.resumeCampaign);
    this.registry.registerExecutor(this.pauseAdSet);
    this.registry.registerExecutor(this.resumeAdSet);
    this.registry.registerExecutor(this.pauseAd);
    this.registry.registerExecutor(this.resumeAd);
    this.registry.registerExecutor(this.callWebhook);
    this.registry.registerExecutor(this.sendNotification);
  }
}
