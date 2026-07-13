import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { ITemplateInstaller } from '../../domain/ports/template-installer.interface';
import { SignatureVerifierService } from './signature-verifier.service';
import { PRISMA_CLIENT } from '../../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { IEventBus } from '../../../application/ports/event-bus.interface';
import { DomainEvent } from '../../../domain/models/domain-event.model';
import { randomUUID } from 'crypto';

@Injectable()
export class TemplateInstallerService implements ITemplateInstaller {
  constructor(
    private readonly verifier: SignatureVerifierService,
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
    @Inject('IEventBus')
    private readonly eventBus: IEventBus,
  ) {}

  async install(workspaceId: string, templateId: string, version: string, userId: string): Promise<any> {
    const template = await this.prisma.automationTemplate.findUnique({
      where: { id: templateId },
    });
    if (!template) {
      throw new NotFoundException(`Template ${templateId} not found.`);
    }

    const templateVersion = await this.prisma.automationTemplateVersion.findUnique({
      where: {
        templateId_version: { templateId, version },
      },
    });
    if (!templateVersion) {
      throw new NotFoundException(`Template version ${version} not found.`);
    }

    const verified = await this.verifier.verify(
      templateVersion.canvasJson,
      templateVersion.signature,
      templateVersion.checksum,
    );
    if (!verified) {
      await this.publishEvent('TemplateInstallationFailed', workspaceId, templateId, {
        reason: 'Signature verification failed (package tampered or invalid signature key).',
      });
      throw new BadRequestException('Security validation failed: Invalid template signature or checksum mismatch.');
    }

    const workflowId = randomUUID();
    await this.prisma.automationWorkflow.create({
      data: {
        id: workflowId,
        workspaceId,
        name: `Installed: ${template.name}`,
        status: 'DRAFT',
        activeVersion: 1,
      },
    });

    await this.prisma.automationWorkflowVersion.create({
      data: {
        workflowId,
        version: 1,
        canvasJson: templateVersion.canvasJson as any,
        definitionJson: {},
        checksum: 'installed-draft',
        authorId: userId,
      },
    });

    const installation = await this.prisma.automationTemplateInstallation.create({
      data: {
        templateId,
        workspaceId,
        installedVersion: version,
        status: 'ACTIVE',
      },
    });

    await this.publishEvent('TemplateInstalled', workspaceId, installation.id, {
      templateId,
      installedVersion: version,
      workflowId,
    });

    return installation;
  }

  async rollback(workspaceId: string, installationId: string, targetVersion: string): Promise<any> {
    const installation = await this.prisma.automationTemplateInstallation.findUnique({
      where: { id: installationId },
    });
    if (!installation || installation.workspaceId !== workspaceId) {
      throw new NotFoundException(`Installation record ${installationId} not found.`);
    }

    const templateVer = await this.prisma.automationTemplateVersion.findUnique({
      where: {
        templateId_version: { templateId: installation.templateId, version: targetVersion },
      },
    });
    if (!templateVer) {
      throw new NotFoundException(`Rollback target version ${targetVersion} not found.`);
    }

    const updated = await this.prisma.automationTemplateInstallation.update({
      where: { id: installationId },
      data: {
        installedVersion: targetVersion,
      },
    });

    await this.publishEvent('TemplateRollbackCompleted', workspaceId, installationId, {
      templateId: installation.templateId,
      targetVersion,
    });

    return updated;
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
      source: 'Template Installer',
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
