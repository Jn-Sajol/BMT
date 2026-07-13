import { Injectable, BadRequestException, Inject, Optional } from '@nestjs/common';
import { ITriggerValidator, IConditionValidator, IActionValidator } from '../../domain/ports/rule-validator.interfaces';

@Injectable()
export class AutomationValidationService {
  constructor(
    @Optional()
    @Inject('TRIGGER_VALIDATORS')
    private readonly triggerValidators: ITriggerValidator[] = [],
    @Optional()
    @Inject('CONDITION_VALIDATORS')
    private readonly conditionValidators: IConditionValidator[] = [],
    @Optional()
    @Inject('ACTION_VALIDATORS')
    private readonly actionValidators: IActionValidator[] = [],
  ) {}

  validateAndCompile(
    trigger: any,
    conditions: any,
    actions: any[],
    schemaVersion: number,
  ): { ast: any } {
    if (!trigger || !trigger.type) {
      throw new BadRequestException('Trigger type must be defined.');
    }
    if (!actions || !Array.isArray(actions) || actions.length === 0) {
      throw new BadRequestException('At least one action must be defined.');
    }

    // 1. Validate Trigger
    const tVal = this.triggerValidators.find((v) => v.supports(trigger.type));
    if (tVal) {
      tVal.validate(trigger);
    } else {
      this.defaultValidateTrigger(trigger);
    }

    // 2. Validate Conditions
    if (conditions) {
      this.validateConditions(conditions);
    }

    // 3. Validate Actions
    for (const action of actions) {
      if (!action.type) {
        throw new BadRequestException('Action type must be defined.');
      }
      const aVal = this.actionValidators.find((v) => v.supports(action.type));
      if (aVal) {
        aVal.validate(action);
      } else {
        this.defaultValidateAction(action);
      }
    }

    // 4. Circular Dependency Guard
    this.detectCircularDependencies(trigger, actions);

    // 5. Compile to internal AST representation
    const ast = this.compileToAST(trigger, conditions, actions, schemaVersion);

    return { ast };
  }

  private defaultValidateTrigger(trigger: any): void {
    const supportedTriggers = [
      'Manual',
      'Schedule',
      'Campaign Published',
      'Campaign Paused',
      'Campaign Archived',
      'AdSet Published',
      'Ad Published',
      'Webhook Received',
      'Insights Synced',
      'Status Changed',
    ];
    if (!supportedTriggers.includes(trigger.type)) {
      throw new BadRequestException(`Unsupported trigger type: ${trigger.type}`);
    }
  }

  private validateConditions(conditions: any): void {
    const supportedConditions = [
      'Status',
      'Spend',
      'CTR',
      'CPC',
      'CPM',
      'ROAS',
      'Frequency',
      'Reach',
      'Budget',
      'Time',
      'Custom Expression Placeholder',
    ];

    if (conditions.type && supportedConditions.includes(conditions.type)) {
      const cVal = this.conditionValidators.find((v) => v.supports(conditions.type));
      if (cVal) cVal.validate(conditions);
      return;
    }

    if (conditions.operator === 'AND' || conditions.operator === 'OR') {
      if (!Array.isArray(conditions.children)) {
        throw new BadRequestException('Logical operator condition must contain children array.');
      }
      for (const child of conditions.children) {
        this.validateConditions(child);
      }
      return;
    }

    throw new BadRequestException(`Invalid condition structure or unsupported type.`);
  }

  private defaultValidateAction(action: any): void {
    const supportedActions = [
      'Pause Campaign',
      'Resume Campaign',
      'Pause AdSet',
      'Resume AdSet',
      'Pause Ad',
      'Resume Ad',
      'Send Notification',
      'Call Webhook',
      'Future AI Action Placeholder',
    ];
    if (!supportedActions.includes(action.type)) {
      throw new BadRequestException(`Unsupported action type: ${action.type}`);
    }
  }

  private detectCircularDependencies(trigger: any, actions: any[]): void {
    // Check for self-trigger loops
    // e.g. Trigger on status changed and Action is modifying/resuming the same object type
    for (const action of actions) {
      if (trigger.type === 'Campaign Paused' && action.type === 'Pause Campaign') {
        throw new BadRequestException('Circular loop detected: trigger Campaign Paused calls Pause Campaign.');
      }
      if (trigger.type === 'Status Changed' && (action.type === 'Pause Campaign' || action.type === 'Resume Campaign')) {
        throw new BadRequestException('Circular loop warning: status change trigger modifying same status property.');
      }
    }
  }

  private compileToAST(trigger: any, conditions: any, actions: any[], schemaVersion: number): any {
    return {
      schemaVersion,
      compiledAt: new Date().toISOString(),
      triggerNode: {
        kind: 'TRIGGER',
        type: trigger.type,
        params: trigger.params || {},
      },
      conditionNode: this.compileConditionNode(conditions),
      actionNodes: actions.map((act) => ({
        kind: 'ACTION',
        type: act.type,
        params: act.params || {},
      })),
    };
  }

  private compileConditionNode(conditions: any): any {
    if (!conditions) return null;
    if (conditions.operator) {
      return {
        kind: 'LOGICAL_EXPRESSION',
        operator: conditions.operator,
        expressions: conditions.children.map((c: any) => this.compileConditionNode(c)),
      };
    }
    return {
      kind: 'COMPARISON_EXPRESSION',
      field: conditions.field || conditions.type,
      operator: conditions.operator || '==',
      value: conditions.value,
    };
  }
}
