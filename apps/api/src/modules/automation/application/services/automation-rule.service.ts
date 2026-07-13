import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { AutomationRuleRepository } from '../../../../infrastructure/database/repositories/automation-rule.repository';
import { AutomationValidationService } from './automation-validation.service';
import { CreateAutomationRuleDto, UpdateAutomationRuleDto } from '../dto/automation-rule.dto';
import { AutomationRule, AutomationRuleVersion } from '@prisma/client';

@Injectable()
export class AutomationRuleService {
  constructor(
    private readonly ruleRepo: AutomationRuleRepository,
    private readonly validator: AutomationValidationService,
  ) {}

  async createRule(
    workspaceId: string,
    dto: CreateAutomationRuleDto,
    createdBy: string,
  ): Promise<AutomationRule & { versions: AutomationRuleVersion[] }> {
    const existing = await this.ruleRepo.findRuleByName(dto.name, workspaceId);
    if (existing) {
      throw new BadRequestException(`Automation rule with name "${dto.name}" already exists in this workspace.`);
    }

    const schemaVersion = dto.schemaVersion || 1;

    const { ast } = this.validator.validateAndCompile(
      dto.trigger,
      dto.conditions,
      dto.actions,
      schemaVersion,
    );

    return await this.ruleRepo.createRule(
      workspaceId,
      dto.name,
      dto.description || null,
      dto.trigger,
      dto.conditions || null,
      dto.actions,
      ast,
      schemaVersion,
      createdBy,
    );
  }

  async updateRule(
    id: string,
    workspaceId: string,
    dto: UpdateAutomationRuleDto,
    updatedBy: string,
  ): Promise<AutomationRule & { versions: AutomationRuleVersion[] }> {
    const rule = await this.ruleRepo.findRuleById(id, workspaceId);
    if (!rule) {
      throw new NotFoundException(`Automation rule not found.`);
    }

    const latest = rule.versions[0];
    if (!latest) {
      throw new BadRequestException('No rule version exists for this rule.');
    }

    const mergedTrigger = dto.trigger !== undefined ? dto.trigger : latest.trigger;
    const mergedConditions = dto.conditions !== undefined ? dto.conditions : latest.conditions;
    const mergedActions = (dto.actions !== undefined ? dto.actions : latest.actions) as any[];

    const { ast } = this.validator.validateAndCompile(
      mergedTrigger,
      mergedConditions,
      mergedActions,
      rule.schemaVersion,
    );

    const nextVersionNumber = latest.version + 1;

    await this.ruleRepo.createNewVersion(
      id,
      workspaceId,
      nextVersionNumber,
      mergedTrigger,
      mergedConditions,
      mergedActions,
      ast,
      'DRAFT',
      updatedBy,
    );

    await this.ruleRepo.updateRule(id, workspaceId, {
      name: dto.name,
      description: dto.description,
      status: 'DRAFT',
    });

    const updatedRule = await this.ruleRepo.findRuleById(id, workspaceId);
    if (!updatedRule) {
      throw new NotFoundException('Updated rule could not be loaded.');
    }
    return updatedRule;
  }

  async publishRule(id: string, workspaceId: string): Promise<AutomationRule & { versions: AutomationRuleVersion[] }> {
    const rule = await this.ruleRepo.findRuleById(id, workspaceId);
    if (!rule) {
      throw new NotFoundException(`Automation rule not found.`);
    }

    const latest = rule.versions[0];
    if (!latest) {
      throw new BadRequestException('No draft version exists to publish.');
    }

    await this.ruleRepo.updateRuleVersionStatus(id, latest.id, workspaceId, 'PUBLISHED');
    await this.ruleRepo.updateRule(id, workspaceId, { status: 'PUBLISHED' });

    const updated = await this.ruleRepo.findRuleById(id, workspaceId);
    if (!updated) throw new NotFoundException('Published rule could not be loaded.');
    return updated;
  }

  async activateRule(id: string, workspaceId: string): Promise<AutomationRule & { versions: AutomationRuleVersion[] }> {
    const rule = await this.ruleRepo.findRuleById(id, workspaceId);
    if (!rule) {
      throw new NotFoundException(`Automation rule not found.`);
    }

    const latest = rule.versions[0];
    if (!latest || latest.status === 'DRAFT') {
      throw new BadRequestException('Rule must be published before activation.');
    }

    await this.ruleRepo.updateRuleVersionStatus(id, latest.id, workspaceId, 'ACTIVE');
    await this.ruleRepo.updateRule(id, workspaceId, { status: 'ACTIVE' });

    const updated = await this.ruleRepo.findRuleById(id, workspaceId);
    if (!updated) throw new NotFoundException('Activated rule could not be loaded.');
    return updated;
  }

  async disableRule(id: string, workspaceId: string): Promise<AutomationRule & { versions: AutomationRuleVersion[] }> {
    const rule = await this.ruleRepo.findRuleById(id, workspaceId);
    if (!rule) {
      throw new NotFoundException(`Automation rule not found.`);
    }

    const latest = rule.versions[0];
    if (!latest) throw new BadRequestException('No version exists.');

    await this.ruleRepo.updateRuleVersionStatus(id, latest.id, workspaceId, 'DISABLED');
    await this.ruleRepo.updateRule(id, workspaceId, { status: 'DISABLED' });

    const updated = await this.ruleRepo.findRuleById(id, workspaceId);
    if (!updated) throw new NotFoundException('Disabled rule could not be loaded.');
    return updated;
  }

  async archiveRule(id: string, workspaceId: string): Promise<AutomationRule & { versions: AutomationRuleVersion[] }> {
    const rule = await this.ruleRepo.findRuleById(id, workspaceId);
    if (!rule) {
      throw new NotFoundException(`Automation rule not found.`);
    }

    const latest = rule.versions[0];
    if (latest) {
      await this.ruleRepo.updateRuleVersionStatus(id, latest.id, workspaceId, 'ARCHIVED');
    }
    await this.ruleRepo.updateRule(id, workspaceId, { status: 'ARCHIVED' });

    const updated = await this.ruleRepo.findRuleById(id, workspaceId);
    if (!updated) throw new NotFoundException('Archived rule could not be loaded.');
    return updated;
  }

  async getRule(id: string, workspaceId: string): Promise<AutomationRule & { versions: AutomationRuleVersion[] }> {
    const rule = await this.ruleRepo.findRuleById(id, workspaceId);
    if (!rule) {
      throw new NotFoundException(`Automation rule not found.`);
    }
    return rule;
  }

  async listRules(workspaceId: string): Promise<(AutomationRule & { versions: AutomationRuleVersion[] })[]> {
    return await this.ruleRepo.findRulesByWorkspace(workspaceId);
  }
}
