import { Injectable } from '@nestjs/common';
import { ITriggerResolver } from '../../domain/ports/trigger-resolver.interface';
import { AutomationRuleRepository } from '../../../../infrastructure/database/repositories/automation-rule.repository';
import { DomainEvent } from '../../domain/models/domain-event.model';
import { AutomationRule, AutomationRuleVersion } from '@prisma/client';

@Injectable()
export class TriggerResolver implements ITriggerResolver {
  constructor(private readonly ruleRepo: AutomationRuleRepository) {}

  async resolveMatchingRules(event: DomainEvent): Promise<(AutomationRule & { versions: AutomationRuleVersion[] })[]> {
    const activeRules = await this.ruleRepo.findActiveRulesByTriggerType(event.name, event.workspaceId);

    return activeRules.sort((a, b) => {
      const priorityA = (a.versions[0]?.trigger as any)?.priority || 0;
      const priorityB = (b.versions[0]?.trigger as any)?.priority || 0;

      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }
      return a.name.localeCompare(b.name);
    });
  }
}
