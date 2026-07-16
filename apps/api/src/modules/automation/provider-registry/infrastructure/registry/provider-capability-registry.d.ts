import { IProviderCapabilityRegistry } from '../../domain/ports/provider-capability-registry.interface';
import { ProviderCapabilities } from '../../domain/ports/provider-capabilities.interface';
export declare class ProviderCapabilityRegistry implements IProviderCapabilityRegistry {
    private providers;
    registerProvider(capabilities: ProviderCapabilities): void;
    getCapabilities(provider: string): ProviderCapabilities | undefined;
    getProviders(): string[];
}
