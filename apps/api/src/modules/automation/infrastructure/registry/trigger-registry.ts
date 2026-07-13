import { Injectable } from '@nestjs/common';
import { ITriggerRegistry } from '../../domain/ports/trigger-registry.interface';
import { ITriggerProvider } from '../../domain/ports/trigger-provider.interface';

@Injectable()
export class TriggerRegistry implements ITriggerRegistry {
  private providers: ITriggerProvider[] = [];

  registerProvider(provider: ITriggerProvider): void {
    if (!this.providers.some((p) => p.providerName === provider.providerName)) {
      this.providers.push(provider);
    }
  }

  getProviders(): ITriggerProvider[] {
    return this.providers;
  }

  getProviderForSource(source: string): ITriggerProvider | undefined {
    return this.providers.find((p) => p.supports(source));
  }
}
