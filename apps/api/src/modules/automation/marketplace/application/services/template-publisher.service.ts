import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { PRISMA_CLIENT } from '../../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { IEventBus } from '../../../application/ports/event-bus.interface';
import { DomainEvent } from '../../../domain/models/domain-event.model';
import { createHash, randomUUID } from 'crypto';

@Injectable()
export class TemplatePublisherService {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
    @Inject('IEventBus')
    private readonly eventBus: IEventBus,
  ) {}

  async publish(
    workspaceId: string,
    authorId: string,
    name: string,
    description: string,
    canvasJson: any,
    visibility: 'OFFICIAL' | 'COMMUNITY' | 'PRIVATE' | 'ORGANIZATION' = 'COMMUNITY',
    version: string = '1.0.0',
    changelog: string = 'Initial release',
  ): Promise<any> {
    const checksum = createHash('sha256')
      .update(JSON.stringify(canvasJson || {}))
      .digest('hex');

    const signature = `sig-${randomUUID()}`;

    let template = await this.prisma.automationTemplate.findFirst({
      where: { name, workspaceId },
    });

    if (!template) {
      template = await this.prisma.automationTemplate.create({
        data: {
          workspaceId,
          authorId,
          name,
          description,
          visibility,
          activeVersion: version,
        },
      });

      await this.publishEvent('TemplatePublished', workspaceId, template.id, { templateId: template.id });
    }

    const existsVer = await this.prisma.automationTemplateVersion.findUnique({
      where: {
        templateId_version: { templateId: template.id, version },
      },
    });

    if (existsVer) {
      throw new BadRequestException(`Version ${version} of template "${name}" already exists.`);
    }

    const templateVersion = await this.prisma.automationTemplateVersion.create({
      data: {
        templateId: template.id,
        version,
        canvasJson: canvasJson || {},
        definitionJson: {},
        checksum,
        signature,
        changelog,
      },
    });

    await this.prisma.automationTemplate.update({
      where: { id: template.id },
      data: { activeVersion: version },
    });

    await this.publishEvent('TemplateVersionCreated', workspaceId, templateVersion.id, {
      templateId: template.id,
      version,
      checksum,
    });

    return template;
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
      source: 'Marketplace Publisher',
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
