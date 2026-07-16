import { OnModuleInit } from '@nestjs/common';
import { IProviderCapabilityRegistry } from './domain/ports/provider-capability-registry.interface';
export declare class ProviderCapabilityRegistryModule implements OnModuleInit {
    private readonly registry;
    constructor(registry: IProviderCapabilityRegistry);
    onModuleInit(): void;
}
