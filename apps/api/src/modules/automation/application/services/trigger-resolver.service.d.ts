import { ITriggerResolver } from '../../domain/ports/trigger-resolver.interface';
import { AutomationRuleRepository } from '../../../../infrastructure/database/repositories/automation-rule.repository';
import { DomainEvent } from '../../domain/models/domain-event.model';
import { AutomationRule, AutomationRuleVersion } from '@prisma/client';
export declare class TriggerResolver implements ITriggerResolver {
    private readonly ruleRepo;
    constructor(ruleRepo: AutomationRuleRepository);
    resolveMatchingRules(event: DomainEvent): Promise<(AutomationRule & {
        versions: AutomationRuleVersion[];
    })[]>;
}
