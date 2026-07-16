import { ConditionEvaluationResult } from './condition-evaluator.interface';
export interface IConditionResolver {
    evaluateCondition(path: string, operator: string, rightValue: any, context: any): ConditionEvaluationResult;
}
