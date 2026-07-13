import { IConditionEvaluator, ConditionEvaluationResult } from '../../domain/ports/condition-evaluator.interface';
import { ILocalizationService } from '../../domain/ports/localization-service.interface';

export class EqualsEvaluator implements IConditionEvaluator {
  operator = 'EQUALS';
  evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult {
    const matched = leftValue === rightValue;
    return { matched, leftValue, operator: this.operator, rightValue, evaluatorName: 'EqualsEvaluator' };
  }
}

export class EqualsAliasEvaluator extends EqualsEvaluator {
  override operator = '==';
}

export class NotEqualsEvaluator implements IConditionEvaluator {
  operator = 'NOT_EQUALS';
  evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult {
    const matched = leftValue !== rightValue;
    return { matched, leftValue, operator: this.operator, rightValue, evaluatorName: 'NotEqualsEvaluator' };
  }
}

export class NotEqualsAliasEvaluator extends NotEqualsEvaluator {
  override operator = '!=';
}

export class GreaterThanEvaluator implements IConditionEvaluator {
  operator = 'GREATER_THAN';
  evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult {
    const matched = Number(leftValue) > Number(rightValue);
    return { matched, leftValue, operator: this.operator, rightValue, evaluatorName: 'GreaterThanEvaluator' };
  }
}

export class GreaterThanAliasEvaluator extends GreaterThanEvaluator {
  override operator = '>';
}

export class GreaterThanOrEqualEvaluator implements IConditionEvaluator {
  operator = 'GREATER_THAN_OR_EQUAL';
  evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult {
    const matched = Number(leftValue) >= Number(rightValue);
    return { matched, leftValue, operator: this.operator, rightValue, evaluatorName: 'GreaterThanOrEqualEvaluator' };
  }
}

export class GreaterThanOrEqualAliasEvaluator extends GreaterThanOrEqualEvaluator {
  override operator = '>=';
}

export class LessThanEvaluator implements IConditionEvaluator {
  operator = 'LESS_THAN';
  evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult {
    const matched = Number(leftValue) < Number(rightValue);
    return { matched, leftValue, operator: this.operator, rightValue, evaluatorName: 'LessThanEvaluator' };
  }
}

export class LessThanAliasEvaluator extends LessThanEvaluator {
  override operator = '<';
}

export class LessThanOrEqualEvaluator implements IConditionEvaluator {
  operator = 'LESS_THAN_OR_EQUAL';
  evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult {
    const matched = Number(leftValue) <= Number(rightValue);
    return { matched, leftValue, operator: this.operator, rightValue, evaluatorName: 'LessThanOrEqualEvaluator' };
  }
}

export class LessThanOrEqualAliasEvaluator extends LessThanOrEqualEvaluator {
  override operator = '<=';
}

export class BetweenEvaluator implements IConditionEvaluator {
  operator = 'BETWEEN';
  evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult {
    if (!Array.isArray(rightValue) || rightValue.length !== 2) {
      throw new Error('Between operator rightValue must be an array of exactly 2 elements [min, max]');
    }
    const val = Number(leftValue);
    const min = Number(rightValue[0]);
    const max = Number(rightValue[1]);
    const matched = val >= min && val <= max;
    return { matched, leftValue, operator: this.operator, rightValue, evaluatorName: 'BetweenEvaluator' };
  }
}

export class ContainsEvaluator implements IConditionEvaluator {
  operator = 'CONTAINS';
  evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult {
    const matched = typeof leftValue === 'string' && leftValue.includes(rightValue);
    return { matched, leftValue, operator: this.operator, rightValue, evaluatorName: 'ContainsEvaluator' };
  }
}

export class StartsWithEvaluator implements IConditionEvaluator {
  operator = 'STARTS_WITH';
  evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult {
    const matched = typeof leftValue === 'string' && leftValue.startsWith(rightValue);
    return { matched, leftValue, operator: this.operator, rightValue, evaluatorName: 'StartsWithEvaluator' };
  }
}

export class EndsWithEvaluator implements IConditionEvaluator {
  operator = 'ENDS_WITH';
  evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult {
    const matched = typeof leftValue === 'string' && leftValue.endsWith(rightValue);
    return { matched, leftValue, operator: this.operator, rightValue, evaluatorName: 'EndsWithEvaluator' };
  }
}

