import { IActionRegistry } from '../../domain/ports/action-registry.interface';
import { IActionExecutor } from '../../domain/ports/action-executor.interface';
export declare class ActionRegistry implements IActionRegistry {
    private executors;
    registerExecutor(executor: IActionExecutor): void;
    getExecutor(actionType: string): IActionExecutor | undefined;
    getExecutors(): IActionExecutor[];
}
