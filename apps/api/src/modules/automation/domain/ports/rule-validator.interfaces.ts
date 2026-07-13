export interface ITriggerValidator {
  supports(triggerType: string): boolean;
  validate(triggerData: any): void;
}

export interface IConditionValidator {
  supports(conditionType: string): boolean;
  validate(conditionData: any): void;
}

export interface IActionValidator {
  supports(actionType: string): boolean;
  validate(actionData: any): void;
}
