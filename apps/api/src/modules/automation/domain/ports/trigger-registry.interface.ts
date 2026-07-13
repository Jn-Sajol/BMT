import { ITriggerProvider } from './trigger-provider.interface';

export interface ITriggerRegistry {
  registerProvider(provider: ITriggerProvider): void;
  getProviders(): ITriggerProvider[];
  getProviderForSource(source: string): ITriggerProvider | undefined;
}
