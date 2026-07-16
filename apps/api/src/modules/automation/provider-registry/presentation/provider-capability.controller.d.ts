import { IProviderCapabilityRegistry } from '../domain/ports/provider-capability-registry.interface';
export declare class ProviderCapabilityController {
    private readonly registry;
    constructor(registry: IProviderCapabilityRegistry);
    getCapabilities(provider: string): Promise<import("../domain/ports/provider-capabilities.interface").ProviderCapabilities>;
    listProviders(): Promise<string[]>;
}
