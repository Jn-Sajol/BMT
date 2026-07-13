import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { WorkflowCompilerService } from './workflow-compiler.service';
import { WorkflowValidationService } from './workflow-validation.service';
import { PRISMA_CLIENT } from '../../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { IEventBus } from '../../../application/ports/event-bus.interface';
import { DomainEvent } from '../../../domain/models/domain-event.model';
import { randomUUID } from 'crypto';

@Injectable()
export class WorkflowManagementService {
  constructor(
    private readonly compiler: WorkflowCompilerService,
    private readonly validator: WorkflowValidationService,
    @Inject('IEventBus')
    private readonly eventBus: IEventBus,
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async saveDraft(workspaceId: string, id: string, name: string, canvasJson: any): Promise<any> {
    const existing = await this.prisma.automationWorkflow.findUnique({
      where: { id },
    });
    if (!existing) {
      const workflow = await this.prisma.automationWorkflow.create({
        data: {
          id,
          workspaceId,
          name,
          status: 'DRAFT',
          activeVersion: 1,
        },
      });

      await this.prisma.automationWorkflowVersion.create({
        data: {
          workflowId: id,
          version: 1,
          canvasJson: canvasJson || {},
          definitionJson: {},
          checksum: 'draft',
          authorId: randomUUID(),
        },
      });

      await this.publishEvent('Workflow Created', workspaceId, id, { workflowId: id });
      return workflow;
    }

    await this.prisma.automationWorkflow.update({
      where: { id },
      data: { name, updatedAt: new Date() },
    });

    await this.prisma.automationWorkflowVersion.upsert({
      where: {
        workflowId_version: { workflowId: id, version: 1 },
      },
      update: {
        canvasJson: canvasJson || {},
      },
      create: {
        workflowId: id,
        version: 1,
        canvasJson: canvasJson || {},
        definitionJson: {},
        checksum: 'draft',
        authorId: randomUUID(),
      },
    });

    await this.publishEvent('Workflow Updated', workspaceId, id, { workflowId: id });
    return existing;
  }

  async publishWorkflow(workspaceId: string, id: string, authorId: string, notes?: string): Promise<any> {
    const workflow = await this.prisma.automationWorkflow.findUnique({
      where: { id },
    });
    if (!workflow) {
      throw new NotFoundException(`Workflow ${id} not found.`);
    }

    const draft = await this.prisma.automationWorkflowVersion.findUnique({
      where: {
        workflowId_version: { workflowId: id, version: 1 },
      },
    });
    if (!draft) {
      throw new BadRequestException('Draft version 1 not found.');
    }

    const valResult = await this.validator.validate(draft.canvasJson);
    if (!valResult.isValid) {
      throw new BadRequestException(`Workflow compilation failed validation rules: ${valResult.issues[0]?.message}`);
    }

    const compResult = await this.compiler.compile(draft.canvasJson);

    const maxVer = await this.prisma.automationWorkflowVersion.aggregate({
      where: { workflowId: id },
      _max: { version: true },
    });
    const nextVer = (maxVer._max.version || 1) + 1;

    const publishedVersion = await this.prisma.automationWorkflowVersion.create({
      data: {
        workflowId: id,
        version: nextVer,
        canvasJson: draft.canvasJson as any,
        definitionJson: compResult.definitionJson,
        checksum: compResult.checksum,
        authorId,
        publishNotes: notes || '',
      },
    });

    await this.prisma.automationWorkflow.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        activeVersion: nextVer,
      },
    });

    await this.publishEvent('Workflow Published', workspaceId, id, { workflowId: id, version: nextVer, checksum: compResult.checksum });
    return publishedVersion;
  }

  async rollbackWorkflow(workspaceId: string, id: string, targetVersion: number): Promise<any> {
    const target = await this.prisma.automationWorkflowVersion.findUnique({
      where: {
        workflowId_version: { workflowId: id, version: targetVersion },
      },
    });
    if (!target || targetVersion === 1) {
      throw new NotFoundException(`Published version ${targetVersion} not found.`);
    }

    await this.prisma.automationWorkflowVersion.update({
      where: {
        workflowId_version: { workflowId: id, version: 1 },
      },
      data: {
        canvasJson: target.canvasJson as any,
      },
    });

    await this.prisma.automationWorkflow.update({
      where: { id },
      data: {
        activeVersion: targetVersion,
        status: 'PUBLISHED',
      },
    });

    await this.publishEvent('Workflow Rolled Back', workspaceId, id, { workflowId: id, targetVersion });
    return target;
  }

  private async publishEvent(name: string, workspaceId: string, causationId: string, payload: any) {
    const event: DomainEvent = {
      id: randomUUID(),
      name,
      workspaceId,
      payload: {
        entityId: causationId,
        ...payload,
      },
      triggerVersion: '1.0',
      source: 'Workflow Designer',
      correlationId: randomUUID(),
      causationId,
      occurredAt: new Date(),
      receivedAt: new Date(),
      processedAt: new Date(),
      timestamp: new Date(),
    };
    await this.eventBus.publish(event);
  }
}
