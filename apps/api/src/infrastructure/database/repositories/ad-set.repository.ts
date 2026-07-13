import { Injectable, Inject } from '@nestjs/common';
import { AdSet, AdSetHistory } from '@prisma/client';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';

@Injectable()
export class AdSetRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findById(id: string): Promise<AdSet | null> {
    try {
      return await this.prisma.adSet.findFirst({
        where: { id, deletedAt: null },
        include: { labels: true, tags: true },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findByCampaignId(campaignId: string): Promise<AdSet[]> {
    try {
      return await this.prisma.adSet.findMany({
        where: { campaignId, deletedAt: null },
        include: { labels: true, tags: true },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async save(entity: AdSet, labels: string[] = [], tags: string[] = []): Promise<AdSet> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const saved = await tx.adSet.upsert({
          where: { id: entity.id || '' },
          update: {
            name: entity.name,
            status: entity.status,
            optimizationGoal: entity.optimizationGoal,
            billingEvent: entity.billingEvent,
            bidStrategy: entity.bidStrategy,
            dailyBudget: entity.dailyBudget,
            lifetimeBudget: entity.lifetimeBudget,
            startTime: entity.startTime,
            endTime: entity.endTime,
            attributionSetting: entity.attributionSetting,
            targeting: entity.targeting as any,
            promotedObject: entity.promotedObject || undefined,
            metaPixelId: entity.metaPixelId,
            instagramAccountId: entity.instagramAccountId,
            facebookPageId: entity.facebookPageId,
            draftVersion: entity.draftVersion,
            updatedBy: entity.updatedBy,
            deletedAt: entity.deletedAt,
            publishedAt: entity.publishedAt,
            publishedBy: entity.publishedBy,
            externalAdSetId: entity.externalAdSetId,
            publishResponse: entity.publishResponse || undefined,
          },
          create: {
            campaignId: entity.campaignId,
            name: entity.name,
            status: entity.status,
            optimizationGoal: entity.optimizationGoal,
            billingEvent: entity.billingEvent,
            bidStrategy: entity.bidStrategy,
            dailyBudget: entity.dailyBudget,
            lifetimeBudget: entity.lifetimeBudget,
            startTime: entity.startTime,
            endTime: entity.endTime,
            attributionSetting: entity.attributionSetting,
            targeting: entity.targeting as any,
            promotedObject: entity.promotedObject || undefined,
            metaPixelId: entity.metaPixelId,
            instagramAccountId: entity.instagramAccountId,
            facebookPageId: entity.facebookPageId,
            draftVersion: entity.draftVersion,
            createdBy: entity.createdBy,
            updatedBy: entity.updatedBy,
            deletedAt: entity.deletedAt,
            publishedAt: entity.publishedAt,
            publishedBy: entity.publishedBy,
            externalAdSetId: entity.externalAdSetId,
            publishResponse: entity.publishResponse || undefined,
          },
        });

        // Re-create labels
        await tx.adSetLabel.deleteMany({ where: { adsetId: saved.id } });
        if (labels.length > 0) {
          await tx.adSetLabel.createMany({
            data: labels.map((name) => ({ adsetId: saved.id, name })),
          });
        }

        // Re-create tags
        await tx.adSetTag.deleteMany({ where: { adsetId: saved.id } });
        if (tags.length > 0) {
          await tx.adSetTag.createMany({
            data: tags.map((name) => ({ adsetId: saved.id, name })),
          });
        }

        return await tx.adSet.findFirstOrThrow({
          where: { id: saved.id },
          include: { labels: true, tags: true },
        });
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async saveHistory(history: AdSetHistory): Promise<AdSetHistory> {
    try {
      return await this.prisma.adSetHistory.create({
        data: {
          adsetId: history.adsetId,
          version: history.version,
          snapshot: history.snapshot as any,
          authorId: history.authorId,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findHistoryByAdSetId(adsetId: string): Promise<AdSetHistory[]> {
    try {
      return await this.prisma.adSetHistory.findMany({
        where: { adsetId },
        orderBy: { version: 'desc' },
        include: { author: true },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findHistoryByAdSetIdAndVersion(adsetId: string, version: number): Promise<AdSetHistory | null> {
    try {
      return await this.prisma.adSetHistory.findFirst({
        where: { adsetId, version },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }
}
