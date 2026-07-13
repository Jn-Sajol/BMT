import { Injectable } from '@nestjs/common';
import { IProviderCapabilityRegistry } from '../../domain/ports/provider-capability-registry.interface';
import { ProviderCapabilities } from '../../domain/ports/provider-capabilities.interface';

@Injectable()
export class ProviderCapabilityRegistry implements IProviderCapabilityRegistry {
  private providers = new Map<string, ProviderCapabilities>();

  registerProvider(capabilities: ProviderCapabilities): void {
    this.providers.set(capabilities.provider.toUpperCase(), capabilities);
  }

  getCapabilities(provider: string): ProviderCapabilities | undefined {
    return this.providers.get(provider.toUpperCase());
  }

  getProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}
