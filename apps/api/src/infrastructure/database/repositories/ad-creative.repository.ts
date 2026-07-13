import { Injectable, Inject } from '@nestjs/common';
import { AdCreative, AdCreativeHistory } from '@prisma/client';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';

@Injectable()
export class AdCreativeRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findById(id: string): Promise<AdCreative | null> {
    try {
      return await this.prisma.adCreative.findFirst({
        where: { id, deletedAt: null },
        include: { labels: true, tags: true },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findByCampaignId(campaignId: string): Promise<AdCreative[]> {
    try {
      return await this.prisma.adCreative.findMany({
        where: { campaignId, deletedAt: null },
        include: { labels: true, tags: true },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async save(entity: AdCreative, labels: string[] = [], tags: string[] = []): Promise<AdCreative> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const saved = await tx.adCreative.upsert({
          where: { id: entity.id || '' },
          update: {
            creativeType: entity.creativeType,
            name: entity.name,
            primaryText: entity.primaryText,
            headline: entity.headline,
            description: entity.description,
            callToAction: entity.callToAction,
            destinationUrl: entity.destinationUrl,
            displayLink: entity.displayLink,
            caption: entity.caption,
            linkDescription: entity.linkDescription,
            facebookPageId: entity.facebookPageId,
            instagramAccountId: entity.instagramAccountId,
            mediaType: entity.mediaType,
            mediaAssetId: entity.mediaAssetId,
            thumbnailAssetId: entity.thumbnailAssetId,
            pixelId: entity.pixelId,
            trackingParameters: entity.trackingParameters as any,
            creativeSpec: entity.creativeSpec as any,
            status: entity.status,
            draftVersion: entity.draftVersion,
            updatedBy: entity.updatedBy,
            deletedAt: entity.deletedAt,
            publishedAt: entity.publishedAt,
            publishedBy: entity.publishedBy,
            externalCreativeId: entity.externalCreativeId,
            publishResponse: entity.publishResponse || undefined,
          },
          create: {
            campaignId: entity.campaignId,
            creativeType: entity.creativeType,
            name: entity.name,
            primaryText: entity.primaryText,
            headline: entity.headline,
            description: entity.description,
            callToAction: entity.callToAction,
            destinationUrl: entity.destinationUrl,
            displayLink: entity.displayLink,
            caption: entity.caption,
            linkDescription: entity.linkDescription,
            facebookPageId: entity.facebookPageId,
            instagramAccountId: entity.instagramAccountId,
            mediaType: entity.mediaType,
            mediaAssetId: entity.mediaAssetId,
            thumbnailAssetId: entity.thumbnailAssetId,
            pixelId: entity.pixelId,
            trackingParameters: entity.trackingParameters as any,
            creativeSpec: entity.creativeSpec as any,
            status: entity.status,
            draftVersion: entity.draftVersion,
            createdBy: entity.createdBy,
            updatedBy: entity.updatedBy,
            deletedAt: entity.deletedAt,
            publishedAt: entity.publishedAt,
            publishedBy: entity.publishedBy,
            externalCreativeId: entity.externalCreativeId,
            publishResponse: entity.publishResponse || undefined,
          },
        });

        // Re-create labels
        await tx.adCreativeLabel.deleteMany({ where: { adCreativeId: saved.id } });
        if (labels.length > 0) {
          await tx.adCreativeLabel.createMany({
            data: labels.map((name) => ({ adCreativeId: saved.id, name })),
          });
        }

        // Re-create tags
        await tx.adCreativeTag.deleteMany({ where: { adCreativeId: saved.id } });
        if (tags.length > 0) {
          await tx.adCreativeTag.createMany({
            data: tags.map((name) => ({ adCreativeId: saved.id, name })),
          });
        }

        return await tx.adCreative.findFirstOrThrow({
          where: { id: saved.id },
          include: { labels: true, tags: true },
        });
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async saveHistory(history: AdCreativeHistory): Promise<AdCreativeHistory> {
    try {
      return await this.prisma.adCreativeHistory.create({
        data: {
          adCreativeId: history.adCreativeId,
          version: history.version,
          snapshot: history.snapshot as any,
          authorId: history.authorId,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findHistoryByAdCreativeId(adCreativeId: string): Promise<AdCreativeHistory[]> {
    try {
      return await this.prisma.adCreativeHistory.findMany({
        where: { adCreativeId },
        orderBy: { version: 'desc' },
        include: { author: true },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findHistoryByAdCreativeIdAndVersion(adCreativeId: string, version: number): Promise<AdCreativeHistory | null> {
    try {
      return await this.prisma.adCreativeHistory.findFirst({
        where: { adCreativeId, version },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }
}
