import { Injectable, Inject } from '@nestjs/common';
import { IConditionResolver } from '../../domain/ports/condition-resolver.interface';
import { IConditionRegistry } from '../../domain/ports/condition-registry.interface';
import { PropertyResolver } from './property-resolver.service';
import { ConditionEvaluationResult } from '../../domain/ports/condition-evaluator.interface';
import { ConditionEvaluationException } from '../../domain/exceptions/condition-evaluation.exception';

@Injectable()
export class ConditionResolver implements IConditionResolver {
  constructor(
    @Inject('IConditionRegistry')
    private readonly registry: IConditionRegistry,
    private readonly propertyResolver: PropertyResolver,
  ) {}

  evaluateCondition(
    path: string,
    operator: string,
    rightValue: any,
    context: any,
  ): ConditionEvaluationResult {
    const metadata = { path, operator, rightValue };

    const leftValue = this.propertyResolver.resolve(context, path);

    if (leftValue === undefined && operator !== 'IS_EMPTY' && operator !== 'IS_NOT_EMPTY') {
      throw new ConditionEvaluationException(`Field path "${path}" resolved to undefined in the context.`, metadata);
    }

    const evaluator = this.registry.getEvaluator(operator);
    if (!evaluator) {
      throw new ConditionEvaluationException(`Unknown operator: "${operator}".`, metadata);
    }

    if (rightValue === null && operator !== 'EQUALS' && operator !== 'NOT_EQUALS' && operator !== '==' && operator !== '!=') {
      throw new ConditionEvaluationException(`Null comparison is invalid for operator: "${operator}".`, metadata);
    }

    try {
      return evaluator.evaluate(leftValue, rightValue, context);
    } catch (err: any) {
      throw new ConditionEvaluationException(err.message, { ...metadata, leftValue });
    }
  }
}
