import { Injectable, Inject } from '@nestjs/common';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';
import { AutomationRule, AutomationRuleVersion, AutomationAuditLog } from '@prisma/client';

@Injectable()
export class AutomationRuleRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async createRule(
    workspaceId: string,
    name: string,
    description: string | null,
    trigger: any,
    conditions: any,
    actions: any[],
    ast: any,
    schemaVersion: number,
    createdBy: string,
  ): Promise<AutomationRule & { versions: AutomationRuleVersion[] }> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const rule = await tx.automationRule.create({
          data: {
            workspaceId,
            name,
            description,
            status: 'DRAFT',
            schemaVersion,
            createdBy,
          },
        });

        const version = await tx.automationRuleVersion.create({
          data: {
            ruleId: rule.id,
            version: 1,
            trigger,
            conditions: conditions || {},
            actions,
            ast,
            status: 'DRAFT',
            createdBy,
          },
        });

        return { ...rule, versions: [version] };
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async createNewVersion(
    ruleId: string,
    workspaceId: string,
    versionNumber: number,
    trigger: any,
    conditions: any,
    actions: any[],
    ast: any,
    status: string,
    createdBy: string,
  ): Promise<AutomationRuleVersion> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const rule = await tx.automationRule.findFirst({
          where: { id: ruleId, workspaceId },
        });
        if (!rule) {
          throw new Error('Automation rule access denied or not found.');
        }

        return await tx.automationRuleVersion.create({
          data: {
            ruleId,
            version: versionNumber,
            trigger,
            conditions: conditions || {},
            actions,
            ast,
            status,
            createdBy,
          },
        });
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async updateRule(
    id: string,
    workspaceId: string,
    data: { name?: string; description?: string | null; status?: string },
  ): Promise<AutomationRule> {
    try {
      return await this.prisma.automationRule.update({
        where: { id, workspaceId },
        data,
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async updateRuleVersionStatus(
    ruleId: string,
    versionId: string,
    workspaceId: string,
    status: string,
  ): Promise<AutomationRuleVersion> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const rule = await tx.automationRule.findFirst({
          where: { id: ruleId, workspaceId },
        });
        if (!rule) {
          throw new Error('Access denied or rule not found.');
        }

        return await tx.automationRuleVersion.update({
          where: { id: versionId, ruleId },
          data: { status },
        });
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findRuleById(id: string, workspaceId: string): Promise<(AutomationRule & { versions: AutomationRuleVersion[] }) | null> {
    try {
      return await this.prisma.automationRule.findFirst({
        where: { id, workspaceId },
        include: { versions: { orderBy: { version: 'desc' } } },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findRuleByName(name: string, workspaceId: string): Promise<AutomationRule | null> {
    try {
      return await this.prisma.automationRule.findUnique({
        where: { workspaceId_name: { workspaceId, name } },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findRulesByWorkspace(workspaceId: string): Promise<(AutomationRule & { versions: AutomationRuleVersion[] })[]> {
    try {
      return await this.prisma.automationRule.findMany({
        where: { workspaceId },
        include: { versions: { orderBy: { version: 'desc' } } },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findLatestVersion(ruleId: string, workspaceId: string): Promise<AutomationRuleVersion | null> {
    try {
      const rule = await this.prisma.automationRule.findFirst({
        where: { id: ruleId, workspaceId },
      });
      if (!rule) return null;

      return await this.prisma.automationRuleVersion.findFirst({
        where: { ruleId },
        orderBy: { version: 'desc' },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findActiveRulesByTriggerType(
    triggerType: string,
    workspaceId: string,
  ): Promise<(AutomationRule & { versions: AutomationRuleVersion[] })[]> {
    try {
      return await this.prisma.automationRule.findMany({
        where: {
          workspaceId,
          status: 'ACTIVE',
          versions: {
            some: {
              status: 'ACTIVE',
              trigger: {
                path: ['type'],
                equals: triggerType,
              },
            },
          },
        },
        include: {
          versions: {
            where: { status: 'ACTIVE' },
            orderBy: { version: 'desc' },
          },
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async createAuditLog(
    ruleId: string,
    versionId: string,
    workspaceId: string,
    contextId: string | null,
    executionStatus: string,
    triggerEvaluated: boolean,
    conditionsMatched: boolean,
    actionsTaken: any,
    errorMessage: string | null,
    ruleSnapshot: any,
    idempotencyKey?: string | null,
    explainability?: any,
    durationMs?: number | null,
  ): Promise<AutomationAuditLog> {
    try {
      return await this.prisma.automationAuditLog.create({
        data: {
          ruleId,
          versionId,
          workspaceId,
          contextId,
          idempotencyKey: idempotencyKey || null,
          executionStatus,
          triggerEvaluated,
          conditionsMatched,
          actionsTaken,
          errorMessage,
          ruleSnapshot,
          explainability: explainability || null,
          durationMs: durationMs || null,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }
}
