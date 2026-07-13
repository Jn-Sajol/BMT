import { Injectable, Inject } from '@nestjs/common';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';
import { Campaign, CampaignStatus, CampaignLifecycleHistory } from '@prisma/client';

@Injectable()
export class CampaignLifecycleRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findById(id: string): Promise<(Campaign & { statusDetail: any | null }) | null> {
    try {
      return await this.prisma.campaign.findUnique({
        where: { id },
        include: { statusDetail: true },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async updateCampaignStatus(
    campaignId: string,
    status: CampaignStatus,
    effectiveStatus: string,
    lastSyncedAt: Date,
    rawResponse: any,
    updatedBy: string,
  ): Promise<Campaign> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const campaign = await tx.campaign.update({
          where: { id: campaignId },
          data: {
            status,
            updatedBy,
          },
        });

        await tx.campaignStatusDetail.upsert({
          where: { campaignId },
          update: {
            effectiveStatus,
            lastSyncedAt,
            statusRawPayload: rawResponse,
          },
          create: {
            campaignId,
            effectiveStatus,
            reviewStatus: 'APPROVED',
            deliveryStatus: 'ACTIVE',
            lastSyncedAt,
            statusRawPayload: rawResponse,
          },
        });

        return campaign;
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async updateCampaignAttributes(
    campaignId: string,
    name?: string,
    specialAdCategory?: string,
    buyingType?: string,
    updatedBy?: string,
  ): Promise<Campaign> {
    try {
      const data: any = {};
      if (name !== undefined) data.name = name;
      if (specialAdCategory !== undefined) data.specialAdCategory = specialAdCategory;
      if (buyingType !== undefined) data.buyingType = buyingType;
      if (updatedBy !== undefined) data.updatedBy = updatedBy;

      return await this.prisma.campaign.update({
        where: { id: campaignId },
        data,
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async insertHistory(
    campaignId: string,
    action: string,
    beforeStatus: string,
    afterStatus: string,
    performedBy: string,
    performedAt: Date,
    metaResponse: any,
  ): Promise<CampaignLifecycleHistory> {
    try {
      return await this.prisma.campaignLifecycleHistory.create({
        data: {
          campaignId,
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
