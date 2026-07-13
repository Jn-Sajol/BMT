import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class AutomationEvaluator {
  evaluate(conditionNode: any, payload: any): boolean {
    if (!conditionNode) {
      return true;
    }

    if (conditionNode.kind === 'LOGICAL_EXPRESSION') {
      const operator = conditionNode.operator;
      const expressions = conditionNode.expressions || [];

      if (operator === 'AND') {
        for (const exp of expressions) {
          if (!this.evaluate(exp, payload)) {
            return false;
          }
        }
        return true;
      } else if (operator === 'OR') {
        for (const exp of expressions) {
          if (this.evaluate(exp, payload)) {
            return true;
          }
        }
        return false;
      }
      throw new BadRequestException(`Unsupported logical operator: ${operator}`);
    }

    if (conditionNode.kind === 'COMPARISON_EXPRESSION') {
      const field = conditionNode.field;
      const operator = conditionNode.operator;
      const targetValue = conditionNode.value;

      const actualValue = payload[field];
      if (actualValue === undefined) {
        return false;
      }

      switch (operator) {
        case '==':
        case 'EQUALS':
          return actualValue === targetValue;
        case '!=':
        case 'NOT_EQUALS':
          return actualValue !== targetValue;
        case '>':
        case 'GREATER_THAN':
          return Number(actualValue) > Number(targetValue);
        case '>=':
        case 'GREATER_THAN_OR_EQUAL':
          return Number(actualValue) >= Number(targetValue);
        case '<':
        case 'LESS_THAN':
          return Number(actualValue) < Number(targetValue);
        case '<=':
        case 'LESS_THAN_OR_EQUAL':
          return Number(actualValue) <= Number(targetValue);
        default:
          throw new BadRequestException(`Unsupported comparison operator: ${operator}`);
      }
    }

    throw new BadRequestException(`Unknown AST condition node kind: ${conditionNode.kind}`);
  }
}
