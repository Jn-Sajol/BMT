import { IActionExecutor } from './action-executor.interface';
export interface IActionRegistry {
    registerExecutor(executor: IActionExecutor): void;
    getExecutor(actionType: string): IActionExecutor | undefined;
    getExecutors(): IActionExecutor[];
}
