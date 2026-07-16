import { IConditionResolver } from '../../domain/ports/condition-resolver.interface';
import { IConditionRegistry } from '../../domain/ports/condition-registry.interface';
import { PropertyResolver } from './property-resolver.service';
import { ConditionEvaluationResult } from '../../domain/ports/condition-evaluator.interface';
export declare class ConditionResolver implements IConditionResolver {
    private readonly registry;
    private readonly propertyResolver;
    constructor(registry: IConditionRegistry, propertyResolver: PropertyResolver);
    evaluateCondition(path: string, operator: string, rightValue: any, context: any): ConditionEvaluationResult;
}
