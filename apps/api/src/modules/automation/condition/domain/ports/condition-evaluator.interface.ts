export interface ConditionEvaluationResult {
  matched: boolean;
  leftValue: any;
  operator: string;
  rightValue: any;
  evaluatorName: string;
}

export interface IConditionEvaluator {
  operator: string;
  evaluate(leftValue: any, rightValue: any, context?: any): ConditionEvaluationResult;
}
