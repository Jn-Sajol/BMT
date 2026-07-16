import { AutomationRuleRepository } from '../../../../infrastructure/database/repositories/automation-rule.repository';
import { AutomationValidationService } from './automation-validation.service';
import { CreateAutomationRuleDto, UpdateAutomationRuleDto } from '../dto/automation-rule.dto';
import { AutomationRule, AutomationRuleVersion } from '@prisma/client';
export declare class AutomationRuleService {
    private readonly ruleRepo;
    private readonly validator;
    constructor(ruleRepo: AutomationRuleRepository, validator: AutomationValidationService);
    createRule(workspaceId: string, dto: CreateAutomationRuleDto, createdBy: string): Promise<AutomationRule & {
        versions: AutomationRuleVersion[];
    }>;
    updateRule(id: string, workspaceId: string, dto: UpdateAutomationRuleDto, updatedBy: string): Promise<AutomationRule & {
        versions: AutomationRuleVersion[];
    }>;
    publishRule(id: string, workspaceId: string): Promise<AutomationRule & {
        versions: AutomationRuleVersion[];
    }>;
    activateRule(id: string, workspaceId: string): Promise<AutomationRule & {
        versions: AutomationRuleVersion[];
    }>;
    disableRule(id: string, workspaceId: string): Promise<AutomationRule & {
        versions: AutomationRuleVersion[];
    }>;
    archiveRule(id: string, workspaceId: string): Promise<AutomationRule & {
        versions: AutomationRuleVersion[];
    }>;
    getRule(id: string, workspaceId: string): Promise<AutomationRule & {
        versions: AutomationRuleVersion[];
    }>;
    listRules(workspaceId: string): Promise<(AutomationRule & {
        versions: AutomationRuleVersion[];
    })[]>;
}
