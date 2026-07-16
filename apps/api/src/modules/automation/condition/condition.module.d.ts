import { OnModuleInit } from '@nestjs/common';
import { IConditionRegistry } from './domain/ports/condition-registry.interface';
import { ILocalizationService } from './domain/ports/localization-service.interface';
export declare class ConditionModule implements OnModuleInit {
    private readonly registry;
    private readonly localization;
    constructor(registry: IConditionRegistry, localization: ILocalizationService);
    onModuleInit(): void;
}
