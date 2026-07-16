"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeWindowEvaluator = exports.DayOfWeekEvaluator = exports.IsNotEmptyEvaluator = exports.IsEmptyEvaluator = exports.MatchRegexEvaluator = exports.NotInEvaluator = exports.InEvaluator = exports.EndsWithEvaluator = exports.StartsWithEvaluator = exports.ContainsEvaluator = exports.BetweenEvaluator = exports.LessThanOrEqualAliasEvaluator = exports.LessThanOrEqualEvaluator = exports.LessThanAliasEvaluator = exports.LessThanEvaluator = exports.GreaterThanOrEqualAliasEvaluator = exports.GreaterThanOrEqualEvaluator = exports.GreaterThanAliasEvaluator = exports.GreaterThanEvaluator = exports.NotEqualsAliasEvaluator = exports.NotEqualsEvaluator = exports.EqualsAliasEvaluator = exports.EqualsEvaluator = void 0;
class EqualsEvaluator {
    operator = 'EQUALS';
    evaluate(leftValue, rightValue) {
        const matched = leftValue === rightValue;
        return { matched, leftValue, operator: this.operator, rightValue, evaluatorName: 'EqualsEvaluator' };
    }
}
exports.EqualsEvaluator = EqualsEvaluator;
class EqualsAliasEvaluator extends EqualsEvaluator {
    operator = '==';
}
exports.EqualsAliasEvaluator = EqualsAliasEvaluator;
class NotEqualsEvaluator {
    operator = 'NOT_EQUALS';
    evaluate(leftValue, rightValue) {
        const matched = leftValue !== rightValue;
        return { matched, leftValue, operator: this.operator, rightValue, evaluatorName: 'NotEqualsEvaluator' };
    }
}
exports.NotEqualsEvaluator = NotEqualsEvaluator;
class NotEqualsAliasEvaluator extends NotEqualsEvaluator {
    operator = '!=';
}
exports.NotEqualsAliasEvaluator = NotEqualsAliasEvaluator;
class GreaterThanEvaluator {
    operator = 'GREATER_THAN';
    evaluate(leftValue, rightValue) {
        const matched = Number(leftValue) > Number(rightValue);
        return { matched, leftValue, operator: this.operator, rightValue, evaluatorName: 'GreaterThanEvaluator' };
    }
}
exports.GreaterThanEvaluator = GreaterThanEvaluator;
class GreaterThanAliasEvaluator extends GreaterThanEvaluator {
    operator = '>';
}
exports.GreaterThanAliasEvaluator = GreaterThanAliasEvaluator;
class GreaterThanOrEqualEvaluator {
    operator = 'GREATER_THAN_OR_EQUAL';
    evaluate(leftValue, rightValue) {
        const matched = Number(leftValue) >= Number(rightValue);
        return { matched, leftValue, operator: this.operator, rightValue, evaluatorName: 'GreaterThanOrEqualEvaluator' };
    }
}
exports.GreaterThanOrEqualEvaluator = GreaterThanOrEqualEvaluator;
class GreaterThanOrEqualAliasEvaluator extends GreaterThanOrEqualEvaluator {
    operator = '>=';
}
exports.GreaterThanOrEqualAliasEvaluator = GreaterThanOrEqualAliasEvaluator;
class LessThanEvaluator {
    operator = 'LESS_THAN';
    evaluate(leftValue, rightValue) {
        const matched = Number(leftValue) < Number(rightValue);
        return { matched, leftValue, operator: this.operator, rightValue, evaluatorName: 'LessThanEvaluator' };
    }
}
exports.LessThanEvaluator = LessThanEvaluator;
class LessThanAliasEvaluator extends LessThanEvaluator {
    operator = '<';
}
exports.LessThanAliasEvaluator = LessThanAliasEvaluator;
class LessThanOrEqualEvaluator {
    operator = 'LESS_THAN_OR_EQUAL';
    evaluate(leftValue, rightValue) {
        const matched = Number(leftValue) <= Number(rightValue);
        return { matched, leftValue, operator: this.operator, rightValue, evaluatorName: 'LessThanOrEqualEvaluator' };
    }
}
exports.LessThanOrEqualEvaluator = LessThanOrEqualEvaluator;
class LessThanOrEqualAliasEvaluator extends LessThanOrEqualEvaluator {
    operator = '<=';
}
exports.LessThanOrEqualAliasEvaluator = LessThanOrEqualAliasEvaluator;
class BetweenEvaluator {
    operator = 'BETWEEN';
    evaluate(leftValue, rightValue) {
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
exports.BetweenEvaluator = BetweenEvaluator;
class ContainsEvaluator {
    operator = 'CONTAINS';
    evaluate(leftValue, rightValue) {
        const matched = typeof leftValue === 'string' && leftValue.includes(rightValue);
        return { matched, leftValue, operator: this.operator, rightValue, evaluatorName: 'ContainsEvaluator' };
    }
}
exports.ContainsEvaluator = ContainsEvaluator;
class StartsWithEvaluator {
    operator = 'STARTS_WITH';
    evaluate(leftValue, rightValue) {
        const matched = typeof leftValue === 'string' && leftValue.startsWith(rightValue);
        return { matched, leftValue, operator: this.operator, rightValue, evaluatorName: 'StartsWithEvaluator' };
    }
}
exports.StartsWithEvaluator = StartsWithEvaluator;
class EndsWithEvaluator {
    operator = 'ENDS_WITH';
    evaluate(leftValue, rightValue) {
        const matched = typeof leftValue === 'string' && leftValue.endsWith(rightValue);
        return { matched, leftValue, operator: this.operator, rightValue, evaluatorName: 'EndsWithEvaluator' };
    }
}
exports.EndsWithEvaluator = EndsWithEvaluator;
class InEvaluator {
    operator = 'IN';
    evaluate(leftValue, rightValue) {
        if (!Array.isArray(rightValue)) {
            throw new Error('IN operator rightValue must be an array');
        }
        const lookupSet = new Set(rightValue);
        const matched = lookupSet.has(leftValue);
        return { matched, leftValue, operator: this.operator, rightValue, evaluatorName: 'InEvaluator' };
    }
}
exports.InEvaluator = InEvaluator;
class NotInEvaluator {
    operator = 'NOT_IN';
    evaluate(leftValue, rightValue) {
        if (!Array.isArray(rightValue)) {
            throw new Error('NOT_IN operator rightValue must be an array');
        }
        const lookupSet = new Set(rightValue);
        const matched = !lookupSet.has(leftValue);
        return { matched, leftValue, operator: this.operator, rightValue, evaluatorName: 'NotInEvaluator' };
    }
}
exports.NotInEvaluator = NotInEvaluator;
class MatchRegexEvaluator {
    operator = 'MATCH_REGEX';
    evaluate(leftValue, rightValue) {
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
exports.MatchRegexEvaluator = MatchRegexEvaluator;
class IsEmptyEvaluator {
    operator = 'IS_EMPTY';
    evaluate(leftValue) {
        const matched = leftValue === null || leftValue === undefined || leftValue === '' || (Array.isArray(leftValue) && leftValue.length === 0);
        return { matched, leftValue, operator: this.operator, rightValue: null, evaluatorName: 'IsEmptyEvaluator' };
    }
}
exports.IsEmptyEvaluator = IsEmptyEvaluator;
class IsNotEmptyEvaluator {
    operator = 'IS_NOT_EMPTY';
    evaluate(leftValue) {
        const matched = leftValue !== null && leftValue !== undefined && leftValue !== '' && (!Array.isArray(leftValue) || leftValue.length > 0);
        return { matched, leftValue, operator: this.operator, rightValue: null, evaluatorName: 'IsNotEmptyEvaluator' };
    }
}
exports.IsNotEmptyEvaluator = IsNotEmptyEvaluator;
class DayOfWeekEvaluator {
    localization;
    operator = 'DAY_OF_WEEK';
    constructor(localization) {
        this.localization = localization;
    }
    evaluate(leftValue, rightValue, context) {
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
exports.DayOfWeekEvaluator = DayOfWeekEvaluator;
class TimeWindowEvaluator {
    operator = 'TIME_WINDOW';
    evaluate(leftValue, rightValue) {
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
exports.TimeWindowEvaluator = TimeWindowEvaluator;
//# sourceMappingURL=core-evaluators.js.map