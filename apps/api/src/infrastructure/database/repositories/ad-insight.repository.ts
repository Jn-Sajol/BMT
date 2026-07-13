import { Injectable, Inject } from '@nestjs/common';
import { AdInsight } from '@prisma/client';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';

@Injectable()
export class AdInsightRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findById(id: string): Promise<AdInsight | null> {
    try {
      return await this.prisma.adInsight.findUnique({ where: { id } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findByWorkspaceId(workspaceId: string): Promise<AdInsight[]> {
    try {
      return await this.prisma.adInsight.findMany({ where: { workspaceId } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async upsert(entity: Omit<AdInsight, 'id'>): Promise<{ insight: AdInsight; isNew: boolean }> {
    try {
      const existing = await this.prisma.adInsight.findUnique({
        where: {
          workspace_ad_object_date_provider: {
            workspaceId: entity.workspaceId,
            facebookObjectId: entity.facebookObjectId,
            date: entity.date,
            provider: entity.provider,
          },
        },
      });

      const insight = await this.prisma.adInsight.upsert({
        where: {
          workspace_ad_object_date_provider: {
            workspaceId: entity.workspaceId,
            facebookObjectId: entity.facebookObjectId,
            date: entity.date,
            provider: entity.provider,
          },
        },
        update: {
          impressions: entity.impressions,
          reach: entity.reach,
          frequency: entity.frequency,
          clicks: entity.clicks,
          uniqueClicks: entity.uniqueClicks,
          inlineLinkClicks: entity.inlineLinkClicks,
          ctr: entity.ctr,
          cpc: entity.cpc,
          cpm: entity.cpm,
          spend: entity.spend,
          purchase: entity.purchase,
          purchaseValue: entity.purchaseValue,
          addToCart: entity.addToCart,
          initiatedCheckout: entity.initiatedCheckout,
          landingPageViews: entity.landingPageViews,
          videoViews: entity.videoViews,
          video25: entity.video25,
          video50: entity.video50,
          video75: entity.video75,
          video95: entity.video95,
          video100: entity.video100,
          engagement: entity.engagement,
          comments: entity.comments,
          likes: entity.likes,
          shares: entity.shares,
          saves: entity.saves,
          rawPayload: entity.rawPayload as any,
          syncedAt: entity.syncedAt,
        },
        create: {
          workspaceId: entity.workspaceId,
          adId: entity.adId,
          facebookObjectId: entity.facebookObjectId,
          provider: entity.provider,
          date: entity.date,
          impressions: entity.impressions,
          reach: entity.reach,
          frequency: entity.frequency,
          clicks: entity.clicks,
          uniqueClicks: entity.uniqueClicks,
          inlineLinkClicks: entity.inlineLinkClicks,
          ctr: entity.ctr,
          cpc: entity.cpc,
          cpm: entity.cpm,
          spend: entity.spend,
          purchase: entity.purchase,
          purchaseValue: entity.purchaseValue,
          addToCart: entity.addToCart,
          initiatedCheckout: entity.initiatedCheckout,
          landingPageViews: entity.landingPageViews,
          videoViews: entity.videoViews,
          video25: entity.video25,
          video50: entity.video50,
          video75: entity.video75,
          video95: entity.video95,
          video100: entity.video100,
          engagement: entity.engagement,
          comments: entity.comments,
          likes: entity.likes,
          shares: entity.shares,
          saves: entity.saves,
          rawPayload: entity.rawPayload as any,
          syncedAt: entity.syncedAt,
        },
      });

      return { insight, isNew: !existing };
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }
}
