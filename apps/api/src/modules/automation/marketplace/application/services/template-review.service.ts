import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { PRISMA_CLIENT } from '../../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { IEventBus } from '../../../application/ports/event-bus.interface';
import { DomainEvent } from '../../../domain/models/domain-event.model';
import { randomUUID } from 'crypto';

@Injectable()
export class TemplateReviewService {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
    @Inject('IEventBus')
    private readonly eventBus: IEventBus,
  ) {}

  async createReview(
    workspaceId: string,
    templateId: string,
    rating: number,
    comment: string,
  ): Promise<any> {
    const template = await this.prisma.automationTemplate.findUnique({
      where: { id: templateId },
    });
    if (!template) {
      throw new NotFoundException(`Template ${templateId} not found.`);
    }

    const installed = await this.prisma.automationTemplateInstallation.findFirst({
      where: { templateId, workspaceId, status: 'ACTIVE' },
    });

    const isVerified = !!installed;

    const review = await this.prisma.automationTemplateReview.create({
      data: {
        templateId,
        workspaceId,
        rating,
        comment,
        isVerified,
      },
    });

    await this.publishEvent('TemplateReviewCreated', workspaceId, review.id, {
      templateId,
      rating,
    });

    return review;
  }

  async deleteReview(workspaceId: string, id: string): Promise<void> {
    const review = await this.prisma.automationTemplateReview.findUnique({
      where: { id },
    });
    if (!review || review.workspaceId !== workspaceId) {
      throw new NotFoundException(`Review record ${id} not found.`);
    }

    await this.prisma.automationTemplateReview.delete({
      where: { id },
    });
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
      source: 'Marketplace Review Service',
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
