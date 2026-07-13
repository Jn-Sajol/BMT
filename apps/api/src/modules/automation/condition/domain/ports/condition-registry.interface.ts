import { IConditionEvaluator } from './condition-evaluator.interface';

export interface IConditionRegistry {
  registerEvaluator(evaluator: IConditionEvaluator): void;
  getEvaluator(operator: string): IConditionEvaluator | undefined;
  getEvaluators(): IConditionEvaluator[];
}
