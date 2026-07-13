import { Injectable, Inject } from '@nestjs/common';
import { Ad, AdHistory } from '@prisma/client';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';

@Injectable()
export class AdRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findById(id: string): Promise<Ad | null> {
    try {
      return await this.prisma.ad.findFirst({
        where: { id, deletedAt: null },
        include: { labels: true, tags: true },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findByWorkspaceId(workspaceId: string): Promise<Ad[]> {
    try {
      return await this.prisma.ad.findMany({
        where: { workspaceId, deletedAt: null },
        include: { labels: true, tags: true },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findByCampaignId(campaignId: string): Promise<Ad[]> {
    try {
      return await this.prisma.ad.findMany({
        where: { campaignId, deletedAt: null },
        include: { labels: true, tags: true },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findByAdSetId(adSetId: string): Promise<Ad[]> {
    try {
      return await this.prisma.ad.findMany({
        where: { adSetId, deletedAt: null },
        include: { labels: true, tags: true },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async save(entity: Ad, labels: string[] = [], tags: string[] = []): Promise<Ad> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const saved = await tx.ad.upsert({
          where: { id: entity.id || '' },
          update: {
            name: entity.name,
            status: entity.status,
            draftVersion: entity.draftVersion,
            updatedBy: entity.updatedBy,
            deletedAt: entity.deletedAt,
            publishedAt: entity.publishedAt,
            publishedBy: entity.publishedBy,
            externalAdId: entity.externalAdId,
            publishResponse: entity.publishResponse || undefined,
            trackingSpecs: entity.trackingSpecs as any,
            displayStatus: entity.displayStatus,
            reviewStatus: entity.reviewStatus,
          },
          create: {
            workspaceId: entity.workspaceId,
            campaignId: entity.campaignId,
            adSetId: entity.adSetId,
            creativeId: entity.creativeId,
            name: entity.name,
            status: entity.status,
            draftVersion: entity.draftVersion,
            createdBy: entity.createdBy,
            updatedBy: entity.updatedBy,
            deletedAt: entity.deletedAt,
            publishedAt: entity.publishedAt,
            publishedBy: entity.publishedBy,
            externalAdId: entity.externalAdId,
            publishResponse: entity.publishResponse || undefined,
            trackingSpecs: entity.trackingSpecs as any,
            displayStatus: entity.displayStatus,
            reviewStatus: entity.reviewStatus,
          },
        });

        await tx.adLabel.deleteMany({ where: { adId: saved.id } });
        if (labels.length > 0) {
          await tx.adLabel.createMany({
            data: labels.map((name) => ({ adId: saved.id, name })),
          });
        }

        await tx.adTag.deleteMany({ where: { adId: saved.id } });
        if (tags.length > 0) {
          await tx.adTag.createMany({
            data: tags.map((name) => ({ adId: saved.id, name })),
          });
        }

        return await tx.ad.findFirstOrThrow({
          where: { id: saved.id },
          include: { labels: true, tags: true },
        });
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async saveHistory(history: AdHistory): Promise<AdHistory> {
    try {
      return await this.prisma.adHistory.create({
        data: {
          adId: history.adId,
          version: history.version,
          snapshot: history.snapshot as any,
          authorId: history.authorId,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findHistoryByAdId(adId: string): Promise<AdHistory[]> {
    try {
      return await this.prisma.adHistory.findMany({
        where: { adId },
        orderBy: { version: 'desc' },
        include: { author: true },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findHistoryByAdIdAndVersion(adId: string, version: number): Promise<AdHistory | null> {
    try {
      return await this.prisma.adHistory.findFirst({
        where: { adId, version },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }
}
