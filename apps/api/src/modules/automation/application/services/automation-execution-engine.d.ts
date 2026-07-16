import { OnModuleInit } from '@nestjs/common';
import { ExtendedPrismaClient } from '../../../../infrastructure/database/prisma-extensions';
import { AutomationRuleRepository } from '../../../../infrastructure/database/repositories/automation-rule.repository';
import { AutomationEvaluator } from './automation-evaluator.service';
import { AutomationDispatcher } from './automation-dispatcher.service';
import { IEventBus } from '../ports/event-bus.interface';
import { ITriggerResolver } from '../../domain/ports/trigger-resolver.interface';
import { DomainEvent } from '../../domain/models/domain-event.model';
import { IAutomationLifecycleHook } from '../../domain/ports/lifecycle-hook.interface';
export declare class AutomationExecutionEngine implements OnModuleInit {
    private readonly ruleRepo;
    private readonly evaluator;
    private readonly dispatcher;
    private readonly eventBus;
    private readonly resolver;
    private readonly prisma;
    private readonly hooks;
    constructor(ruleRepo: AutomationRuleRepository, evaluator: AutomationEvaluator, dispatcher: AutomationDispatcher, eventBus: IEventBus, resolver: ITriggerResolver, prisma: ExtendedPrismaClient, hooks?: IAutomationLifecycleHook[]);
    onModuleInit(): void;
    executeRuleManually(ruleId: string, workspaceId: string, payload: any, userId: string, dryRun?: boolean): Promise<any>;
    handleEvent(event: DomainEvent): Promise<void>;
    private evaluateAndExecute;
    private publishEvent;
}