export class InEvaluator implements IConditionEvaluator {
  operator = 'IN';
  evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult {
    if (!Array.isArray(rightValue)) {
      throw new Error('IN operator rightValue must be an array');
    }
    const lookupSet = new Set(rightValue);
    const matched = lookupSet.has(leftValue);
    return { matched, leftValue, operator: this.operator, rightValue, evaluatorName: 'InEvaluator' };
  }
}

export class NotInEvaluator implements IConditionEvaluator {
  operator = 'NOT_IN';
  evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult {
    if (!Array.isArray(rightValue)) {
      throw new Error('NOT_IN operator rightValue must be an array');
    }
    const lookupSet = new Set(rightValue);
    const matched = !lookupSet.has(leftValue);
    return { matched, leftValue, operator: this.operator, rightValue, evaluatorName: 'NotInEvaluator' };
  }
}

export class MatchRegexEvaluator implements IConditionEvaluator {
  operator = 'MATCH_REGEX';
  evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult {
    const pattern = String(rightValue);

    if (pattern.length > 100) {
      throw new Error('Regex pattern exceeds maximum allowed length of 100 characters.');
    }
    if (/(\+[+*?])|(\*[+*?])|(\?[+*?])/.test(pattern)) {
      throw new Error('Dangerous regex detected: Nested quantifiers are forbidden.');
    }
    if (/\([^)]+[*+?]\)[*+?]/.test(pattern)) {
      throw new Error('Dangerous regex detected: Nested groups repeats are forbidden.');
    }

    const regex = new RegExp(pattern);
    const matched = typeof leftValue === 'string' && regex.test(leftValue);
    return { matched, leftValue, operator: this.operator, rightValue, evaluatorName: 'MatchRegexEvaluator' };
  }
}

export class IsEmptyEvaluator implements IConditionEvaluator {
  operator = 'IS_EMPTY';
  evaluate(leftValue: any): ConditionEvaluationResult {
    const matched = leftValue === null || leftValue === undefined || leftValue === '' || (Array.isArray(leftValue) && leftValue.length === 0);
    return { matched, leftValue, operator: this.operator, rightValue: null, evaluatorName: 'IsEmptyEvaluator' };
  }
}

export class IsNotEmptyEvaluator implements IConditionEvaluator {
  operator = 'IS_NOT_EMPTY';
  evaluate(leftValue: any): ConditionEvaluationResult {
    const matched = leftValue !== null && leftValue !== undefined && leftValue !== '' && (!Array.isArray(leftValue) || leftValue.length > 0);
    return { matched, leftValue, operator: this.operator, rightValue: null, evaluatorName: 'IsNotEmptyEvaluator' };
  }
}

export class DayOfWeekEvaluator implements IConditionEvaluator {
  operator = 'DAY_OF_WEEK';
  constructor(private readonly localization: ILocalizationService) {}

  evaluate(leftValue: any, rightValue: any, context?: any): ConditionEvaluationResult {
    const date = leftValue instanceof Date ? leftValue : new Date(leftValue);
    if (isNaN(date.getTime())) {
      throw new Error('DAY_OF_WEEK leftValue must be a valid date');
    }
    const currentDay = this.localization.getDayOfWeek(date, context?.locale);
    const targetDays = Array.isArray(rightValue) ? rightValue : [rightValue];
    const matched = targetDays.some((day) => day.toLowerCase() === currentDay.toLowerCase());

    return { matched, leftValue: currentDay, operator: this.operator, rightValue, evaluatorName: 'DayOfWeekEvaluator' };
  }
}

export class TimeWindowEvaluator implements IConditionEvaluator {
  operator = 'TIME_WINDOW';
  evaluate(leftValue: any, rightValue: any): ConditionEvaluationResult {
    const date = leftValue instanceof Date ? leftValue : new Date(leftValue);
    if (isNaN(date.getTime())) {
      throw new Error('TIME_WINDOW leftValue must be a valid date');
    }
    if (!Array.isArray(rightValue) || rightValue.length !== 2) {
      throw new Error('TIME_WINDOW rightValue must be an array of exactly 2 elements [start, end] e.g. ["08:00", "17:00"]');
    }

    const currentHour = date.getUTCHours();
    const currentMin = date.getUTCMinutes();
    const currentMinutes = currentHour * 60 + currentMin;

    const [startH, startM] = rightValue[0].split(':').map(Number);
    const [endH, endM] = rightValue[1].split(':').map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    const matched = currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    return { matched, leftValue: `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`, operator: this.operator, rightValue, evaluatorName: 'TimeWindowEvaluator' };
  }
}
