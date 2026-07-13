import { Injectable } from '@nestjs/common';
import { IActionRegistry } from '../../domain/ports/action-registry.interface';
import { IActionExecutor } from '../../domain/ports/action-executor.interface';

@Injectable()
export class ActionRegistry implements IActionRegistry {
  private executors = new Map<string, IActionExecutor>();

  registerExecutor(executor: IActionExecutor): void {
    this.executors.set(executor.actionType.toUpperCase(), executor);
  }

  getExecutor(actionType: string): IActionExecutor | undefined {
    return this.executors.get(actionType.toUpperCase());
  }

  getExecutors(): IActionExecutor[] {
    return Array.from(this.executors.values());
  }
}
