import { Injectable, Inject } from '@nestjs/common';
import { Campaign, CampaignHistory } from '@prisma/client';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';

@Injectable()
export class CampaignRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findById(id: string): Promise<Campaign | null> {
    try {
      return await this.prisma.campaign.findFirst({
        where: { id, deletedAt: null },
        include: { labels: true, tags: true },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findByWorkspaceId(workspaceId: string): Promise<Campaign[]> {
    try {
      return await this.prisma.campaign.findMany({
        where: { workspaceId, deletedAt: null },
        include: { labels: true, tags: true },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async save(entity: Campaign, labels: string[] = [], tags: string[] = []): Promise<Campaign> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const saved = await tx.campaign.upsert({
          where: { id: entity.id || '' },
          update: {
            name: entity.name,
            objective: entity.objective,
            buyingType: entity.buyingType,
            specialAdCategory: entity.specialAdCategory,
            status: entity.status,
            draftVersion: entity.draftVersion,
            publishedVersion: entity.publishedVersion,
            isPublished: entity.isPublished,
            updatedBy: entity.updatedBy,
            deletedAt: entity.deletedAt,
            externalCampaignId: entity.externalCampaignId,
            publishedAt: entity.publishedAt,
            publishedBy: entity.publishedBy,
            publishResponse: entity.publishResponse || undefined,
          },
          create: {
            workspaceId: entity.workspaceId,
            organizationId: entity.organizationId,
            metaBusinessId: entity.metaBusinessId,
            metaAdAccountId: entity.metaAdAccountId,
            name: entity.name,
            objective: entity.objective,
            buyingType: entity.buyingType,
            specialAdCategory: entity.specialAdCategory,
            status: entity.status,
            draftVersion: entity.draftVersion,
            publishedVersion: entity.publishedVersion,
            isPublished: entity.isPublished,
            createdBy: entity.createdBy,
            updatedBy: entity.updatedBy,
            deletedAt: entity.deletedAt,
            externalCampaignId: entity.externalCampaignId,
            publishedAt: entity.publishedAt,
            publishedBy: entity.publishedBy,
            publishResponse: entity.publishResponse || undefined,
          },
        });

        // Re-create labels
        await tx.campaignLabel.deleteMany({ where: { campaignId: saved.id } });
        if (labels.length > 0) {
          await tx.campaignLabel.createMany({
            data: labels.map((name) => ({ campaignId: saved.id, name })),
          });
        }

        // Re-create tags
        await tx.campaignTag.deleteMany({ where: { campaignId: saved.id } });
        if (tags.length > 0) {
          await tx.campaignTag.createMany({
            data: tags.map((name) => ({ campaignId: saved.id, name })),
          });
        }

        return await tx.campaign.findFirstOrThrow({
          where: { id: saved.id },
          include: { labels: true, tags: true },
        });
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async saveHistory(history: CampaignHistory): Promise<CampaignHistory> {
    try {
      return await this.prisma.campaignHistory.create({
        data: {
          campaignId: history.campaignId,
          version: history.version,
          snapshot: history.snapshot as any,
          authorId: history.authorId,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findHistoryByCampaignId(campaignId: string): Promise<CampaignHistory[]> {
    try {
      return await this.prisma.campaignHistory.findMany({
        where: { campaignId },
        orderBy: { version: 'desc' },
        include: { author: true },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findHistoryByCampaignIdAndVersion(campaignId: string, version: number): Promise<CampaignHistory | null> {
    try {
      return await this.prisma.campaignHistory.findFirst({
        where: { campaignId, version },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }
}
