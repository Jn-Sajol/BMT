import { Injectable, Inject } from '@nestjs/common';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';
import { AdCreative, AdCreativeLifecycleHistory } from '@prisma/client';

@Injectable()
export class AdCreativeLifecycleRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findById(id: string): Promise<(AdCreative & { campaign: any }) | null> {
    try {
      return await this.prisma.adCreative.findUnique({
        where: { id },
        include: { campaign: true },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async insertHistory(
    creativeId: string,
    action: string,
    beforeStatus: string,
    afterStatus: string,
    performedBy: string,
    performedAt: Date,
    metaResponse: any,
  ): Promise<AdCreativeLifecycleHistory> {
    try {
      return await this.prisma.adCreativeLifecycleHistory.create({
        data: {
          creativeId,
          action,
          beforeStatus,
          afterStatus,
          performedBy,
          performedAt,
          metaResponse,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }
}
