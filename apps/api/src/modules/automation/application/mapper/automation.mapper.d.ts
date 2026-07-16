import { AutomationRule, AutomationRuleVersion } from '@prisma/client';
export declare class AutomationMapper {
    toResponse(rule: AutomationRule & {
        versions: AutomationRuleVersion[];
    }): any;
    toResponseList(rules: (AutomationRule & {
        versions: AutomationRuleVersion[];
    })[]): any[];
}
