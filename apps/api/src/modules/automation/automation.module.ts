import { Module, OnModuleInit, Inject } from '@nestjs/common';
import { AutomationController } from './presentation/automation.controller';
import { ExecutionMonitorController } from './presentation/execution-monitor.controller';
import { AutomationRuleService } from './application/services/automation-rule.service';
import { AutomationValidationService } from './application/services/automation-validation.service';
import { AutomationEvaluator } from './application/services/automation-evaluator.service';
import { AutomationDispatcher } from './application/services/automation-dispatcher.service';
import { AutomationExecutionEngine } from './application/services/automation-execution-engine';
import { TriggerEngine } from './application/services/trigger-engine.service';
import { TriggerResolver } from './application/services/trigger-resolver.service';
import { TriggerRegistry } from './infrastructure/registry/trigger-registry';
import { MetaTriggerProvider } from './infrastructure/providers/meta-trigger-provider';
import { ITriggerRegistry } from './domain/ports/trigger-registry.interface';
import { AutomationMapper } from './application/mapper/automation.mapper';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { SecurityModule } from '../../infrastructure/security/security.module';
import { AuthModule } from '../../application/auth/auth.module';
import { MetaModule } from '../meta/meta.module';
import { ConditionModule } from './condition/condition.module';
import { ActionModule } from './action/action.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ProviderCapabilityRegistryModule } from './provider-registry/provider-capability-registry.module';
import { InsightsModule } from './insights/insights.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ReliabilityModule } from './reliability/reliability.module';
import { DesignerModule } from './designer/designer.module';
import { NotificationModule } from './notification/notification.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { MarketplaceModule } from './marketplace/marketplace.module';

@Module({
  imports: [
    DatabaseModule,
    SecurityModule,
    AuthModule,
    MetaModule,
    ConditionModule,
    ActionModule,
    AnalyticsModule,
    ProviderCapabilityRegistryModule,
    InsightsModule,
    SchedulerModule,
    ReliabilityModule,
    DesignerModule,
    NotificationModule,
    RecommendationModule,
    MarketplaceModule,
  ],
  controllers: [AutomationController, ExecutionMonitorController],
  providers: [
    AutomationRuleService,
    AutomationValidationService,
    AutomationEvaluator,
    AutomationDispatcher,
    AutomationExecutionEngine,
    TriggerEngine,
    MetaTriggerProvider,
    AutomationMapper,
    {
      provide: 'ITriggerRegistry',
      useClass: TriggerRegistry,
    },
    {
      provide: 'ITriggerResolver',
      useClass: TriggerResolver,
    },
    {
      provide: 'TRIGGER_VALIDATORS',
      useFactory: () => [],
    },
    {
      provide: 'CONDITION_VALIDATORS',
      useFactory: () => [],
    },
    {
      provide: 'ACTION_VALIDATORS',
      useFactory: () => [],
    },
    {
      provide: 'AUTOMATION_LIFECYCLE_HOOKS',
      useFactory: () => [],
    },
  ],
  exports: [
    AutomationRuleService,
    AutomationExecutionEngine,
    TriggerEngine,
    'ITriggerRegistry',
    'ITriggerResolver',
  ],
})
export class AutomationModule implements OnModuleInit {
  constructor(
    @Inject('ITriggerRegistry')
    private readonly registry: ITriggerRegistry,
    private readonly metaProvider: MetaTriggerProvider,
  ) {}

  onModuleInit() {
    this.registry.registerProvider(this.metaProvider);
  }
}
