import { OnModuleInit } from '@nestjs/common';
import { MetaInsightsProvider } from './infrastructure/adapters/meta-insights.provider';
import { IInsightsProviderRegistry } from './domain/ports/insights-provider-registry.interface';
export declare class InsightsModule implements OnModuleInit {
    private readonly registry;
    private readonly metaProvider;
    constructor(registry: IInsightsProviderRegistry, metaProvider: MetaInsightsProvider);
    onModuleInit(): void;
}
