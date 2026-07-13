import { Module, OnModuleInit, Inject } from '@nestjs/common';
import { InsightsCollectionEngine } from './application/services/insights-collection-engine.service';
import { InsightsProviderRegistry } from './infrastructure/registry/insights-provider-registry';
import { MetaInsightsProvider } from './infrastructure/adapters/meta-insights.provider';
import { InsightsController } from './presentation/insights.controller';
import { ActionModule } from '../action/action.module';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { IInsightsProviderRegistry } from './domain/ports/insights-provider-registry.interface';

@Module({
  imports: [DatabaseModule, ActionModule],
  controllers: [InsightsController],
  providers: [
    InsightsCollectionEngine,
    MetaInsightsProvider,
    {
      provide: 'IInsightsProviderRegistry',
      useClass: InsightsProviderRegistry,
    },
  ],
  exports: [
    InsightsCollectionEngine,
    'IInsightsProviderRegistry',
  ],
})
export class InsightsModule implements OnModuleInit {
  constructor(
    @Inject('IInsightsProviderRegistry')
    private readonly registry: IInsightsProviderRegistry,
    private readonly metaProvider: MetaInsightsProvider,
  ) {}

  onModuleInit() {
    this.registry.registerProvider(this.metaProvider);
  }
}
