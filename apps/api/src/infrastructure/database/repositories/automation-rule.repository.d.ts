import { ExtendedPrismaClient } from '../prisma-extensions';
import { AutomationRule, AutomationRuleVersion, AutomationAuditLog } from '@prisma/client';
export declare class AutomationRuleRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    createRule(workspaceId: string, name: string, description: string | null, trigger: any, conditions: any, actions: any[], ast: any, schemaVersion: number, createdBy: string): Promise<AutomationRule & {
        versions: AutomationRuleVersion[];
    }>;
    createNewVersion(ruleId: string, workspaceId: string, versionNumber: number, trigger: any, conditions: any, actions: any[], ast: any, status: string, createdBy: string): Promise<AutomationRuleVersion>;
    updateRule(id: string, workspaceId: string, data: {
        name?: string;
        description?: string | null;
        status?: string;
    }): Promise<AutomationRule>;
    updateRuleVersionStatus(ruleId: string, versionId: string, workspaceId: string, status: string): Promise<AutomationRuleVersion>;
    findRuleById(id: string, workspaceId: string): Promise<(AutomationRule & {
        versions: AutomationRuleVersion[];
    }) | null>;
    findRuleByName(name: string, workspaceId: string): Promise<AutomationRule | null>;
    findRulesByWorkspace(workspaceId: string): Promise<(AutomationRule & {
        versions: AutomationRuleVersion[];
    })[]>;
    findLatestVersion(ruleId: string, workspaceId: string): Promise<AutomationRuleVersion | null>;
    findActiveRulesByTriggerType(triggerType: string, workspaceId: string): Promise<(AutomationRule & {
        versions: AutomationRuleVersion[];
    })[]>;
    createAuditLog(ruleId: string, versionId: string, workspaceId: string, contextId: string | null, executionStatus: string, triggerEvaluated: boolean, conditionsMatched: boolean, actionsTaken: any, errorMessage: string | null, ruleSnapshot: any, idempotencyKey?: string | null, explainability?: any, durationMs?: number | null): Promise<AutomationAuditLog>;
}
