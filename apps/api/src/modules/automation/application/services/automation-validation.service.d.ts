import { ITriggerValidator, IConditionValidator, IActionValidator } from '../../domain/ports/rule-validator.interfaces';
export declare class AutomationValidationService {
    private readonly triggerValidators;
    private readonly conditionValidators;
    private readonly actionValidators;
    constructor(triggerValidators?: ITriggerValidator[], conditionValidators?: IConditionValidator[], actionValidators?: IActionValidator[]);
    validateAndCompile(trigger: any, conditions: any, actions: any[], schemaVersion: number): {
        ast: any;
    };
    private defaultValidateTrigger;
    private validateConditions;
    private defaultValidateAction;
    private detectCircularDependencies;
    private compileToAST;
    private compileConditionNode;
}
