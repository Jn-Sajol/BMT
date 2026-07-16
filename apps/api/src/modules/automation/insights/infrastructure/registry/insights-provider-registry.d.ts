import { IInsightsProviderRegistry } from '../../domain/ports/insights-provider-registry.interface';
import { IInsightsProvider } from '../../domain/ports/insights-provider.interface';
export declare class InsightsProviderRegistry implements IInsightsProviderRegistry {
    private providers;
    registerProvider(provider: IInsightsProvider): void;
    getProvider(providerName: string): IInsightsProvider | undefined;
    getProviders(): IInsightsProvider[];
}
