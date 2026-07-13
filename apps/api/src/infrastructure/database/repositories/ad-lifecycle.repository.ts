import { Injectable, Inject } from '@nestjs/common';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';
import { Ad, CampaignStatus, AdLifecycleHistory } from '@prisma/client';

@Injectable()
export class AdLifecycleRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findById(id: string): Promise<(Ad & { statusDetail: any | null }) | null> {
    try {
      return await this.prisma.ad.findUnique({
        where: { id },
        include: { statusDetail: true },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findByExternalAdId(externalAdId: string): Promise<Ad | null> {
    try {
      return await this.prisma.ad.findFirst({
        where: { externalAdId, deletedAt: null },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async updateAdStatus(
    adId: string,
    status: CampaignStatus,
    effectiveStatus: string,
    lastSyncedAt: Date,
    rawResponse: any,
    updatedBy: string,
  ): Promise<Ad> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const ad = await tx.ad.update({
          where: { id: adId },
          data: {
            status,
            updatedBy,
          },
        });

        await tx.adStatusDetail.upsert({
          where: { adId },
          update: {
            effectiveStatus,
            lastSyncedAt,
            statusRawPayload: rawResponse,
          },
          create: {
            adId,
            effectiveStatus,
            reviewStatus: 'PENDING_REVIEW',
            deliveryStatus: 'INACTIVE',
            lastSyncedAt,
            statusRawPayload: rawResponse,
          },
        });

        return ad;
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async updateAdAttributes(
    adId: string,
    data: {
      name?: string;
      creativeId?: string;
      trackingSpecs?: any;
      updatedBy: string;
    },
  ): Promise<Ad> {
    try {
      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.creativeId !== undefined) updateData.creativeId = data.creativeId;
      if (data.trackingSpecs !== undefined) updateData.trackingSpecs = data.trackingSpecs;
      updateData.updatedBy = data.updatedBy;

      return await this.prisma.ad.update({
        where: { id: adId },
        data: updateData,
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async insertHistory(
    adId: string,
    action: string,
    beforeStatus: string,
    afterStatus: string,
    performedBy: string,
    performedAt: Date,
    metaResponse: any,
  ): Promise<AdLifecycleHistory> {
    try {
      return await this.prisma.adLifecycleHistory.create({
        data: {
          adId,
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
