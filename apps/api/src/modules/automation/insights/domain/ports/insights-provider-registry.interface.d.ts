import { IInsightsProvider } from './insights-provider.interface';
export interface IInsightsProviderRegistry {
    registerProvider(provider: IInsightsProvider): void;
    getProvider(providerName: string): IInsightsProvider | undefined;
    getProviders(): IInsightsProvider[];
}
