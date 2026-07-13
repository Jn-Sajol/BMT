import { Injectable } from '@nestjs/common';
import { IConditionRegistry } from '../../domain/ports/condition-registry.interface';
import { IConditionEvaluator } from '../../domain/ports/condition-evaluator.interface';

@Injectable()
export class ConditionRegistry implements IConditionRegistry {
  private evaluators = new Map<string, IConditionEvaluator>();

  registerEvaluator(evaluator: IConditionEvaluator): void {
    this.evaluators.set(evaluator.operator.toUpperCase(), evaluator);
  }

  getEvaluator(operator: string): IConditionEvaluator | undefined {
    return this.evaluators.get(operator.toUpperCase());
  }

  getEvaluators(): IConditionEvaluator[] {
    return Array.from(this.evaluators.values());
  }
}
