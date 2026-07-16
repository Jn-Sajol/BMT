import { IConditionRegistry } from '../../domain/ports/condition-registry.interface';
import { IConditionEvaluator } from '../../domain/ports/condition-evaluator.interface';
export declare class ConditionRegistry implements IConditionRegistry {
    private evaluators;
    registerEvaluator(evaluator: IConditionEvaluator): void;
    getEvaluator(operator: string): IConditionEvaluator | undefined;
    getEvaluators(): IConditionEvaluator[];
}
