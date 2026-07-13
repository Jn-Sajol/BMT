import { Module, OnModuleInit, Inject } from '@nestjs/common';
import { ProviderCapabilityRegistry } from './infrastructure/registry/provider-capability-registry';
import { ProviderCapabilityController } from './presentation/provider-capability.controller';
import { IProviderCapabilityRegistry } from './domain/ports/provider-capability-registry.interface';

@Module({
  controllers: [ProviderCapabilityController],
  providers: [
    {
      provide: 'IProviderCapabilityRegistry',
      useClass: ProviderCapabilityRegistry,
    },
  ],
  exports: [
    'IProviderCapabilityRegistry',
  ],
})
export class ProviderCapabilityRegistryModule implements OnModuleInit {
  constructor(
    @Inject('IProviderCapabilityRegistry')
    private readonly registry: IProviderCapabilityRegistry,
  ) {}

  onModuleInit() {
    this.registry.registerProvider({
      provider: 'Meta',
      supportsAutomation: true,
      supportsRealtimeWebhook: true,
      supportsInsightsSync: true,
      supportsCreativeEdit: false,
      supportsBudgetSchedule: true,
    });

    this.registry.registerProvider({
      provider: 'Google Ads',
      supportsAutomation: true,
      supportsRealtimeWebhook: false,
      supportsInsightsSync: true,
      supportsCreativeEdit: true,
      supportsBudgetSchedule: true,
    });

    this.registry.registerProvider({
      provider: 'TikTok',
      supportsAutomation: true,
      supportsRealtimeWebhook: true,
      supportsInsightsSync: true,
      supportsCreativeEdit: false,
      supportsBudgetSchedule: false,
    });
  }
}
