import { IActionRegistry } from '../../domain/ports/action-registry.interface';
import { ActionExecutionContext, ActionExecutionResult } from '../../domain/ports/action-executor.interface';
import { IEventBus } from '../../../application/ports/event-bus.interface';
export declare class ActionResolver {
    private readonly registry;
    private readonly eventBus;
    constructor(registry: IActionRegistry, eventBus: IEventBus);
    executeActions(actions: any[], policy: string | undefined, context: Omit<ActionExecutionContext, 'actionId'>): Promise<ActionExecutionResult[]>;
    private publishEvent;
}
