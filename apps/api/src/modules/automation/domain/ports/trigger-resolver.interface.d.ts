import { DomainEvent } from '../models/domain-event.model';
import { AutomationRule, AutomationRuleVersion } from '@prisma/client';
export interface ITriggerResolver {
    resolveMatchingRules(event: DomainEvent): Promise<(AutomationRule & {
        versions: AutomationRuleVersion[];
    })[]>;
}
