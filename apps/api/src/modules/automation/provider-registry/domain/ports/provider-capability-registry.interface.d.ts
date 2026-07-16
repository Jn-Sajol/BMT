import { ProviderCapabilities } from './provider-capabilities.interface';
export interface IProviderCapabilityRegistry {
    registerProvider(capabilities: ProviderCapabilities): void;
    getCapabilities(provider: string): ProviderCapabilities | undefined;
    getProviders(): string[];
}
