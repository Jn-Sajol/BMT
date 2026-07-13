import { Injectable, Inject } from '@nestjs/common';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';
import { AdSet, CampaignStatus, AdSetLifecycleHistory } from '@prisma/client';

@Injectable()
export class AdSetLifecycleRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findById(id: string): Promise<(AdSet & { campaign: any; statusDetail: any | null }) | null> {
    try {
      return await this.prisma.adSet.findUnique({
        where: { id },
        include: { campaign: true, statusDetail: true },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async updateAdSetStatus(
    adSetId: string,
    status: CampaignStatus,
    effectiveStatus: string,
    lastSyncedAt: Date,
    rawResponse: any,
    updatedBy: string,
  ): Promise<AdSet> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const adset = await tx.adSet.update({
          where: { id: adSetId },
          data: {
            status,
            updatedBy,
          },
        });

        await tx.adSetStatusDetail.upsert({
          where: { adSetId },
          update: {
            effectiveStatus,
            lastSyncedAt,
            statusRawPayload: rawResponse,
          },
          create: {
            adSetId,
            effectiveStatus,
            reviewStatus: 'APPROVED',
            deliveryStatus: 'ACTIVE',
            lastSyncedAt,
            statusRawPayload: rawResponse,
          },
        });

        return adset;
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async updateAdSetAttributes(
    adSetId: string,
    data: {
      name?: string;
      dailyBudget?: number;
      lifetimeBudget?: number;
      bidAmount?: number;
      bidStrategy?: string;
      optimizationGoal?: string;
      billingEvent?: string;
      startTime?: Date;
      endTime?: Date;
      targeting?: any;
      updatedBy: string;
    },
  ): Promise<AdSet> {
    try {
      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.dailyBudget !== undefined) updateData.dailyBudget = data.dailyBudget;
      if (data.lifetimeBudget !== undefined) updateData.lifetimeBudget = data.lifetimeBudget;
      if (data.bidStrategy !== undefined) updateData.bidStrategy = data.bidStrategy;
      if (data.optimizationGoal !== undefined) updateData.optimizationGoal = data.optimizationGoal;
      if (data.billingEvent !== undefined) updateData.billingEvent = data.billingEvent;
      if (data.startTime !== undefined) updateData.startTime = data.startTime;
      if (data.endTime !== undefined) updateData.endTime = data.endTime;
      if (data.targeting !== undefined) updateData.targeting = data.targeting;
      updateData.updatedBy = data.updatedBy;

      return await this.prisma.adSet.update({
        where: { id: adSetId },
        data: updateData,
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async insertHistory(
    adSetId: string,
    action: string,
    beforeStatus: string,
    afterStatus: string,
    performedBy: string,
    performedAt: Date,
    metaResponse: any,
  ): Promise<AdSetLifecycleHistory> {
    try {
      return await this.prisma.adSetLifecycleHistory.create({
        data: {
          adSetId,
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
