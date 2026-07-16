import { IConditionEvaluator, ConditionEvaluationResult } from '../../domain/ports/condition-evaluator.interface';
import { ILocalizationService } from '../../domain/ports/localization-service.interface';
export declare class EqualsEvaluator implements IConditionEvaluator {
    operator: string;
    evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult;
}
export declare class EqualsAliasEvaluator extends EqualsEvaluator {
    operator: string;
}
export declare class NotEqualsEvaluator implements IConditionEvaluator {
    operator: string;
    evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult;
}
export declare class NotEqualsAliasEvaluator extends NotEqualsEvaluator {
    operator: string;
}
export declare class GreaterThanEvaluator implements IConditionEvaluator {
    operator: string;
    evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult;
}
export declare class GreaterThanAliasEvaluator extends GreaterThanEvaluator {
    operator: string;
}
export declare class GreaterThanOrEqualEvaluator implements IConditionEvaluator {
    operator: string;
    evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult;
}
export declare class GreaterThanOrEqualAliasEvaluator extends GreaterThanOrEqualEvaluator {
    operator: string;
}
export declare class LessThanEvaluator implements IConditionEvaluator {
    operator: string;
    evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult;
}
export declare class LessThanAliasEvaluator extends LessThanEvaluator {
    operator: string;
}
export declare class LessThanOrEqualEvaluator implements IConditionEvaluator {
    operator: string;
    evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult;
}
export declare class LessThanOrEqualAliasEvaluator extends LessThanOrEqualEvaluator {
    operator: string;
}
export declare class BetweenEvaluator implements IConditionEvaluator {
    operator: string;
    evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult;
}
export declare class ContainsEvaluator implements IConditionEvaluator {
    operator: string;
    evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult;
}
export declare class StartsWithEvaluator implements IConditionEvaluator {
    operator: string;
    evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult;
}
export declare class EndsWithEvaluator implements IConditionEvaluator {
    operator: string;
    evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult;
}
export declare class InEvaluator implements IConditionEvaluator {
    operator: string;
    evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult;
}
export declare class NotInEvaluator implements IConditionEvaluator {
    operator: string;
    evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult;
}
export declare class MatchRegexEvaluator implements IConditionEvaluator {
    operator: string;
    evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult;
}
export declare class IsEmptyEvaluator implements IConditionEvaluator {
    operator: string;
    evaluate(leftValue: any): ConditionEvaluationResult;
}
export declare class IsNotEmptyEvaluator implements IConditionEvaluator {
    operator: string;
    evaluate(leftValue: any): ConditionEvaluationResult;
}
export declare class DayOfWeekEvaluator implements IConditionEvaluator {
    private readonly localization;
    operator: string;
    constructor(localization: ILocalizationService);
    evaluate(leftValue: any, rightValue: any, context?: any): ConditionEvaluationResult;
}
export declare class TimeWindowEvaluator implements IConditionEvaluator {
    operator: string;
    evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult;
}
