import { OnModuleInit } from '@nestjs/common';
import { MetaTriggerProvider } from './infrastructure/providers/meta-trigger-provider';
import { ITriggerRegistry } from './domain/ports/trigger-registry.interface';
export declare class AutomationModule implements OnModuleInit {
    private readonly registry;
    private readonly metaProvider;
    constructor(registry: ITriggerRegistry, metaProvider: MetaTriggerProvider);
    onModuleInit(): void;
}
