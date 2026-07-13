import { Injectable, Inject } from '@nestjs/common';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';
import { WebhookInbox } from '@prisma/client';

@Injectable()
export class WebhookInboxRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findByKey(idempotencyKey: string): Promise<WebhookInbox | null> {
    try {
      return await this.prisma.webhookInbox.findUnique({
        where: { idempotencyKey },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async insertEvent(
    provider: string,
    externalId: string,
    idempotencyKey: string,
    payload: any,
  ): Promise<WebhookInbox> {
    try {
      return await this.prisma.webhookInbox.create({
        data: {
          provider,
          externalId,
          idempotencyKey,
          payload,
          status: 'PENDING',
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async updateStatus(
    id: string,
    status: string,
    errorMessage: string | null = null,
    processedAt: Date | null = null,
  ): Promise<WebhookInbox> {
    try {
      return await this.prisma.webhookInbox.update({
        where: { id },
        data: {
          status,
          errorMessage,
          processedAt,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }
}
