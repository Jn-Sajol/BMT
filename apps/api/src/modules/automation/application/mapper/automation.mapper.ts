import { Injectable } from '@nestjs/common';
import { AutomationRule, AutomationRuleVersion } from '@prisma/client';

@Injectable()
export class AutomationMapper {
  toResponse(rule: AutomationRule & { versions: AutomationRuleVersion[] }): any {
    const latestVersion = rule.versions[0] || null;
    return {
      id: rule.id,
      workspaceId: rule.workspaceId,
      name: rule.name,
      description: rule.description,
      status: rule.status,
      schemaVersion: rule.schemaVersion,
      createdBy: rule.createdBy,
      createdAt: rule.createdAt,
      updatedAt: rule.updatedAt,
      latestVersion: latestVersion ? {
        id: latestVersion.id,
        version: latestVersion.version,
        trigger: latestVersion.trigger,
        conditions: latestVersion.conditions,
        actions: latestVersion.actions,
        ast: latestVersion.ast,
        status: latestVersion.status,
        createdBy: latestVersion.createdBy,
        createdAt: latestVersion.createdAt,
      } : null,
    };
  }

  toResponseList(rules: (AutomationRule & { versions: AutomationRuleVersion[] })[]): any[] {
    return rules.map((r) => this.toResponse(r));
  }
}
