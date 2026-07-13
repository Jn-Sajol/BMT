import { Injectable, Inject } from '@nestjs/common';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';

@Injectable()
export class MetaStatusRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findCampaignStatusDetail(campaignId: string): Promise<any | null> {
    try {
      return await this.prisma.campaignStatusDetail.findUnique({
        where: { campaignId },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findAdSetStatusDetail(adSetId: string): Promise<any | null> {
    try {
      return await this.prisma.adSetStatusDetail.findUnique({
        where: { adSetId },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findAdStatusDetail(adId: string): Promise<any | null> {
    try {
      return await this.prisma.adStatusDetail.findUnique({
        where: { adId },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async updateCampaignStatus(
    campaignId: string,
    effectiveStatus: string,
    reviewStatus: string,
    deliveryStatus: string,
    rawPayload: any,
    lastSyncedAt: Date,
  ): Promise<void> {
    try {
      await this.prisma.campaignStatusDetail.upsert({
        where: { campaignId },
        update: {
          effectiveStatus,
          reviewStatus,
          deliveryStatus,
          lastSyncedAt,
          statusRawPayload: rawPayload,
        },
        create: {
          campaignId,
          effectiveStatus,
          reviewStatus,
          deliveryStatus,
          lastSyncedAt,
          statusRawPayload: rawPayload,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async updateAdSetStatus(
    adSetId: string,
    effectiveStatus: string,
    reviewStatus: string,
    deliveryStatus: string,
    rawPayload: any,
    lastSyncedAt: Date,
  ): Promise<void> {
    try {
      await this.prisma.adSetStatusDetail.upsert({
        where: { adSetId },
        update: {
          effectiveStatus,
          reviewStatus,
          deliveryStatus,
          lastSyncedAt,
          statusRawPayload: rawPayload,
        },
        create: {
          adSetId,
          effectiveStatus,
          reviewStatus,
          deliveryStatus,
          lastSyncedAt,
          statusRawPayload: rawPayload,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async updateAdStatus(
    adId: string,
    effectiveStatus: string,
    reviewStatus: string,
    deliveryStatus: string,
    rawPayload: any,
    lastSyncedAt: Date,
  ): Promise<void> {
    try {
      await this.prisma.adStatusDetail.upsert({
        where: { adId },
        update: {
          effectiveStatus,
          reviewStatus,
          deliveryStatus,
          lastSyncedAt,
          statusRawPayload: rawPayload,
        },
        create: {
          adId,
          effectiveStatus,
          reviewStatus,
          deliveryStatus,
          lastSyncedAt,
          statusRawPayload: rawPayload,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }
}
