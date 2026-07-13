import { Injectable } from '@nestjs/common';
import { IInsightsProviderRegistry } from '../../domain/ports/insights-provider-registry.interface';
import { IInsightsProvider } from '../../domain/ports/insights-provider.interface';

@Injectable()
export class InsightsProviderRegistry implements IInsightsProviderRegistry {
  private providers = new Map<string, IInsightsProvider>();

  registerProvider(provider: IInsightsProvider): void {
    this.providers.set(provider.providerName.toUpperCase(), provider);
  }

  getProvider(providerName: string): IInsightsProvider | undefined {
    return this.providers.get(providerName.toUpperCase());
  }

  getProviders(): IInsightsProvider[] {
    return Array.from(this.providers.values());
  }
}
